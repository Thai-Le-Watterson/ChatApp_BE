import express from "express";

import userController from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.route("/").get(userController.getUsers);

userRouter
  .route("/:userId/friend-request")
  .get(userController.getAllFriendRequests);
userRouter.route("/friend-request").post(userController.friendRequest);
userRouter.route("/friend-response").post(userController.friendResponse);
userRouter.route("/email/:email").get(userController.getUserByEmail);

userRouter
  .route("/:userId")
  .get(userController.getUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

export default userRouter;
