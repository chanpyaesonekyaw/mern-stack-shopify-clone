const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  domain: { type: String, unique: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Store = mongoose.model("Store", StoreSchema);
module.exports = Store;
