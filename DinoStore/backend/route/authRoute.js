const express = require("express");
const router = express.Router();

const { signUp, login, reset } = require("../controller/userController");

const auth = require("../middleware/auth");

router.post("/signup", signUp);
router.post("/login", login);
router.post("/reset", auth , reset);

module.exports = router;
