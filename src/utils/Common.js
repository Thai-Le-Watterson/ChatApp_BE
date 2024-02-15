import jwt from "jsonwebtoken";

const Common = {
  signedToken: (userInfor) => {
    const token = jwt.sign(userInfor, process.env.JWT_PRIVATE_KEY, {
      expiresIn: "365d",
    });

    return token;
  },
  verifyToken: (token) => {
    try {
      const decode = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
      return decode;
    } catch (err) {
      return false;
    }
  },
  getDefaultAvatar: () => {
    return "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg";
  },
  getDefaultMessage: () => {
    return "Cùng nhau trò chuyện nào!";
  },
};

export default Common;
