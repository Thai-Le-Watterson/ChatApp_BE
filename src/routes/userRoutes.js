import express from "express";

import userController from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.route("/").get(userController.getUsers);

userRouter
  .route("/:userId")
  .get(userController.getUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

export default userRouter;
