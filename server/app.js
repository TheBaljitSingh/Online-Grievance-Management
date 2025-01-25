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
  methods: 'GET,POST',
  credentials: true,
};

const server = createServer(app);

const io = new Server(server, {
  cors: corsOptions,
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log(`Socket is connected:  ${socket.id}`);

  onlineUsers.push(socket.id); // Add to the list of online users

  // Broadcast the online users list
  io.emit("online-users", onlineUsers);

  socket.on("send-message", (message) => {
    // Save message to DB if needed
    Message.create(message);

    // Send message to the intended recipient
    io.to(message.recipientId).emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user !== socket.id);
    io.emit("online-users", onlineUsers); // Update the list of online users
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
