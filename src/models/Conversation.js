import { DataTypes, Model } from "sequelize";

import connection from "../database/connectDB.js";

const sequelize = connection.getSequelize();

class Conversation extends Model {}
Conversation.init(
  {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    membersId: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "PV",
    },
  },
  { sequelize, modelName: "Conversation" }
);

export default Conversation;
