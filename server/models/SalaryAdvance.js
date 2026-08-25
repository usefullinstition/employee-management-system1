const mongoose = require("mongoose");

const salaryAdvanceSchema =
  new mongoose.Schema(
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
        index: true,
      },

      amount: {
        type: Number,
        required: true,
        min: 1,
      },

      date: {
        type: Date,
        default: Date.now,
      },

      reason: {
        type: String,
        trim: true,
        default: "",
      },

      status: {
        type: String,
        enum: [
          "Pending",
          "Approved",
          "Deducted",
          "Cancelled",
        ],
        default: "Approved",
      },
    },
    {
      timestamps: true,
    }
  );
module.exports =
  mongoose.models.SalaryAdvance ||
  mongoose.model("SalaryAdvance", salaryAdvanceSchema);
