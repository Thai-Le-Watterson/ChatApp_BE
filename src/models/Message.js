import { DataTypes, Model } from "sequelize";

import connection from "../database/connectDB.js";

const sequelize = connection.getSequelize();

class Message extends Model {}
Message.init(
  {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    conversationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  { sequelize, modelName: "Message" }
);

export default Message;
