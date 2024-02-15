import userRouter from "./userRoutes.js";
import conversationRouter from "./conversationRoutes.js";
import messageRouter from "./messageRoutes.js";
import authRouter from "./authRoutes.js";
import adminRouter from "./adminRoutes.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const initAppRoutes = (app) => {
  app.use("/api/message", authMiddleware.authentication, messageRouter);
  app.use("/api/user", authMiddleware.authentication, userRouter);
  app.use(
    "/api/conversation",
    authMiddleware.authentication,
    conversationRouter
  );
  app.use("/api/admin", authMiddleware.authorization, adminRouter);
  app.use("/api/auth", authRouter);
};

export default initAppRoutes;
