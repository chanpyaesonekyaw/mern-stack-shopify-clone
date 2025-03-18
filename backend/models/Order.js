const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
      }
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Paid", "Shipped"], default: "Pending" },
    paymentMethod: { type: String, enum: ["COD", "Online"], default: "COD" },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
