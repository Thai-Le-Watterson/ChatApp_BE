import jwt from "jsonwebtoken";

import { User } from "../models/index.js";
import Common from "../utils/Common.js";

const authMiddleware = {
  authentication: (req, res, next) => {
    try {
      const { Authorization } = req.cookies;
      const result = Common.verifyToken(Authorization);

      if (!result)
        return res.json({ errCode: 1, message: "You are not authentication!" });

      req.user = result;
      next();
    } catch (err) {
      return res.json({
        errCode: 1,
        message: "Get error from server!",
      });
    }
  },
  authorization: (req, res, next) => {
    try {
      authMiddleware.authentication(req, res, async () => {
        const user = await User.findByPk(req.user._id);

        if (user.role !== "R0")
          return res.json({
            errCode: 1,
            message: "You aren not allow to do that!",
          });

        next();
      });
    } catch (err) {
      console.log("Error: ", err);
      res.json({ errCode: 0, message: "Get error from server!" });
    }
  },
};

export default authMiddleware;
