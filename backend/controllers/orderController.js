const Order = require("../models/Order");
const Product = require("../models/Product");
const Store = require("../models/Store");

// @desc Create an Order (Cash on Delivery)
// @route POST /api/orders
// @access Public
const createOrder = async (req, res) => {
  try {
    const { domain, items, paymentMethod } = req.body;

    // Find the store by domain
    const store = await Store.findOne({ domain });
    if (!store) return res.status(404).json({ message: "Store not found" });

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) throw new Error("Product not found");
        totalAmount += product.price * item.quantity;
        return { product: product._id, quantity: item.quantity };
      })
    );

    // Create Order (Default: Pending)
    const order = await Order.create({
      store: store._id,
      customer: req.user ? req.user._id : null,
      items: orderItems,
      totalAmount,
      paymentMethod: paymentMethod || "COD", // Default to COD
    });

    res.status(201).json({ order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc Get Orders for a Store
// @route GET /api/orders
// @access Private (Store Owners)
const getOrders = async (req, res) => {
  try {
    const store = await Store.findOne({ user: req.user._id });
    if (!store) return res.status(404).json({ message: "Store not found" });

    const orders = await Order.find({ store: store._id }).populate("items.product");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc Update Order Status
// @route PUT /api/orders/:id
// @access Private (Store Owners)
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = req.body.status || order.status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { createOrder, getOrders, updateOrderStatus };
