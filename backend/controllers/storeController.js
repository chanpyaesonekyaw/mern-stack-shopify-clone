const Store = require("../models/Store");

// @desc Create a Store
// @route POST /api/stores
// @access Private (Only logged-in users)
const createStore = async (req, res) => {
  const { name, domain, description } = req.body;

  try {
    const storeExists = await Store.findOne({ domain });
    if (storeExists) return res.status(400).json({ message: "Domain already taken" });

    const store = await Store.create({
      user: req.user._id,
      name,
      domain,
      description,
    });

    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc Get Logged-in User's Store
// @route GET /api/stores/my-store
// @access Private
const getMyStore = async (req, res) => {
  const store = await Store.findOne({ user: req.user._id });

  if (!store) return res.status(404).json({ message: "No store found" });

  res.json(store);
};

module.exports = { createStore, getMyStore };
