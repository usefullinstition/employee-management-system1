const Employee = require("../models/Employee");
const Payroll = require("../models/Payroll");
const SalaryAdvance = require("../models/SalaryAdvance");
// =========================
// TAX CALCULATION
// =========================

const calculateTax = (salary) => {
  const amount = Number(salary) || 0;

  if (amount <= 2000) return 0;

  if (amount <= 4000) {
    return Math.max(0, amount * 0.15 - 300);
  }

  if (amount <= 7000) {
    return Math.max(0, amount * 0.2 - 500);
  }

  if (amount <= 10000) {
    return Math.max(0, amount * 0.25 - 850);
  }

  if (amount <= 14000) {
    return Math.max(0, amount * 0.3 - 1350);
  }

  return Math.max(0, amount * 0.35 - 2050);
};

// =========================
// CALCULATE PAYROLL
// =========================

const calculatePayroll = ({
  salary,
  salaryAdvance = 0,
  otherDeduction = 0,
}) => {
  const grossSalary = Number(salary) || 0;
  const advance = Number(salaryAdvance) || 0;
  const other = Number(otherDeduction) || 0;

  const tax = calculateTax(grossSalary);

  const pension = grossSalary * 0.07;

  const netSalary = Math.max(
    0,
    grossSalary -
      tax -
      pension -
      advance -
      other
  );

  return {
    tax,
    pension,
    netSalary,
  };
};

// =========================
// GET ALL EMPLOYEES
// =========================

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({
      companyId: req.user.companyId,
    }).sort({ createdAt: -1 });

    res.json(employees);
  } catch (error) {
    console.error("GET EMPLOYEES ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// GET EMPLOYEE BY ID
// =========================

const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      companyId: req.user.companyId,
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.json(employee);
  } catch (error) {
    console.error("GET EMPLOYEE ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// ADD EMPLOYEE
// =========================

const addEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      department,
      position,
      hireDate,
      status,
      salary,
      salaryAdvance,
      otherDeduction,
    } = req.body;

    if (!name || !email || !department || !position) {
      return res.status(400).json({
        message:
          "Name, email, department and position are required",
      });
    }

    const salaryNumber = Number(salary);

    if (!salaryNumber || salaryNumber <= 0) {
      return res.status(400).json({
        message: "Salary must be greater than 0",
      });
    }

    const existingEmployee = await Employee.findOne({
      email: email.toLowerCase(),
      companyId: req.user.companyId,
    });

    if (existingEmployee) {
      return res.status(400).json({
        message:
          "An employee with this email already exists",
      });
    }

    const payroll = calculatePayroll({
      salary: salaryNumber,
      salaryAdvance,
      otherDeduction,
    });

    const employee = new Employee({
      companyId: req.user.companyId,

      name,
      email,
      phone,
      address,

      department,
      position,

      hireDate: hireDate || undefined,

      status: status || "Active",

      salary: salaryNumber,

      salaryAdvance:
        Number(salaryAdvance) || 0,

      otherDeduction:
        Number(otherDeduction) || 0,

      tax: payroll.tax,

      pension: payroll.pension,

      netSalary: payroll.netSalary,

      photo: req.file
        ? `http://localhost:5000/uploads/${req.file.filename}`
        : "",
    });

    await employee.save();

    res.status(201).json(employee);
  } catch (error) {
    console.error("ADD EMPLOYEE ERROR:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};

// =========================
// UPDATE EMPLOYEE
// =========================

const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      companyId: req.user.companyId,
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    const {
      name,
      email,
      phone,
      address,
      department,
      position,
      hireDate,
      status,
      salary,
      salaryAdvance,
      otherDeduction,
    } = req.body;

    if (email) {
      const duplicate = await Employee.findOne({
        email: email.toLowerCase(),
        companyId: req.user.companyId,
        _id: { $ne: req.params.id },
      });

      if (duplicate) {
        return res.status(400).json({
          message:
            "Another employee already uses this email",
        });
      }
    }

    if (name !== undefined) {
      employee.name = name;
    }

    if (email !== undefined) {
      employee.email = email;
    }

    if (phone !== undefined) {
      employee.phone = phone;
    }

    if (address !== undefined) {
      employee.address = address;
    }

    if (department !== undefined) {
      employee.department = department;
    }

    if (position !== undefined) {
      employee.position = position;
    }

    if (hireDate !== undefined && hireDate !== "") {
      employee.hireDate = hireDate;
    }

    if (status !== undefined) {
      employee.status = status;
    }

    if (salary !== undefined) {
      employee.salary = Number(salary);
    }
if (salary !== undefined) {
  const salaryNumber = Number(salary);

  if (!salaryNumber || salaryNumber <= 0) {
    return res.status(400).json({
      message: "Salary must be greater than 0",
    });
  }

  employee.salary = salaryNumber;
}
    if (salaryAdvance !== undefined) {
      employee.salaryAdvance =
        Number(salaryAdvance) || 0;
    }

    if (otherDeduction !== undefined) {
      employee.otherDeduction =
        Number(otherDeduction) || 0;
    }

    const payroll = calculatePayroll({
      salary: employee.salary,
      salaryAdvance: employee.salaryAdvance,
      otherDeduction: employee.otherDeduction,
    });

    employee.tax = payroll.tax;
    employee.pension = payroll.pension;
    employee.netSalary = payroll.netSalary;

    if (req.file) {
      employee.photo =
        `http://localhost:5000/uploads/${req.file.filename}`;
    }

    await employee.save();

    res.json(employee);
  } catch (error) {
    console.error("UPDATE EMPLOYEE ERROR:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};

// =========================
// DELETE EMPLOYEE
// =========================

// =========================
// DELETE / ARCHIVE EMPLOYEE
// =========================

const deleteEmployee = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const employeeId = req.params.id;

    const employee = await Employee.findOne({
      _id: employeeId,
      companyId,
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    // Check payroll history
    const payrollCount = await Payroll.countDocuments({
      companyId,
      employee: employeeId,
    });

    // Check salary advance history
    const salaryAdvanceCount =
      await SalaryAdvance.countDocuments({
        companyId,
        employee: employeeId,
      });

    // ---------------------------------
    // HAS HISTORY
    // ---------------------------------

    if (payrollCount > 0 || salaryAdvanceCount > 0) {
      employee.status = "Inactive";

      await employee.save();

      return res.status(200).json({
        success: true,
        archived: true,
        message:
          "Employee has payroll or salary advance history, so the employee was deactivated instead of deleted.",
        payrollCount,
        salaryAdvanceCount,
        employee,
      });
    }

    // ---------------------------------
    // NO HISTORY
    // ---------------------------------

    await Employee.findOneAndDelete({
      _id: employeeId,
      companyId,
    });

    return res.status(200).json({
      success: true,
      deleted: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE EMPLOYEE ERROR:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};    
// =========================
// RESTORE EMPLOYEE
// =========================

const restoreEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      companyId: req.user.companyId,
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    employee.status = "Active";

    await employee.save();

    return res.json({
      message: "Employee restored successfully",
      employee,
    });
  } catch (error) {
    console.error(
      "RESTORE EMPLOYEE ERROR:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  restoreEmployee,
};