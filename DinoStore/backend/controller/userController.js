const user = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const secretKey = "mysecretkey";

// signup ---->
const signUp = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    console.log(">>>>>>req body >>>>>>", req.body);

    // validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    email = email.toLowerCase();

    const olduser = await user.findOne({ email });

    if (olduser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const newuser = new user({
      name,
      email,
      password: hash,
      createdAt: Date.now(),
    });

    await newuser.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// login :---->
const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    email = email.toLowerCase();

    const olduser = await user.findOne({ email });

    if (!olduser) {
      return res.status(404).json({ message: "Signup first" });
    }

    const match = await bcrypt.compare(password, olduser.password);

    if (!match) {
      return res.status(401).json({ message: "Wrong password" });
    }

    // token
    const token = jwt.sign(
      { id: olduser._id, email: olduser.email },
      secretKey,
      { expiresIn: "1d" },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: olduser._id,
        name: olduser.name,
        email: olduser.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// reset password :--->
const reset = async (req, res) => {
  try {
    let { email, oldPassword, newPassword } = req.body;

    console.log(">>>>>req.body>>>", req.body);

    // validation
    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    email = email.toLowerCase();

    const olduser = await user.findOne({ email });

    if (!olduser) {
      return res.status(404).json({ message: "User not found" });
    }

    // check old password
    const match = await bcrypt.compare(oldPassword, olduser.password);

    if (!match) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    // hash new password
    const hash = await bcrypt.hash(newPassword, 10);

    olduser.password = hash;
    await olduser.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  signUp,
  login,
  reset,
};
