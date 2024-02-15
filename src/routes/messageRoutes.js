import express from "express";

import messageController from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter
  .route("/")
  .post(messageController.createMessages)
  .delete(messageController.deleteMessages);

messageRouter.route("/:conversationId").get(messageController.getMessages);

export default messageRouter;
