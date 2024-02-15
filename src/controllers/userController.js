import { Op } from "sequelize";
import { Conversation, User } from "../models/index.js";
import Common from "../utils/Common.js";

const userController = {
  getUsers: async (req, res) => {
    try {
      const { conversationId } = req.query;

      if (conversationId) {
        const data = await Conversation.findOne({
          where: { _id: conversationId },
          attributes: ["membersId"],
        });

        const { membersId } = data.dataValues;

        const users = await User.findAll({ where: { _id: membersId } });
        res.json({ errCode: 0, users });
      }
    } catch (err) {
      console.log(err);
      res.json({ errCode: 1, message: "Get error from server!" });
    }
  },
  getUser: async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await User.findByPk(userId);

      if (user) {
        res.json({ errCode: 0, user });
      } else {
        res.json({ errCode: 2, message: "The user could not be found!" });
      }
    } catch (err) {
      console.log(err);
      res.json({ errCode: 1, message: "Get error from server!" });
    }
  },
  createUser: async (req, res) => {
    try {
      if (req.body) {
        const { email, password, fullName } = req.body;

        if ((email, password, fullName)) {
          const user = await User.create({
            email,
            password,
            fullName,
            avatar: Common.getDefaultAvatar(),
            role: "R1",
          });

          const userCopy = {
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            avatar: user.avatar,
          };
          const token = Common.signedToken(userCopy);

          res.json({
            errCode: 0,
            message: "Create user successful!",
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
  updateUser: async (req, res) => {
    try {
      if (req.body) {
        const { userId, email, password, fullName, avatar, role } = req.body;

        if ((userId, email, password, fullName, avatar, role)) {
          await User.update(
            {
              email,
              password,
              fullName,
              avatar,
              role,
            },
            {
              where: {
                _id: userId,
              },
            }
          );

          //   console.log("user", user);
          res.json({ errCode: 0, message: "Update user successful!" });
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
  deleteUser: async (req, res) => {
    try {
      if (req.params) {
        const { userId } = req.params;

        if (userId) {
          await User.destroy({
            where: {
              _id: userId,
            },
          });

          //   console.log("user", user);
          res.json({ errCode: 0, message: "Delete user successful!" });
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

export default userController;
