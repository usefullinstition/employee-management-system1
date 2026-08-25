const Employee = require("../models/Employee");
const Payroll = require("../models/Payroll");
const SalaryAdvance = require("../models/SalaryAdvance");
const {
  calculatePayroll,
} = require("../utils/payrollCalculator");

// =====================================
// CREATE PAYROLL
// =====================================

const createPayroll = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const {
      employeeId,
      month,
      otherDeduction = 0,
    } = req.body;

    // =====================================
    // VALIDATION
    // =====================================

    if (!employeeId) {
      return res.status(400).json({
        message: "Employee is required",
      });
    }

    if (!month) {
      return res.status(400).json({
        message: "Payroll month is required",
      });
    }

    // =====================================
    // FIND EMPLOYEE
    // =====================================

    const employee = await Employee.findOne({
      _id: employeeId,
      companyId,
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    // =====================================
    // CHECK DUPLICATE PAYROLL
    // =====================================

    const existingPayroll =
      await Payroll.findOne({
        companyId,
        employee: employee._id,
        month,
      });

    if (existingPayroll) {
      return res.status(400).json({
        message:
          "Payroll already exists for this employee and month",
      });
    }

    // =====================================
    // GET APPROVED SALARY ADVANCES
    // =====================================

    const advances =
      await SalaryAdvance.find({
        companyId,
        employee: employee._id,
        status: "Approved",
      });

    // =====================================
    // TOTAL SALARY ADVANCE
    // =====================================

    const totalAdvance =
      advances.reduce(
        (total, advance) => {
          return (
            total +
            Number(advance.amount || 0)
          );
        },
        0
      );

    // =====================================
    // CALCULATE PAYROLL
    // =====================================

    const calculation =
      calculatePayroll({
        salary: employee.salary,
        salaryAdvance: totalAdvance,
        otherDeduction:
          Number(otherDeduction) || 0,
      });

    // =====================================
    // CREATE PAYROLL
    // =====================================

    const payroll =
      await Payroll.create({
        companyId,

        employee: employee._id,

        month,

        grossSalary:
          calculation.grossSalary,

        tax:
          calculation.tax,

        pension:
          calculation.pension,

        otherDeduction:
          calculation.otherDeduction,

        salaryAdvance:
          calculation.salaryAdvance,

        netSalary:
          calculation.netSalary,

        status: "Draft",
      });

    // =====================================
    // MARK ADVANCES AS DEDUCTED
    // =====================================

    if (advances.length > 0) {
      await SalaryAdvance.updateMany(
        {
          _id: {
            $in: advances.map(
              (advance) => advance._id
            ),
          },
        },
        {
          $set: {
            status: "Deducted",
          },
        }
      );
    }

    // =====================================
    // UPDATE EMPLOYEE PAYROLL VALUES
    // =====================================

    employee.salaryAdvance = 0;

    employee.tax =
      calculation.tax;

    employee.pension =
      calculation.pension;

    employee.otherDeduction =
      calculation.otherDeduction;

    employee.netSalary =
      calculation.netSalary;

    await employee.save();

    // =====================================
    // POPULATE PAYROLL
    // =====================================

    const populatedPayroll =
      await Payroll.findById(
        payroll._id
      ).populate(
        "employee",
        "name employeeId department position salary"
      );

    // =====================================
    // RESPONSE
    // =====================================

    return res.status(201).json({
      message:
        "Payroll created successfully",

      payroll:
        populatedPayroll,
    });
  } catch (error) {
    console.error(
      "CREATE PAYROLL ERROR:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================
// GET ALL PAYROLL
// =====================================

const getPayroll = async (
  req,
  res
) => {
  try {
    const payroll =
      await Payroll.find({
        companyId:
          req.user.companyId,
      })
        .populate(
          "employee",
          "name employeeId department position salary"
        )
        .sort({
          createdAt: -1,
        });

    return res.json(payroll);
  } catch (error) {
    console.error(
      "GET PAYROLL ERROR:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================
// GET ONE PAYROLL
// =====================================

const getPayrollById = async (
  req,
  res
) => {
  try {
    const payroll =
      await Payroll.findOne({
        _id: req.params.id,
        companyId:
          req.user.companyId,
      }).populate(
        "employee",
        "name employeeId department position salary"
      );

    if (!payroll) {
      return res.status(404).json({
        message: "Payroll not found",
      });
    }

    return res.json(payroll);
  } catch (error) {
    console.error(
      "GET PAYROLL BY ID ERROR:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================
// MARK PAYROLL AS PAID
// =====================================

const markPayrollPaid = async (
  req,
  res
) => {
  try {
    const payroll =
      await Payroll.findOneAndUpdate(
        {
          _id: req.params.id,
          companyId:
            req.user.companyId,
        },
        {
          status: "Paid",
          paidAt: new Date(),
        },
        {
          new: true,
        }
      );

    if (!payroll) {
      return res.status(404).json({
        message: "Payroll not found",
      });
    }

    return res.json({
      message:
        "Payroll marked as paid",

      payroll,
    });
  } catch (error) {
    console.error(
      "MARK PAYROLL PAID ERROR:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};
// =====================================
// GET PAYSLIP BY PAYROLL ID
// =====================================

const getPayslip = async (req, res) => {
  try {
    const payroll = await Payroll.findOne({
      _id: req.params.id,
      companyId: req.user.companyId,
    }).populate(
      "employee",
      "name employeeId email department position salary"
    );

    if (!payroll) {
      return res.status(404).json({
        message: "Payroll not found",
      });
    }

    if (!payroll.employee) {
      return res.status(404).json({
        message: "Employee information not found",
      });
    }

    const employee = payroll.employee;

    const grossSalary =
      Number(payroll.grossSalary || 0);

    const tax =
      Number(payroll.tax || 0);

    const pension =
      Number(payroll.pension || 0);

    const salaryAdvance =
      Number(payroll.salaryAdvance || 0);

    const otherDeduction =
      Number(payroll.otherDeduction || 0);

    const totalDeductions =
      tax +
      pension +
      salaryAdvance +
      otherDeduction;

    const netSalary =
      Number(payroll.netSalary || 0);

    return res.json({
      company: {
        name: "hibu",
      },

      payroll: {
        id: payroll._id,
        month: payroll.month,
        status: payroll.status,
        paidAt: payroll.paidAt || null,
        createdAt: payroll.createdAt,
      },

      employee: {
        id: employee._id,
        employeeId:
          employee.employeeId || employee._id,
        name: employee.name,
        email: employee.email,
        department: employee.department,
        position: employee.position,
      },

      earnings: {
        basicSalary: grossSalary,
        grossSalary,
      },

      deductions: {
        tax,
        pension,
        salaryAdvance,
        otherDeduction,
        totalDeductions,
      },

      netSalary,
    });
  } catch (error) {
    console.error(
      "GET PAYSLIP ERROR:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};
// =====================================
// EXPORT
// =====================================

module.exports = {
  createPayroll,
  getPayroll,
  getPayrollById,
  getPayslip,
  markPayrollPaid,
};