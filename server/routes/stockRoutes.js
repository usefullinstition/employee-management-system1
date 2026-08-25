
const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  purchaseStock,
  saleOut,
  saleIn,
  getTransactions,
  getDailySummary,
} = require("../controllers/stockController");

// =====================================
// STOCK MOVEMENT
// =====================================

router.post(
  "/purchase",
  authMiddleware,
  purchaseStock
);

router.post(
  "/sale-out",
  authMiddleware,
  saleOut
);

router.post(
  "/sale-in",
  authMiddleware,
  saleIn
);

// =====================================
// STOCK HISTORY
// =====================================

router.get(
  "/transactions",
  authMiddleware,
  getTransactions
);

// =====================================
// DAILY STOCK
// =====================================

router.get(
  "/daily-summary",
  authMiddleware,
  getDailySummary
);

module.exports = router;

