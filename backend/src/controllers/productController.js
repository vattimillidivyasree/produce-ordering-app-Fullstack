const Product = require("../models/Product");

const getProducts = async (_req, res) => {
  try {
    const products = await Product.find().sort({ category: 1, name: 1 });
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch products right now." });
  }
};

module.exports = { getProducts };
