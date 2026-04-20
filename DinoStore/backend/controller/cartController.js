const cart = require("../model/cartModel");

//add to cart :--->
const addToCart = async (req, res) => {
  try {
    const productData = req.body;
    const userId = req.user._id;

    console.log(">>>>user id >>>>", userId);

    const items = Array.isArray(productData) ? productData : [productData];

    const cleanItems = items.map((item) => ({
      title: item.title,
      price: item.price,
      description: item.description,
      category: item.category,
      image: item.image,
      rating: {
        rate: item.rating?.rate || 0,
        count: item.rating?.count || 0,
      },
    }));

    const finalData = cleanItems.map((item) => ({
      ...item,
      userId,
    }));

    console.log(">>>>>final data >>>>>>", finalData);

    const result = await cart.insertMany(finalData);

    res.status(201).json(result);
  } catch (err) {
    console.log("ERROR >>>", err.message);

    res.status(400).json({ error: err.message });
  }
};

//get All --->
const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await cart.find({ userId });
    res.status(200).json(result);
  } catch (err) {
    console.log("ERROR >>>", err.message);

    res.status(400).json({ error: err.message });
  }
};

//bulk delete

const bulkDelete = async (req, res) => {
  try {
    const { ids } = req.body;
    const userId = req.user.id;

    // validation
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No items selected" });
    }

    const result = await Cart.deleteMany({
      _id: { $in: ids },
      userId,
    });

    res.status(200).json({
      message: "Items deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.log("ERROR >>>", err.message);
    res.status(500).json({ error: err.message });
  }
};

//delete Cart

const deleteCart = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const result = await cart.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({
      message: "Item deleted successfully",
      result,
    });
  } catch (err) {
    console.log("ERROR >>>", err.message);

    res.status(500).json({ error: err.message });
  }
};
module.exports = { addToCart, getCart, deleteCart, bulkDelete };
