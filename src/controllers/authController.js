import _ from "lodash";

import Common from "../utils/Common.js";
import { User } from "../models/index.js";

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.json({
          errCode: 2,
          message: "Please provide email and password to login",
        });
      }

      const user = await User.findOne({ where: { email, password } });

      if (user) {
        const userCopy = {
          _id: user._id,
          email: user.email,
          fullName: user.fullName,
          avatar: user.avatar,
        };
        const token = Common.signedToken(userCopy);

        res.cookie("Authorization", token, {
          httpOnly: true,
          path: "/",
          maxAge: 30 * 24 * 60 * 60 * 1000,
          sameSite: "None",
          secure: true,
        });
        res.json({ errCode: 0, user: userCopy, token });
      } else res.json({ errCode: 3, message: "User does not exists!" });
    } catch (err) {
      console.log(err);
      res.json({ errCode: 1, message: "Get error from server!" });
    }
  },
  logout: async (req, res) => {
    try {
      res.cookie("Authorization", "", { httpOnly: true });
      res.json({ errCode: 0, message: "Logout successfull!" });
    } catch (err) {
      console.log(err);
      res.json({ errCode: 1, message: "Get error from server!" });
    }
  },
  singup: async (req, res) => {
    try {
      if (req.body) {
        const { email, password, fullName, avatar } = req.body;

        if ((email, password, fullName)) {
          const user = await User.create({
            email,
            password,
            fullName,
            avatar: avatar || Common.getDefaultAvatar(),
            role: "R1",
          });

          const userCopy = {
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            avatar: user.avatar,
          };
          const token = Common.signedToken(userCopy);

          res.cookie("Authorization", token, {
            httpOnly: true,
            path: "/",
            maxAge: 30 * 24 * 60 * 60 * 1000,
          });
          res.json({
            errCode: 0,
            token,
            user: userCopy,
          });
        } else {
          res.json({ errCode: 2, message: "Data is empty!" });
        }
      } else {
        res.json({ errCode: 2, message: "Data is empty!" });
      }
    } catch (err) {
      console.log(err);
      res.json({ errCode: 1, message: "Get error from server!" });
    }
  },
};

export default authController;
