// const express = require("express");

// const router = express.Router();
// const protect = require("../middleware/authMiddleware");

// const {
//   getDailyStock,
//   saveDailyStock,
// } = require("../controllers/dailyStockController");

// router.get("/", getDailyStock);

// router.post("/", saveDailyStock);

// module.exports = router;    
const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getDailyStock,
  saveDailyStock,
} = require("../controllers/dailyStockController");

// =====================================
// DAILY STOCK
// =====================================

// GET /api/daily-stock
router.get("/", protect, getDailyStock);

// POST /api/daily-stock
router.post("/", protect, saveDailyStock);

module.exports = router;