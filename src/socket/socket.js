import { Server } from "socket.io";

import { Message } from "../models/index.js";

const initSocket = (server) => {
  let io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected!");
    socket.on("disconnect", () => {
      console.log("A user disconnected!");
    });

    socket.on("send-message", async (message) => {
      try {
        const { senderId, conversationId, content } = message;

        if (senderId && conversationId && content) {
          console.log(content);
          const message = await Message.create({
            senderId,
            conversationId,
            content,
          });
          io.emit("send-message", message);
        }
      } catch (err) {
        console.log("Error: ", err);
      }
    });
  });
};

export default initSocket;
