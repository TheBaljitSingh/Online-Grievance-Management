// ChatUser.js
import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Navbar from "./Navbar";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function ChatUser() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socket = useRef(null);


  console.log(messages);





  const [currentUserId , setCurrentUserId ] = useState();

  const [adminId, setAdminId] = useState('67912ae6e69724b72e03684d'); // is the method right???


  const fetchMessages = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND}/api/v1/getfilteredMessageforUser/`,{params: {senderId : user._id} , withCredentials: true}) ;
        return response.data.messages; // Assuming API response has a `messages` array
    } catch (error) {
        console.error("Error fetching messages:", error);
        return [];
    }
};

  useEffect(() => {
    if (!user) return navigate("/login");




    const getMessages = async () => {
      const fetchedMessages = await fetchMessages();
      console.log(fetchedMessages);
      setMessages(fetchedMessages);
    };

  getMessages();

    socket.current = io(import.meta.env.VITE_BACKEND);

    socket.current.on("connect", () => {
      setCurrentUserId(socket.current.id);
      console.log(`User connected: ${currentUserId}}`);
      socket.current.emit("user-connected", user);

    });


    socket.current.on("online-users", (users)=>{
      console.log("list of online user", users);
    })

    // Listen to incoming messages
    socket.current.on("receive-message", (message) => {
      console.log("received from adming ", message)
      setMessages((prevMessages) => [...prevMessages, message]);
    });


    socket.current.on("disconnect", () => {
      if (currentUserId) {
        socket.current.emit("user-disconnected", currentUserId); // Emit user-disconnected on disconnect
      }
    });
  
    // Cleanup function when the component unmounts or user changes
    return () => {
      if (currentUserId) {
        socket.current.emit("user-disconnected", currentUserId); // Ensure disconnection on page unload
      }
      socket.current.disconnect();
    };

  }, [user]);

  const handleSendMessage = async (e) => {
    //send message to the admin
    e.preventDefault();
  
    const messageData = {
      senderId: currentUserId, 
      recipientId: "admin", 
      messageContent: newMessage,
      timeStamp: new Date(),
    };

    
  
    socket.current.emit("send-message", messageData);


     await axios.post(`${import.meta.env.VITE_BACKEND}/api/v1/sendMessage`,  { message: messageData.messageContent, receiverId: adminId},{ withCredentials: true })
    .then(res=>{

      console.log("send and saved in db ", res);

    }).catch(e=>{
      console.log(e);
    })

    console.log("sended data ", messageData);

    

    setMessages((prev) => [...prev, messageData]);
    setNewMessage("");

    console.log('message sent', );
  };
  

  if (loading) return <p>Loading...</p>;

  

  return (
    <div>
  <Navbar />
  <div className="flex flex-col h-screen max-w-2/3 mx-24 mt-3 pt-4">
    <h3 className="text-lg font-bold mb-2">Real-Time Grievance Resolution with Admin</h3>

    <div className="flex flex-col h-4/5 justify-between">
      {/* Message container */}
      <div className="flex-grow overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div
          key={index} className={`p-2 mb-2 rounded-md ${
            msg.senderId === user._id
              ? "bg-green-200 text-right" // Messages sent by the current user (admin)
              : "bg-gray-200 text-left"  // Messages received by the current user
          }`}
        >
            <p className="text-sm">{msg.messageContent || msg.message}</p>
            <span className="text-xs text-gray-500">
            {msg.timeStamp ? new Date(msg.timeStamp).toLocaleTimeString() : msg.timeStamp}
            </span>
          </div>
        ))}
      </div>

      {/* Form for sending message */}
      <form onSubmit={handleSendMessage} className="flex mt-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
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
</div>

  );
}
