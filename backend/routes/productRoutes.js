const express = require("express");
const {
  createProduct,
  getProductsByStore,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createProduct);
router.get("/", getProductsByStore);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;
