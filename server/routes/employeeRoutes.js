const express = require("express");

const router = express.Router();

const upload = require("../config/multer");

const protect = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");
const {
  getEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  restoreEmployee,
} = require("../controllers/employeeController");

// =====================================
// GET ALL EMPLOYEES
// =====================================

router.get(
  "/",
  protect,
  getEmployees
);

// =====================================
// GET ONE EMPLOYEE
// =====================================

router.get(
  "/:id",
  protect,
  getEmployeeById
);

// =====================================
// ADD EMPLOYEE
// =====================================

router.post(
  "/",
  protect,
  upload.single("photo"),
  addEmployee
);

// =====================================
// UPDATE EMPLOYEE
// =====================================

router.put(
  "/:id",
  protect,
  upload.single("photo"),
  updateEmployee
);

// =====================================
// DELETE / DEACTIVATE EMPLOYEE
// =====================================

router.delete(
  "/:id",
  protect,
   adminOnly,
  deleteEmployee
);

// =====================================
// RESTORE EMPLOYEE
// =====================================

router.put(
  "/:id/restore",
  protect,
   adminOnly,
  restoreEmployee
);

module.exports = router;