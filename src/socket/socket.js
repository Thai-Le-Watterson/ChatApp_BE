import { Server } from "socket.io";

import { Message } from "../models/index.js";

const initSocket = (server) => {
  const clientURL =
    process.env.NODE_ENV === "production"
      ? process.env.CLIENT_URL
      : process.env.CLIENT_LOCAL_URL;

  let io = new Server(server, {
    cors: {
      origin: clientURL,
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
          const message = await Message.create({
            senderId,
            conversationId,
            content,
          });
          console.log("message: ", message);
          io.emit("send-message", message);
        }
      } catch (err) {
        console.log("Error: ", err);
      }
    });
  });
};

export default initSocket;
