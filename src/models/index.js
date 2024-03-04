import User from "./User.js";
import Conversation from "./Conversation.js";
import Message from "./Message.js";
import FriendRequest from "./FriendRequest.js";

const initModels = async () => {
  await User.sync({ alter: true });
  await Conversation.sync({ alter: true });
  await Message.sync({ alter: true });
  await FriendRequest.sync({ alter: true });
};

const associations = () => {
  //Conversation - Message
  Message.belongsTo(Conversation, { foreignKey: "conversationId" });

  //User - Message
  Message.belongsTo(User, { foreignKey: "senderId" });

  //FriendRequest - User
  FriendRequest.belongsTo(User, { foreignKey: "senderId" });
  FriendRequest.belongsTo(User, { foreignKey: "receiverId" });
};

associations();

export { User, Conversation, Message, FriendRequest };

export default initModels;
