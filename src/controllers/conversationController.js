import { Op } from "sequelize";
import { Conversation, Message, User } from "../models/index.js";
import Common from "../utils/Common.js";

const conversationController = {
  getConversations: async (req, res) => {
    try {
      const { userId } = req.query;

      if (userId) {
        const conversations = await Conversation.findAll({
          attributes: ["_id", "name", "avatar", "type", "membersId"],
          where: {
            membersId: { [Op.contains]: [userId] },
          },
        });

        if (conversations.length > 0) {
          const conversationsCopy = await Promise.all(
            conversations.map(async (conversation) => {
              return new Promise(async (resolve) => {
                const conversationCopy = conversation.dataValues;

                const message = await Message.findOne({
                  attributes: ["content", "senderId"],
                  where: {
                    conversationId: conversationCopy._id,
                  },
                  order: [["createdAt", "DESC"]],
                });

                conversationCopy.lastMessaged =
                  message?.content || Common.getDefaultMessage();
                conversationCopy.lastMemberSendMessaged =
                  message?.senderId || -1;

                if (conversationCopy.type === "PV") {
                  const friendId = conversationCopy.membersId.filter(
                    (id) => id !== +userId
                  );

                  const user = await User.findOne({
                    attributes: ["fullName", "avatar"],
                    where: { _id: friendId },
                  });

                  conversationCopy.name = user?.fullName;
                  conversationCopy.avatar = user?.avatar;
                }
                resolve(conversationCopy);
              });
            })
          );

          res.json({ errCode: 0, conversations: conversationsCopy });
        } else
          res.json({
            errCode: 3,
            message: "This user has no conversation yet!",
          });
      } else {
        res.json({
          errCode: 2,
          message: "Please provide userId to get conversations!",
        });
      }
    } catch (err) {
      console.log("Error: ", err);
      res.json({ errCode: 1, message: "Error from server!" });
    }
  },
  getConversation: async (req, res) => {
    try {
      const { conversationId } = req.params;

      const conversation = await Conversation.findByPk(conversationId);

      if (conversation) res.json({ errCode: 0, conversation });
      else
        res.json({
          errCode: 2,
          message: "The conversation could not be found!",
        });
    } catch (err) {
      res.json({ errCode: 1, message: "Error from server!" });
    }
  },
  createConversation: async (req, res) => {
    try {
      const { name, avatar, memberId, type } = req.body;

      if (memberId) {
        await Conversation.create({
          name,
          avatar,
          membersId: [memberId],
          type,
        });
        res.json({ errCode: 0, message: "Create conversation successfull!" });
      } else res.json({ errCode: 2, message: "Data empty!" });
    } catch (err) {
      console.log("Error: ", err);
      res.json({ errCode: 1, message: "Error from server!" });
    }
  },
  addMemberToConversation: async (req, res) => {
    try {
      const { conversationId, memberId } = req.params;

      if (conversationId && memberId && Number.isInteger(+memberId)) {
        const { dataValues: conversation } = await Conversation.findByPk(
          conversationId
        );

        if (conversation) {
          const result = await Conversation.update(
            {
              membersId: [...conversation.membersId, +memberId],
            },
            {
              where: {
                _id: conversationId,
              },
            }
          );

          if (result)
            res.json({
              errCode: 0,
              message: "Add member to conversation successfull!",
            });
          else
            res.json({
              errCode: 4,
              message: "Add member to conversation failed!",
            });
        } else {
          res.json({
            errCode: 3,
            message: "The conversation does not exists!",
          });
        }
      } else {
        res.json({ errCode: 2, message: "Data empty!" });
      }
    } catch (err) {
      // console.log("Error: ", err);
      res.json({ errCode: 1, message: "Error from server!" });
    }
  },
  deleteMemberFromConversation: async (req, res) => {
    try {
      const { conversationId, memberId } = req.params;

      if (conversationId && memberId && Number.isInteger(+memberId)) {
        const { dataValues: conversation } = await Conversation.findByPk(
          conversationId
        );

        const newMembersId = conversation.membersId.filter(
          (id) => id !== +memberId
        );

        if (conversation) {
          const result = await Conversation.update(
            {
              membersId: [...newMembersId],
            },
            {
              where: {
                _id: conversationId,
              },
            }
          );

          if (result)
            res.json({
              errCode: 0,
              message: "Delete member from conversation successfull!",
            });
          else
            res.json({
              errCode: 4,
              message: "Delete member from conversation failed!",
            });
        } else {
          res.json({
            errCode: 3,
            message: "The conversation does not exists!",
          });
        }
      } else {
        res.json({ errCode: 2, message: "Data empty!" });
      }
    } catch (err) {
      // console.log("Error: ", err);
      res.json({ errCode: 1, message: "Error from server!" });
    }
  },
  updateConversation: async (req, res) => {
    try {
      const { name, avatar, type } = req.body;
      const { conversationId } = req.params;

      const [result] = await Conversation.update(
        { name: name || null, avatar: avatar || null, type },
        { where: { _id: conversationId } }
      );

      if (result)
        res.json({ errCode: 0, message: "Update conversation successfull!" });
      else res.json({ errCode: 2, message: "Update conversation failed!" });
    } catch (err) {
      res.json({ errCode: 1, message: "Error from server!" });
    }
  },
  deleteConversation: async (req, res) => {
    try {
      const { conversationId } = req.params;

      const result = await Conversation.destroy({
        where: { _id: conversationId },
      });
      if (result)
        res.json({ errCode: 0, message: "Delete conversation successfull!" });
      else res.json({ errCode: 2, message: "Conversation wasn't exists!" });
    } catch (err) {
      console.log(err);
      res.json({ errCode: 1, message: "Error from server!" });
    }
  },
};

export default conversationController;
