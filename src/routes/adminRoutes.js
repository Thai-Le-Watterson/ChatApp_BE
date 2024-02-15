import express from "express";

import adminController from "../controllers/adminController.js";
import userController from "../controllers/userController.js";

const adminRouter = express.Router();

adminRouter.route("/get-all-users").get(adminController.getAllUsers);
adminRouter.route("/create-user").post(userController.createUser);

export default adminRouter;
