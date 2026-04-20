const secretKey = "mysecretkey";
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

module.exports = async (req, res, next) => {
  const authToken = req.headers.authorization;
  // console.log("token>>>>>>>>", authToken);
  if (!authToken) {
    return res.status(400).json({ message: "Not Token found" });
  }

  const token = authToken.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "invalid token" });
  }

  // console.log(">>>>>token>>>>>>", token);
  const verifyToken = jwt.verify(token, secretKey);
  // console.log(">>>>>>verify token >>>>>>", verifyToken);

  if (!verifyToken) {
    return res.status(400).json({ message: "invalid user" });
  }

  const email = verifyToken.email;
  const user = await User.findOne({ email });
  // console.log(">>>>>>>>user>>>>>>>", user);

  if (!user) {
    return res.status(400).json({ message: "No user found" });
  }
  req.user = user;
  next()
};
 