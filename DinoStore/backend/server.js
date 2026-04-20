const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const productRoute = require("./route/productRoute");
const userRoute = require("./route/authRoute");
const cartRoute = require("./route/cartRoute");

const port = 9898;
const app = express();

app.use(express.json());
app.use(cors());

const mongoUrl = "mongodb://localhost:27017/productApiData";

mongoose
  .connect(mongoUrl)
  .then(() => console.log("Db is connected"))
  .catch((err) => console.log("Db is not connected"));

app.use("/api/products", productRoute);
app.use("/api/user", userRoute);
app.use("/api/cart", cartRoute);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});