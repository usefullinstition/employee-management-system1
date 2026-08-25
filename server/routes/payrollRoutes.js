const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createPayroll,
  getPayroll,
  getPayrollById,
  getPayslip,
  markPayrollPaid,
} = require("../controllers/payrollController");

// =====================================
// GET ALL PAYROLL
// =====================================

router.get(
  "/",
  protect,
  getPayroll
);

// =====================================
// CREATE PAYROLL
// =====================================

router.post(
  "/",
  protect,
  createPayroll
);

// =====================================
// GET ONE PAYROLL
// =====================================

router.get(
  "/:id",
  protect,
  getPayrollById
);

// =====================================
// MARK PAYROLL AS PAID
// =====================================

router.put(
  "/:id/pay",
  protect,
  markPayrollPaid
);

// =====================================
// GET PAYSLIP
// =====================================

router.get(
  "/:id/payslip",
  protect,
  getPayslip
);

module.exports = router;