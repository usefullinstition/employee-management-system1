const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    month: {
      type: String,
      required: true,
      // Example: "2026-08"
    },

    grossSalary: {
      type: Number,
      required: true,
      min: 0,
    },

    tax: {
      type: Number,
      default: 0,
      min: 0,
    },

    pension: {
      type: Number,
      default: 0,
      min: 0,
    },

    otherDeduction: {
      type: Number,
      default: 0,
      min: 0,
    },

    salaryAdvance: {
      type: Number,
      default: 0,
      min: 0,
    },

    netSalary: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["Draft", "Paid"],
      default: "Draft",
    },

    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// One payroll record per employee per month
payrollSchema.index(
  {
    companyId: 1,
    employee: 1,
    month: 1,
  },
  {
    unique: true,
  }
);

module.exports =
  mongoose.models.Payroll ||
  mongoose.model("Payroll", payrollSchema);