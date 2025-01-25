import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";

export default function AdminChat() {
  const { user, loading } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socket = useRef(null);

  useEffect(() => {
    if (!user) return;

    socket.current = io(import.meta.env.VITE_BACKEND);

    socket.current.on("connect", () => {
      console.log(`Admin connected: ${socket.current.id}`);

      // Send the user details (admin) to the server
      socket.current.emit("user-details", {
        userId: user._id,
        username: user.name,
        role: "admin", // Admin role
      });
    });

    // Listen for online users from the server
    socket.current.on("online-users", (users) => {
      setOnlineUsers(users);
    });

    // Listen for incoming messages
    socket.current.on("receive-message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [user]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    const messageData = {
      senderId: user._id,
      recipientId: activeUser._id, // Send message to active user
      messageContent: newMessage,
      timeStamp: new Date(),
    };

    socket.current.emit("send-message", messageData);
    setMessages((prev) => [...prev, messageData]);
    setNewMessage("");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      <div className="flex h-screen">
        {/* Online Users List */}
        <div className="w-1/4 bg-gray-200 p-4 overflow-y-auto">
          <h3 className="text-lg font-bold mb-4">Online Users</h3>
          <ul className="space-y-2">
            {onlineUsers.map((usr) => (
              <li
                key={usr}
                className="p-2 bg-gray-300 rounded-md cursor-pointer hover:bg-gray-400"
                onClick={() => setActiveUser(usr)}
              >
                {usr}
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Box */}
        {activeUser && (
          <div className="flex-grow bg-white p-4 border-l border-gray-300">
            <h3 className="text-lg font-bold mb-4">Chat with {activeUser}</h3>
            <div className="flex-grow overflow-y-auto mb-4">
              {messages
                .filter(
                  (msg) =>
                    msg.senderId === activeUser._id || msg.recipientId === activeUser._id
                )
                .map((msg, index) => (
                  <div
                    key={index}
                    className={`p-2 mb-2 rounded-md ${
                      msg.senderId === user._id
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
        )}
      </div>
    </div>
  );
}
