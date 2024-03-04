import { DataTypes, Model } from "sequelize";
import connection from "../database/connectDB.js";

const sequelize = connection.getSequelize();

class FriendRequest extends Model {}

FriendRequest.init(
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
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "PEN", //PEN request pending; DEN request denied; ALW request allowed
    },
  },
  { sequelize, modelName: "FriendRequest" }
);

export default FriendRequest;
