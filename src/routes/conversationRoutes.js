import express from "express";

import conversationController from "../controllers/conversationController.js";

const conversationRouter = express.Router();

conversationRouter
  .route("/")
  .get(conversationController.getConversations) //Get conversation by userId query
  .post(conversationController.createConversation);

conversationRouter
  .route("/:conversationId")
  .get(conversationController.getConversation)
  .put(conversationController.updateConversation)
  .delete(conversationController.deleteConversation);

conversationRouter
  .route("/:conversationId/:memberId")
  .post(conversationController.addMemberToConversation)
  .delete(conversationController.deleteMemberFromConversation);

export default conversationRouter;
