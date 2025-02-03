import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";

export default function AdminChat() {
  const { user, loading } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef(null);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeUser, setActiveUser] = useState(null);



  const [adminSocketId, setAdminSocketId] = useState(null);

  useEffect(() => {
    if (!user) return;

    socket.current = io(import.meta.env.VITE_BACKEND);

    socket.current.on("connect", () => {
      setAdminSocketId(socket.current.id);
    });

    socket.current.emit("admin");

  

    // Listen for incoming messages
    socket.current.on("receive-message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.current.on("online-users", (users)=>{
      setOnlineUsers(users);
      console.log(users);
    });


    socket.current.on("disconnect", () => {
      if (adminSocketId) {
        socket.current.emit("admin-disconnected", adminSocketId);
      }
    });


    return () => {
      
      if (adminSocketId) {
        socket.current.emit("admin-disconnected", adminSocketId);
      }
      socket.current.disconnect();

    };
  }, [user]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if(!activeUser) return;

    const messageData = {
      senderUserId: "admin",
      recipientId: activeUser.id, // doubt
      messageContent: newMessage,
      timeStamp: new Date(),
    };

    socket.current.emit("admin-reply", messageData);
    console.log(messageData);
    setMessages((prev) => [...prev, messageData]);
    setNewMessage("");
  };

  if (loading) return <p>Loading...</p>;


  // console.log("active user is this ", activeUser);
  console.log("messages: ", messages);

  return (
    <div>
      <Navbar />
      <div className="flex h-screen">
        {/* Online Users List */}
        <div className="w-1/4 bg-gray-200 p-4 overflow-y-auto">
        <div className=" flex-row inline-block">
          <h3 className="text-lg font-bold mb-4">Online Users</h3>
  {onlineUsers.length > 0 && (
    <span class="relative flex size-3">
    <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
    <span class="relative inline-flex size-3 rounded-full bg-green-500"></span>
  </span>
  )}
</div>


         
          <ul className="space-y-2 flex flex-col">
            {onlineUsers.map((usr) => (
              
              <li
                key={usr.id} // unique id
                className="p-2 bg-gray-300 rounded-md cursor-pointer hover:bg-gray-400"
                onClick={ ()=>{
                  if(usr.id!== adminSocketId)
                  setActiveUser(usr)
                }  }
              >
                {usr.user.fullname}
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Box */}
        {activeUser && (
          <div className="flex-grow bg-white p-4 border-l border-gray-300">
            <h3 className="text-lg font-bold mb-4">Chat with this: {activeUser.user.fullname}</h3>


            <div className="h-5/6  flex flex-col justify-between ">
            <div className="flex-grow overflow-y-auto mb-4">
              {messages
                .filter(
                  (msg) =>
                    msg.senderId === activeUser.id || msg.recipientId === activeUser.id
                )
                .map((msg, index) => (
                  <div
                    key={index}
                    className={`p-2 mb-2 rounded-md ${
                      msg.senderUserId === "admin"
                        ? "bg-green-200 text-right"
                        : "bg-gray-200 text-left"
                    }`}
                  >
                    <p className="text-sm">{msg.messageContent}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(msg.timeStamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
            </div>


            <form onSubmit={handleSendMessage} className="flex mt-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Admin Type your message..."
                className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none"
                />
              <button
                type="submit"
                className="px-4 py-2 flex bottom-0 bg-green-800 text-white rounded-r-md hover:bg-green-700"
                >
                Send
              </button>
            </form>
                </div>
          </div>
        )}
      </div>
    </div>
  );
}
