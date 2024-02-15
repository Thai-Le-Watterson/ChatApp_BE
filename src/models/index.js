import User from "./User.js";
import Conversation from "./Conversation.js";
import Message from "./Message.js";

const initModels = async () => {
  await User.sync({ alter: true });
  await Conversation.sync({ alter: true });
  await Message.sync({ alter: true });
};

const associations = () => {
  //Conversation - Message
  Message.belongsTo(Conversation, { foreignKey: "conversationId" });

  //User - Message
  Message.belongsTo(User, { foreignKey: "senderId" });
};

associations();

export { User, Conversation, Message };

export default initModels;
