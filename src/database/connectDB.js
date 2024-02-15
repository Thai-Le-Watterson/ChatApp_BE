import { Sequelize } from "sequelize";

const connection = (function () {
  let sequelize;

  const init = async () => {
    sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER_NAME,
      process.env.DB_PASSWORD,
      {
        host: "postgres://root:TF5Rnn7mN19jRYTntn2O8maWEJaeQb55@dpg-cn6ol0qcn0vc73dllbb0-a/db_chatapp",
        dialect: "postgres",
        logging: false,
      }
    );
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
