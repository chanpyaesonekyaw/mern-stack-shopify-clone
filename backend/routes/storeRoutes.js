const express = require("express");
const { createStore, getMyStore } = require("../controllers/storeController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createStore);
router.get("/my-store", protect, getMyStore);

module.exports = router;
