const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    employeeId: {
      type: String,
      trim: true,
      sparse: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    photo: {
      type: String,
      default: "",
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    position: {
      type: String,
      required: true,
      trim: true,
    },

    hireDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive", "On Leave"],
      default: "Active",
    },

    salary: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    tax: {
      type: Number,
      min: 0,
      default: 0,
    },

    pension: {
      type: Number,
      min: 0,
      default: 0,
    },

    otherDeduction: {
      type: Number,
      min: 0,
      default: 0,
    },

    salaryAdvance: {
      type: Number,
      min: 0,
      default: 0,
    },

    netSalary: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

employeeSchema.methods.calculateNetSalary = function () {
  const salary = Number(this.salary) || 0;
  const tax = Number(this.tax) || 0;
  const pension = Number(this.pension) || 0;
  const otherDeduction = Number(this.otherDeduction) || 0;
  const salaryAdvance = Number(this.salaryAdvance) || 0;

  return Math.max(
    0,
    salary -
      tax -
      pension -
      otherDeduction -
      salaryAdvance
  );
};

employeeSchema.pre("save", function (next) {
  this.netSalary = this.calculateNetSalary();
  next();
});

module.exports =
  mongoose.models.Employee ||
  mongoose.model("Employee", employeeSchema);