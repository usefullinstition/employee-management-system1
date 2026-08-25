const mongoose = require("mongoose");

const dailyStockSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    beginning: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    saleOut: {
      type: Number,
      min: 0,
      default: 0,
    },

    saleIn: {
      type: Number,
      min: 0,
      default: 0,
    },

    purchase: {
      type: Number,
      min: 0,
      default: 0,
    },

    ending: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// One daily record per company + product + date
dailyStockSchema.index(
  {
    companyId: 1,
    product: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

module.exports =
  mongoose.models.DailyStock ||
  mongoose.model("DailyStock", dailyStockSchema);