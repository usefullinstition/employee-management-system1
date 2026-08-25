const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createSalaryAdvance,
  getSalaryAdvances,
  getEmployeeAdvances,
} = require("../controllers/salaryAdvanceController");

// Get all advances
router.get(
  "/",
  protect,
  getSalaryAdvances
);

// Create advance
router.post(
  "/",
  protect,
  createSalaryAdvance
);

// Get one employee's advances
router.get(
  "/employee/:employeeId",
  protect,
  getEmployeeAdvances
);

module.exports = router;