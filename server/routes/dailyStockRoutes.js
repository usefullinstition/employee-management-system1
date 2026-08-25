const express = require("express");

const router = express.Router();

const {
  getDailyStock,
  saveDailyStock,
} = require("../controllers/dailyStockController");

// GET
// /api/daily-stock
router.get("/", getDailyStock);

// POST
// /api/daily-stock
router.post("/", saveDailyStock);

module.exports = router;