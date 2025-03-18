const Product = require("../models/Product");
const Store = require("../models/Store");

// @desc Create a Product
// @route POST /api/products
// @access Private (Only store owners)
const createProduct = async (req, res) => {
  const { name, description, price, stock, image } = req.body;

  try {
    // Find the store linked to the logged-in user
    const store = await Store.findOne({ user: req.user._id });
    if (!store) return res.status(404).json({ message: "Store not found" });

    // Create product
    const product = await Product.create({
      store: store._id,
      name,
      description,
      price,
      stock,
      image,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc Get all products of a store
// @route GET /api/products
// @access Public
const getProductsByStore = async (req, res) => {
  try {
    const store = await Store.findOne({ domain: req.query.domain });
    if (!store) return res.status(404).json({ message: "Store not found" });

    const products = await Product.find({ store: store._id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc Update a Product
// @route PUT /api/products/:id
// @access Private (Only store owners)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const store = await Store.findOne({ user: req.user._id });
    if (!store || product.store.toString() !== store._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Update product fields
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.stock = req.body.stock || product.stock;
    product.image = req.body.image || product.image;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc Delete a Product
// @route DELETE /api/products/:id
// @access Private (Only store owners)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const store = await Store.findOne({ user: req.user._id });
    if (!store || product.store.toString() !== store._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { createProduct, getProductsByStore, updateProduct, deleteProduct };
