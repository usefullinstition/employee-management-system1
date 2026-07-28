const express = require("express");
const router = express.Router();
const upload = require("../config/multer");

const {
  getEmployees,
  addEmployee,
  deleteEmployee,
  updateEmployee,
   
} = require("../controllers/employeeController");

router.get("/", getEmployees);
// router.post("/", addEmployee);
router.post("/", upload.single("photo"), addEmployee);
router.delete("/:id", deleteEmployee);
router.put("/:id", updateEmployee);

module.exports = router;