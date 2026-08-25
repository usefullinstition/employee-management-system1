const Employee = require("../models/Employee");
const SalaryAdvance = require("../models/SalaryAdvance");

// ==============================
// CREATE SALARY ADVANCE
// ==============================
const {
  calculatePayroll,
} = require("../utils/payrollCalculator");
const createSalaryAdvance = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const {
      employeeId,
      amount,
      reason,
    } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        message: "Employee is required",
      });
    }

    const advanceAmount = Number(amount);

    if (
      !Number.isFinite(advanceAmount) ||
      advanceAmount <= 0
    ) {
      return res.status(400).json({
        message: "Advance amount must be greater than 0",
      });
    }

    const employee = await Employee.findOne({
      _id: employeeId,
      companyId,
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    const advance = await SalaryAdvance.create({
      companyId,
      employee: employee._id,
      amount: advanceAmount,
      reason: reason || "",
      status: "Approved",
    });

    // Add advance to employee balance
    employee.salaryAdvance =
      (Number(employee.salaryAdvance) || 0) +
      advanceAmount;

    const payroll = calculatePayroll({
  salary: employee.salary,
  salaryAdvance: employee.salaryAdvance,
  otherDeduction: employee.otherDeduction,
});

employee.tax = payroll.tax;
employee.pension = payroll.pension;
employee.netSalary = payroll.netSalary;

    await employee.save();

    const populatedAdvance =
      await SalaryAdvance.findById(advance._id)
        .populate(
          "employee",
          "name employeeId salary"
        );

    return res.status(201).json({
      message: "Salary advance recorded successfully",
      advance: populatedAdvance,
      employee,
    });
  } catch (error) {
    console.error(
      "CREATE SALARY ADVANCE ERROR:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// GET ALL ADVANCES
// ==============================
const getSalaryAdvances = async (req, res) => {
  try {
    const advances = await SalaryAdvance.find({
      companyId: req.user.companyId,
    })
      .populate(
        "employee",
        "name employeeId department position salary"
      )
      .sort({ createdAt: -1 });

    res.json(advances);
  } catch (error) {
    console.error(
      "GET SALARY ADVANCES ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// GET EMPLOYEE ADVANCES
// ==============================
const getEmployeeAdvances = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.employeeId,
      companyId: req.user.companyId,
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    const advances = await SalaryAdvance.find({
      companyId: req.user.companyId,
      employee: employee._id,
    }).sort({ createdAt: -1 });

    res.json(advances);
  } catch (error) {
    console.error(
      "GET EMPLOYEE ADVANCES ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createSalaryAdvance,
  getSalaryAdvances,
  getEmployeeAdvances,
};