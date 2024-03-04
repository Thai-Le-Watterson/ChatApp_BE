import { Op } from "sequelize";
import { Conversation, User, FriendRequest, Message } from "../models/index.js";
import Common from "../utils/Common.js";
import _ from "lodash";

const userController = {
  getUsers: async (req, res) => {
    try {
      const { conversationId, friendOfUserId, isGetUserOutGr } = req.query;

      if (conversationId && isGetUserOutGr === "true") {
        const messages = await Message.findAll({ where: { conversationId } });

        if (messages) {
          const membersId = await Conversation.findOne({
            where: { _id: conversationId },
            attributes: ["membersId"],
          });

          const usersId = membersId.dataValues.membersId;

          messages.forEach((message) => {
            if (
              usersId.length === 0 ||
              !usersId.includes(message.dataValues.senderId)
            )
              usersId.push(message.dataValues.senderId);
          });

          const users = await User.findAll({ where: { _id: usersId } });
          return res.json({ errCode: 0, users });
        } else {
          return res.json({
            errCode: 2,
            messages: "This group hasn't any message!",
          });
        }
      } else if (conversationId) {
        const data = await Conversation.findOne({
          where: { _id: conversationId },
          attributes: ["membersId"],
        });

        const { membersId } = data.dataValues;

        const users = await User.findAll({ where: { _id: membersId } });
        return res.json({ errCode: 0, users });
      } else if (friendOfUserId && +friendOfUserId) {
        const data = await Conversation.findAll({
          where: { membersId: { [Op.contains]: [friendOfUserId] }, type: "PV" },
          attributes: ["membersId"],
        });

        const friendsId = data?.map((members) => {
          return members[0] === +friendOfUserId ? members[0] : members[1];
        });

        if (!friendsId) return res.json({ errCode: 0, users: [] });

        const users = await User.findAll({ where: { _id: friendsId } });
        return res.json({ errCode: 0, users });
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
  getUserByEmail: async (req, res) => {
    try {
      const { email } = req.params;

      if (email) {
        const user = await User.findOne({
          where: { email },
        });

        if (user) {
          res.json({ errCode: 0, user });
        } else {
          res.json({ errCode: 2, message: "The user could not be found!" });
        }
      } else {
        return res.json({ errCode: 3, message: "Missing parameter!" });
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

        const userCheck = await User.findOne({
          email,
        });

        if (!_.isEmpty(userCheck)) {
          return res.json({ errCode: 4, message: "Email is being used!" });
        }

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

          return res.json({
            errCode: 0,
            message: "Create user successful!",
            user: userCopy,
          });
        } else {
          return res.json({ errCode: 3, message: "Data is empty!" });
        }
      } else {
        return res.json({ errCode: 2, message: "Data is empty!" });
      }
    } catch (err) {
      console.log(err);
      return res.json({ errCode: 1, message: "Get error from server!" });
    }
  },
  updateUser: async (req, res) => {
    try {
      if (req.body) {
        const { userId, email, password, fullName, avatar } = req.body;

        if ((userId, email, password, fullName, avatar)) {
          await User.update(
            {
              email,
              password,
              fullName,
              avatar,
              role: "R1",
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
  getAllFriendRequests: async (req, res) => {
    try {
      const { userId } = req.params;

      if (userId) {
        let friendRequests = await FriendRequest.findAll({
          where: { receiverId: userId },
        });

        friendRequests = await Promise.all(
          friendRequests.map((friendRequest) => {
            return new Promise(async (resolve) => {
              const user = await User.findByPk(friendRequest.senderId);
              resolve({
                ...friendRequest.dataValues,
                senderName: user.fullName,
                senderAvatar: user.avatar,
              });
            });
          })
        );

        return res.json({ errCode: 0, friendRequests });
      }

      return res.json({ errCode: 2, message: "Missing parameter!" });
    } catch (e) {
      console.log("userController - getAllFriendRequest: ", e);
      res.json({ errCode: 1, message: "Error from server!" });
    }
  },
  friendRequest: async (req, res) => {
    try {
      const { senderId, receiverId } = req.query;

      if (!senderId || !receiverId) {
        return res.json({ errCode: 2, message: "Missing parameter!" });
      }

      const users = await User.findAll({
        _id: { [Op.in]: [senderId, receiverId] },
      });

      if (_.isEmpty(users) || users.length < 2) {
        return res.json({ errCode: 4, message: "A user doesn't not exists!" });
      }

      const conversation = await Conversation.findOne({
        where: {
          membersId: { [Op.contains]: [senderId, receiverId] },
          type: "PV",
        },
      });

      if (conversation && !_.isEmpty(conversation)) {
        return res.json({ errCode: 3, message: "This user was your friend!" });
      }

      await FriendRequest.create({ senderId, receiverId });
      return res.json({ errCode: 0, message: "Friend request has been sent!" });
    } catch (e) {
      console.log(e);
      res.json({ errCode: 1, message: "Error from server" });
    }
  },
  friendResponse: async (req, res) => {
    try {
      const { friendRequestId, response } = req.query;

      if (!friendRequestId || !response) {
        return res.json({ errCode: 2, message: "Missing parameter!" });
      }

      const friendRequest = await FriendRequest.findByPk(friendRequestId);

      if (!friendRequest) {
        return res.json({
          errCode: 3,
          message: "This request id doesn't not exists!",
        });
      }

      if (response === "DEN") {
        await FriendRequest.destroy({
          where: {
            _id: friendRequestId,
          },
        });
        return res.json({ errCode: 0, message: "Denie request is successful" });
      } else if (response === "ALW") {
        const conversationPV = await Conversation.findOne({
          where: {
            members: {
              [Op.contains]: [
                friendRequest.dataValues.senderId,
                friendRequest.dataValues.receiverId,
              ],
            },
          },
        });
        if (!conversationPV) {
          await Conversation.create({
            membersId: [
              friendRequest.dataValues.senderId,
              friendRequest.dataValues.receiverId,
            ],
          });
        }
        await FriendRequest.destroy({
          where: {
            _id: friendRequestId,
          },
        });
        return res.json({ errCode: 0, message: "Allow request is successful" });
      } else {
        return res.json({ errCode: 4, message: "The response is not valid!" });
      }
    } catch (e) {
      console.log(e);
      res.json({ errCode: 1, message: "Error from server" });
    }
  },
};

export default userController;
