// app.js (backend)
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from "cors";
import { configDotenv } from "dotenv";

import { Server } from "socket.io";
import { createServer } from "http";

import Message from "./models/messageModel.js";
import { authorizeRoles, isAuthenticated } from "./middleware/auth.js";

configDotenv();

const app = express();

const corsOptions = {
  origin: `${process.env.FRONTEND_URL}`,
  credentials: true,
};

const server = createServer(app);

const io = new Server(server, {
  cors: corsOptions,
});

let onlineUsers = [];

let adminSocketId = null; // Store the Admin's socket ID

io.on("connection", (socket) => {

  console.log(`Socket is connected:  ${socket.id}`);

  socket.on("admin", ()=>{
    adminSocketId = socket.id;
    console.log(`Admin Connected: ${adminSocketId}`);

  })


  // Broadcast the online users list
  io.emit("online-users", onlineUsers);

  socket.on("user-connected", (user) => {
    onlineUsers.push({ id: socket.id, user });
    io.emit("online-users", onlineUsers); // Emit updated online users list
  });


  socket.on("send-message", (message) => {
    // Save message to DB if needed
    // Message.create(message);

    if(adminSocketId){
      io.to(adminSocketId).emit("receive-message", message); // why not socket.to

    }else{
      console.log("Admin is not online")
    }
  });

  socket.on("admin-reply", (message)=>{
    io.to(message.recipientId).emit("receive-message", message);
  })


  socket.on("admin-disconnected", (adminSocketId) => {
    // Remove admin socket from the online users list
    onlineUsers = onlineUsers.filter(user => user.id !== adminSocketId);
    io.emit("online-users", onlineUsers);
  });

  socket.on("user-disconnected", (userSocketId) => {
    onlineUsers = onlineUsers.filter((user) => user.id !== userSocketId);
    io.emit("online-users", onlineUsers);
    console.log(`User disconnected: ${userSocketId}`);
  });




  socket.on("disconnect", () => {
    // Remove user by their socket id
    onlineUsers = onlineUsers.filter((user) => user.id !== socket.id);
    io.emit("online-users", onlineUsers); // Emit updated list of users
    console.log(`Socket disconnected: ${socket.id}`);
  });

});

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

import user from "./routes/userRoute.js";
import grievance from './routes/grievanceRoute.js';

app.use("/api/v1/", user);
app.use("/api/v1/", grievance);

app.get("/", function (req, res) {
  res.send("Services are up and running");
});

export default server;
