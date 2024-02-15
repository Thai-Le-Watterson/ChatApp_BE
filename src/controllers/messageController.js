import { Message } from "../models/index.js";

const messageController = {
  getMessages: async (req, res) => {
    try {
      const { conversationId } = req.params;

      if (conversationId && +conversationId) {
        const messages = await Message.findAll({
          where: { conversationId: +conversationId },
          order: [["createdAt", "DESC"]],
        });

        if (messages.length > 0) res.json({ errCode: 0, messages });
        else
          res.json({
            errCode: 3,
            message: "This conversation cannot be found!",
          });
      } else {
        res.json({
          errCode: 2,
          message: "Please transmit conversationId to receive message!",
        });
      }
    } catch (err) {
      console.log("Error: ", err);
      res.json({ errCode: 1, message: "Get error from server!" });
    }
  },
  createMessages: async (req, res) => {
    try {
      const { senderId, conversationId, content } = req.body;

      // if (senderId && receiverId && content) {
      await Message.create({ senderId, conversationId, content });
      res.json({ errCode: 0, message: "Create message successfull!" });
      // } else {
      //   res.json({ errCode: 2, message: "Empty data!" });
      // }
    } catch (err) {
      console.log("Error: ", err);
      res.json({ errCode: 1, message: "Get error from server!" });
    }
  },
  deleteMessages: async (req, res) => {
    try {
      const { messageId } = req.query;

      if (messageId) {
        await Message.destroy({ where: { _id: messageId } });
        res.json({ errCode: 0, message: "Delete message successfull!" });
      } else {
        res.json({ errCode: 2, message: "messageId is empty!" });
      }
    } catch (err) {
      res.json({ errCode: 1, message: "Get error from server!" });
    }
  },
};

export default messageController;
