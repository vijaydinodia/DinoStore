const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  getAll,
  createProducts,
  softDeleteProduct,
  getOne,
  deleteProduct,
  updateProduct,
  searchProduct,
  sortProducts,
} = require("../controller/productController");

//product api:--->

router.get("/", auth, getAll);
router.post("/createproduct", auth, createProducts);
router.patch("/softDeleteProduct/:id", softDeleteProduct);
router.get("/getOne/:id", auth, getOne);
router.delete("/deleteProduct/:id", auth, deleteProduct);
router.patch("/:id", auth, updateProduct);

//search :---->

router.get("/searchProduct", searchProduct);
router.get("/sortProducts", sortProducts);

module.exports = router;
