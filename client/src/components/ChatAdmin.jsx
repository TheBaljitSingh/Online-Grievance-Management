import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import axios from "axios"; // Ensure axios is imported
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
      socket.current.emit("admin");
    });

    socket.current.on("receive-message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.current.on("online-users", (users) => {
      setOnlineUsers(users);
      console.log(users);
    });

    return () => {
      if (adminSocketId) {
        socket.current.emit("admin-disconnected", adminSocketId);
      }
      socket.current.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!activeUser) return;

    const fetchChatHistory = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND}/api/v1/getfilteredMessageforUser`,
          {
            params: { senderId: activeUser.user._id },
            withCredentials: true,
          }
        );
        setMessages(data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchChatHistory();
    console.log("fetch history");
  }, [activeUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!activeUser || !newMessage.trim()) return;

    const messageData = {
      senderUserId: "admin",
      recipientId: activeUser.user._id,
      messageContent: newMessage,
      timeStamp: new Date(),
    };

    console.log(activeUser);

    await axios.post(`${import.meta.env.VITE_BACKEND}/api/v1/sendMessage`,  { message: messageData.messageContent, receiverId: activeUser.user._id},{ withCredentials: true })
    .then(res=>{

      console.log("send and saved in db ", res);

    }).catch(e=>{
      console.log(e);
    })

    socket.current.emit("admin-reply", {
      ...messageData,
      recipientSocketId: activeUser.id,
    });

    setMessages((prev) => [...prev, messageData]);
    setNewMessage("");
  };

  if (loading) return <p>Loading...</p>;

  console.log(messages);

  return (
    <div>
      <Navbar />
      <div className="flex h-screen">
        <div className="w-1/4 bg-gray-200 p-4 overflow-y-auto">
          <h3 className="text-lg font-bold mb-4">Online Users</h3>
          <ul className="space-y-2">
            {onlineUsers.map((usr) => (
              <li
                key={usr.id}
                className="p-2 bg-gray-300 rounded-md cursor-pointer hover:bg-gray-400"
                onClick={() => {
                  if (usr.id !== adminSocketId) setActiveUser(usr);
                }}
              >
                {usr.user.fullname}
              </li>
            ))}
          </ul>
        </div>

        {activeUser && (
          <div className="flex-grow bg-white p-4 border-l border-gray-300">
            <h3 className="text-lg font-bold mb-4">Chat with {activeUser.user.fullname}</h3>
            <div className="h-5/6 flex flex-col justify-between">
              <div className="flex-grow overflow-y-auto mb-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-2 mb-2 rounded-md ${
                      msg.senderId === user._id
                        ? "bg-green-200 text-right"
                        : "bg-gray-200 text-left"
                    }`}
                  >
                    <p className="text-sm">{msg.messageContent || msg.message}</p>
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
                  placeholder="Type your message..."
                  className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-800 text-white rounded-r-md hover:bg-green-700"
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
