import { User } from "../models/index.js";

const adminController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: ["_id", "email", "fullName", "avatar"],
      });

      res.json({ errCode: 0, users });
    } catch (err) {
      console.log("Error: ", err);
      res.json({ errCode: 1, message: "Get error from server!" });
    }
  },
};

export default adminController;
