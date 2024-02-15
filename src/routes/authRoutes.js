import express from "express";

import authController from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.route("/login").post(authController.login);
authRouter.route("/logout").post(authController.logout);
authRouter.route("/signup").post(authController.singup);

export default authRouter;
