const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  addToCart,
  getCart,
  deleteCart,
  bulkDelete,
} = require("../controller/cartController");

router.post("/addToCart",auth , addToCart);
router.get("/getCart", auth,getCart);
router.delete("/deleteCart/:id", deleteCart);
router.delete("/bulkDelete", bulkDelete);

module.exports = router;
