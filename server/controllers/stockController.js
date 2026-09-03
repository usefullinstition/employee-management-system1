
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



// =====================================
// DAILY SUMMARY
// =====================================


// =====================================
// DAILY SUMMARY
// =====================================

// =====================================
// DAILY SUMMARY
// =====================================

const getDailySummary = async (req, res) => {
  try {
    const companyId = getCompanyId(req, res);
    if (!companyId) return;

    // -------------------------------------
    // SELECTED DATE
    // -------------------------------------

    const selectedDate =
      req.query.date ||
      new Date().toISOString().split("T")[0];

    const startOfDay = new Date(
      `${selectedDate}T00:00:00.000Z`
    );

    const endOfDay = new Date(
      `${selectedDate}T23:59:59.999Z`
    );

    // -------------------------------------
    // GET ALL PRODUCTS
    // -------------------------------------

    const products = await Product.find({
      companyId,
    }).select(
      "name brand flavor sizeMl sizeUnit unit packaging openingStock currentStock"
    );

    // -------------------------------------
    // GET TRANSACTIONS UP TO SELECTED DATE
    // -------------------------------------

    const transactions =
      await StockTransaction.find({
        companyId,
        createdAt: {
          $lte: endOfDay,
        },
      })
        .populate(
          "product",
          "name brand flavor sizeMl sizeUnit unit packaging"
        )
        .sort({
          createdAt: 1,
        });

    // -------------------------------------
    // DAILY SUMMARY MAP
    // -------------------------------------

    const summaryMap = {};

    // -------------------------------------
    // PROCESS EACH PRODUCT
    // -------------------------------------

    for (const product of products) {
      const productId = product._id.toString();

      // -----------------------------------
      // FIND TRANSACTIONS FOR THIS PRODUCT
      // -----------------------------------

      const productTransactions =
        transactions.filter(
          (transaction) =>
            transaction.product &&
            transaction.product._id.toString() === productId
        );

      // -----------------------------------
      // FIND LAST TRANSACTION BEFORE TODAY
      // -----------------------------------

      let beginning;

      const previousTransactions =
        productTransactions.filter(
          (transaction) =>
            new Date(transaction.createdAt) <
            startOfDay
        );

      if (previousTransactions.length > 0) {
        const lastPreviousTransaction =
          previousTransactions[
            previousTransactions.length - 1
          ];

        beginning =
          Number(
            lastPreviousTransaction.newStock
          ) || 0;
      } else {
        // ---------------------------------
        // NO PREVIOUS TRANSACTION
        // USE PRODUCT OPENING STOCK
        // ---------------------------------

        beginning =
          Number(product.openingStock) || 0;
      }

      // -----------------------------------
      // TODAY'S TRANSACTIONS
      // -----------------------------------

      const todayTransactions =
        productTransactions.filter(
          (transaction) => {
            const transactionDate =
              new Date(transaction.createdAt);

            return (
              transactionDate >= startOfDay &&
              transactionDate <= endOfDay
            );
          }
        );

      // -----------------------------------
      // MOVEMENT TOTALS
      // -----------------------------------

      let saleOut = 0;
      let saleIn = 0;
      let purchase = 0;

      for (const transaction of todayTransactions) {
        const quantity =
          Number(transaction.quantity) || 0;

        switch (transaction.type) {
          case "SALE_OUT":
            saleOut += quantity;
            break;

          case "SALE_IN":
            saleIn += quantity;
            break;

          case "PURCHASE":
            purchase += quantity;
            break;

          default:
            // Ignore old IN / OUT transactions
            // in the new daily stock calculation.
            break;
        }
      }

      // -----------------------------------
      // CALCULATE ENDING
      // -----------------------------------

      const ending =
        beginning -
        saleOut +
        saleIn +
        purchase;

      // -----------------------------------
      // CREATE ONE ROW PER PRODUCT
      // -----------------------------------

      summaryMap[productId] = {
        date: selectedDate,

        product: {
          _id: product._id,
          name: product.name,
          brand: product.brand,
          flavor: product.flavor,
          sizeMl: product.sizeMl,
          sizeUnit: product.sizeUnit,
          unit: product.unit,
          packaging: product.packaging,
        },

        beginning,

        saleOut,

        saleIn,

        purchase,

        ending,

        calculatedEnding: ending,
      };
    }

    // -------------------------------------
    // CONVERT MAP TO ARRAY
    // -------------------------------------

    const summary =
      Object.values(summaryMap);

    // -------------------------------------
    // SORT BY PRODUCT NAME
    // -------------------------------------

    summary.sort((a, b) =>
      (a.product?.name || "").localeCompare(
        b.product?.name || ""
      )
    );

    // -------------------------------------
    // RESPONSE
    // -------------------------------------

    return res.status(200).json({
      date: selectedDate,
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

