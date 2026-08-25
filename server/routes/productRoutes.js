const express = require("express");

const router = express.Router();

const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const protect = require("../middleware/authMiddleware");

// =====================================
// GET ALL PRODUCTS
// GET /api/products
// =====================================

router.get("/", protect, getProducts);

// =====================================
// CREATE PRODUCT
// POST /api/products
// =====================================

router.post("/", protect, createProduct);

// =====================================
// UPDATE PRODUCT
// PUT /api/products/:id
// =====================================

router.put("/:id", protect, updateProduct);

// =====================================
// DELETE PRODUCT
// DELETE /api/products/:id
// =====================================

router.delete("/:id", protect, deleteProduct);

module.exports = router;