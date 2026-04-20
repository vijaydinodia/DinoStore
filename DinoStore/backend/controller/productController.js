const products = require("../model/productModel");

// 1 .add to database :--->

const createProducts = async (req, res) => {
  try {
    let productsData = req.body;

    // console.log(">>>>>req.body>>>", req.body);
    // console.log(">>>>>req.user>>>", req.user);

    const userId = req.user._id;
    // console.log(">>>> userId >>>>>", userId);

    if (!Array.isArray(productsData)) {
      return res.status(400).json({ Errorr: "Expected array" });
    }
    const newProductData = productsData.map((item) => ({
      ...item,
      userId,
    }));
    const result = await products.insertMany(newProductData);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
};

// 2. get all data :--->
const getAll = async (req, res) => {
  const userId = req.user._id;
  // console.log(">>>>>userId >>>>>>>",userId);
  const result = await products.find({userId});
  res.json(result);
};

// 3. soft delete

const softDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await products.findById(id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    product.active = !product.active;

    await product.save();

    res.status(200).json({
      message: "Product status updated",
      product,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 3. get one :--->
const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await products.findById(id);

    if (!result) {
      return res.status(404).json({ message: "product is not found" });
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. delete parmanently:--->
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({ message: "product is not found" });
    }

    const result = await products.findByIdAndDelete(id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. update product--->

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await products.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//6. searching:---->

const searchProduct = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const result = await products.find({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//7. sorting product based on price :--->
const sortProducts = async (req, res) => {
  try {
    const { operation } = req.query;

    if (!operation) {
      return res.status(400).json({ message: "operation query is required" });
    }
    let result;

    if (operation === "asc") {
      result = await products.find().sort({ price: 1 });
    } else {
      result = await products.find().sort({ price: -1 });
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAll,
  createProducts,
  softDeleteProduct,
  getOne,
  deleteProduct,
  updateProduct,
  searchProduct,
  sortProducts,
};
