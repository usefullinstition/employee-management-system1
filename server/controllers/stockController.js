
const Product = require("../models/Product");
const StockTransaction = require("../models/StockTransaction");

// =====================================
// GET COMPANY ID
// =====================================

const getCompanyId = (req, res) => {
  if (!req.user?.companyId) {
    res.status(401).json({
      message: "User company not found",
    });

    return null;
  }

  return req.user.companyId;
};

// =====================================
// PURCHASE
// =====================================

const purchaseStock = async (req, res) => {
  try {
    const companyId = getCompanyId(req, res);
    if (!companyId) return;

    const { productId, quantity, note } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    const qty = Number(quantity);

    if (!Number.isFinite(qty) || qty <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0",
      });
    }

    const product = await Product.findOne({
      _id: productId,
      companyId,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const previousStock = Number(product.currentStock) || 0;
    const newStock = previousStock + qty;

    product.currentStock = newStock;

    await product.save();

    const transaction = await StockTransaction.create({
      companyId,
      product: product._id,
      type: "PURCHASE",
      quantity: qty,
      previousStock,
      newStock,
      note: note?.trim() || "Purchase from main company",
    });

    return res.status(201).json({
      message: "Purchase recorded successfully",
      product,
      transaction,
    });
  } catch (error) {
    console.error("PURCHASE ERROR:", error);

    return res.status(500).json({
      message: error.message || "Failed to record purchase",
    });
  }
};

// =====================================
// SALE OUT
// =====================================

const saleOut = async (req, res) => {
  try {
    const companyId = getCompanyId(req, res);
    if (!companyId) return;

    const { productId, quantity, note } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    const qty = Number(quantity);

    if (!Number.isFinite(qty) || qty <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0",
      });
    }

    const product = await Product.findOne({
      _id: productId,
      companyId,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const previousStock = Number(product.currentStock) || 0;

    if (qty > previousStock) {
      return res.status(400).json({
        message: `Insufficient stock. Available stock: ${previousStock}`,
      });
    }

    const newStock = previousStock - qty;

    product.currentStock = newStock;

    await product.save();

    const transaction = await StockTransaction.create({
      companyId,
      product: product._id,
      type: "SALE_OUT",
      quantity: qty,
      previousStock,
      newStock,
      note: note?.trim() || "Sale out - morning vehicle",
    });

    return res.status(201).json({
      message: "Sale out recorded successfully",
      product,
      transaction,
    });
  } catch (error) {
    console.error("SALE OUT ERROR:", error);

    return res.status(500).json({
      message: error.message || "Failed to record sale out",
    });
  }
};

// =====================================
// SALE IN
// =====================================

const saleIn = async (req, res) => {
  try {
    const companyId = getCompanyId(req, res);
    if (!companyId) return;

    const { productId, quantity, note } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    const qty = Number(quantity);

    if (!Number.isFinite(qty) || qty <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0",
      });
    }

    const product = await Product.findOne({
      _id: productId,
      companyId,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const previousStock = Number(product.currentStock) || 0;
    const newStock = previousStock + qty;

    product.currentStock = newStock;

    await product.save();

    const transaction = await StockTransaction.create({
      companyId,
      product: product._id,
      type: "SALE_IN",
      quantity: qty,
      previousStock,
      newStock,
      note: note?.trim() || "Sale in - vehicle return",
    });

    return res.status(201).json({
      message: "Sale in recorded successfully",
      product,
      transaction,
    });
  } catch (error) {
    console.error("SALE IN ERROR:", error);

    return res.status(500).json({
      message: error.message || "Failed to record sale in",
    });
  }
};

// =====================================
// GET TRANSACTIONS
// =====================================

const getTransactions = async (req, res) => {
  try {
    const companyId = getCompanyId(req, res);
    if (!companyId) return;

    const transactions = await StockTransaction.find({
      companyId,
    })
      .populate(
        "product",
        "name brand flavor sizeMl sizeUnit unit packaging"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json(transactions);
  } catch (error) {
    console.error("GET TRANSACTIONS ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch transactions",
    });
  }
};

// =====================================
// DAILY SUMMARY
// =====================================

const getDailySummary = async (req, res) => {
  try {
    const companyId = getCompanyId(req, res);
    if (!companyId) return;

    const { date } = req.query;

    const transactions = await StockTransaction.find({
      companyId,
    })
      .populate("product", "name brand")
      .sort({ createdAt: 1 });

    const dailyMap = {};

    for (const transaction of transactions) {
      if (!transaction.product) continue;

      const transactionDate = new Date(transaction.createdAt)
        .toISOString()
        .split("T")[0];

      // If frontend selected a date,
      // only return that date.
      if (date && transactionDate !== date) {
        continue;
      }

      const productId = transaction.product._id.toString();

      const key = `${transactionDate}_${productId}`;

      if (!dailyMap[key]) {
        dailyMap[key] = {
          date: transactionDate,

          product: transaction.product,

          beginning:
            Number(transaction.previousStock) || 0,

          saleOut: 0,

          saleIn: 0,

          purchase: 0,

          ending:
            Number(transaction.newStock) || 0,
        };
      }

      const quantity =
        Number(transaction.quantity) || 0;

     switch (transaction.type) {
  case "SALE_OUT":
    dailyMap[key].saleOut += quantity;
    break;

  case "SALE_IN":
    dailyMap[key].saleIn += quantity;
    break;

  case "PURCHASE":
    dailyMap[key].purchase += quantity;
    break;

  default:
    break;
}

      dailyMap[key].ending =
        Number(transaction.newStock) || 0;
    }

    const summary = Object.values(dailyMap).map(
      (item) => ({
        ...item,

        calculatedEnding:
          item.beginning -
          item.saleOut +
          item.saleIn +
          item.purchase,
      })
    );

    summary.sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    );

    return res.status(200).json({
      date: date || null,
      summary,
    });
  } catch (error) {
    console.error(
      "GET DAILY SUMMARY ERROR:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to fetch daily stock summary",
    });
  }
};

module.exports = {
  purchaseStock,
  saleOut,
  saleIn,
  getTransactions,
  getDailySummary,
};

