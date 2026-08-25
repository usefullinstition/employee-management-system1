const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // =====================================
    // COMPANY / TENANT
    // =====================================
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    // =====================================
    // PRODUCT INFORMATION
    // =====================================
    brand: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    flavor: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      default: "Beverage",
      trim: true,
    },

    packaging: {
      type: String,
      required: true,
      enum: ["Bottle", "Plastic"],
    },

    sizeMl: {
      type: Number,
      required: true,
      min: 1,
    },

    sizeUnit: {
      type: String,
      enum: ["ml", "L"],
      default: "ml",
    },

    unit: {
      type: String,
      enum: ["case", "piece", "crate"],
      default: "case",
    },

    // =====================================
    // STOCK
    // =====================================
    openingStock: {
      type: Number,
      required: true,
      min: 0,
    },

    currentStock: {
      type: Number,
      required: true,
      min: 0,
    },

    minimumStock: {
      type: Number,
      required: true,
      min: 0,
    },

    // =====================================
    // PRICE
    // =====================================
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
  },

  // =====================================
  // TIMESTAMPS
  // =====================================
  {
    timestamps: true,
  }
);
productSchema.index(
  {
    companyId: 1,
    name: 1,
    packaging: 1,
    sizeMl: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Product", productSchema);