const Order = require("../models/Order");
const Product = require("../models/Product");

const placeOrder = async (req, res) => {
  try {
    const { productId, quantity, deliveryDate } = req.body;

    if (!productId || !quantity || !deliveryDate) {
      return res
        .status(400)
        .json({ message: "Product, quantity and delivery date are required." });
    }

    if (Number(quantity) <= 0) {
      return res.status(400).json({ message: "Quantity should be greater than zero." });
    }

    const selectedProduct = await Product.findById(productId);

    if (!selectedProduct) {
      return res.status(404).json({ message: "Selected product was not found." });
    }

    const parsedDeliveryDate = new Date(deliveryDate);
    if (Number.isNaN(parsedDeliveryDate.getTime())) {
      return res.status(400).json({ message: "Please provide a valid delivery date." });
    }

    const order = await Order.create({
      retailer: req.user._id,
      product: selectedProduct._id,
      quantity: Number(quantity),
      deliveryDate: parsedDeliveryDate,
      status: "Pending",
    });

    const populatedOrder = await order.populate("product", "name category price unit");

    return res.status(201).json({
      message: "Order placed successfully.",
      order: populatedOrder,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to place order right now." });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ retailer: req.user._id })
      .populate("product", "name category price unit")
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch orders right now." });
  }
};

module.exports = {
  placeOrder,
  getOrders,
};
