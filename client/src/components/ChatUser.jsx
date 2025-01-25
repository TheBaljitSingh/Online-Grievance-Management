// ChatUser.js
import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Navbar from "./Navbar";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function ChatUser() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socket = useRef(null);

  useEffect(() => {
    if (!user) return navigate("/login");

    socket.current = io(import.meta.env.VITE_BACKEND);

    socket.current.on("connect", () => {
      console.log(`User connected: ${socket.current.id}`);
    });

    // Listen to incoming messages
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
      senderId: user._id, // User's ID
      recipientId: "admin", // Admin as recipient
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
      <div className="flex flex-col h-full max-w-2/3 mx-24 mt-3 pt-4">
        <h3 className="text-lg font-bold mb-2">Live Chat</h3>

        <div className="flex-grow overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 mb-2 rounded-md ${
                msg.senderId === user._id ? "bg-green-200 text-right" : "bg-gray-200 text-left"
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
    </div>
  );
}
