import { Sequelize } from "sequelize";

const connection = (function () {
  let sequelize;

  const init = async () => {
    sequelize = new Sequelize("chat_app_db", "postgres", "hikiganha9", {
      host: "localhost",
      dialect: "postgres",
      logging: false,
    });
  };

  const testConnection = async () => {
    try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  };

  return {
    getSequelize: () => {
      if (!sequelize) init();
      return sequelize;
    },
    testConnection: () => {
      if (!sequelize) init();
      testConnection();
    },
  };
})();

export default connection;
