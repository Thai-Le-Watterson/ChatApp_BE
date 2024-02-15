import { DataTypes, Model } from "sequelize";

import connection from "../database/connectDB.js";

const sequelize = connection.getSequelize();

class User extends Model {}
User.init(
  {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    role: {
      type: DataTypes.CHAR(2),
      allowNull: false,
      defaultValue: "R1",
    },
  },
  { sequelize, modelName: "User" }
);

export default User;
