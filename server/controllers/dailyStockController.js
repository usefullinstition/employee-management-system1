const DailyStock = require("../models/DailyStock");
const Product = require("../models/Product");
const protect = require("../middleware/authMiddleware");

// =====================================
// GET DAILY STOCK
// =====================================

const getDailyStock = async (req, res) => {
  try {
    console.log("========== DAILY STOCK AUTH ==========");
    console.log("Authorization:", req.headers.authorization);
    console.log("REQ.USER:", req.user);
    console.log("COMPANY ID:", req.user?.companyId);
    console.log("======================================");

    if (!req.user?.companyId) {
      return res.status(401).json({
        message: "Company information is missing",
      });
    }

    const companyId = req.user.companyId;
    const { date } = req.query;

    const query = {
      companyId,
    };

    if (date) {
      const start = new Date(`${date}T00:00:00.000Z`);
      const end = new Date(`${date}T23:59:59.999Z`);

      if (
        Number.isNaN(start.getTime()) ||
        Number.isNaN(end.getTime())
      ) {
        return res.status(400).json({
          message: "Invalid date",
        });
      }

      query.date = {
        $gte: start,
        $lte: end,
      };
    }

    const records = await DailyStock.find(query)
      .populate(
        "product",
        "name brand flavor packaging sizeMl sizeUnit unit"
      )
      .sort({
        date: -1,
        createdAt: -1,
      });

    return res.status(200).json(records);
  } catch (error) {
    console.error("GET DAILY STOCK ERROR:", error);

    return res.status(500).json({
      message:
        error.message || "Failed to fetch daily stock",
    });
  }
};

// =====================================
// CREATE / UPDATE DAILY STOCK
// =====================================

const saveDailyStock = async (req, res) => {
  try {
    const {
      productId,
      date,
      saleOut = 0,
      saleIn = 0,
      purchase = 0,
    } = req.body;

    // =====================================
    // AUTH
    // =====================================

    if (!req.user?.companyId) {
      return res.status(401).json({
        message: "Company information is missing",
      });
    }

    const companyId = req.user.companyId;

    // =====================================
    // VALIDATION
    // =====================================

    if (!productId) {
      return res.status(400).json({
        message: "Product is required",
      });
    }

    if (!date) {
      return res.status(400).json({
        message: "Date is required",
      });
    }

    // =====================================
    // FIND PRODUCT
    // =====================================

    const product = await Product.findOne({
      _id: productId,
      companyId,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // =====================================
    // DATE
    // =====================================

    const selectedDate = new Date(
      `${date}T00:00:00.000Z`
    );

    if (Number.isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        message: "Invalid date",
      });
    }

    // =====================================
    // NUMBERS
    // =====================================

    const outQty = Number(saleOut);
    const inQty = Number(saleIn);
    const purchaseQty = Number(purchase);

    if (
      !Number.isFinite(outQty) ||
      !Number.isFinite(inQty) ||
      !Number.isFinite(purchaseQty)
    ) {
      return res.status(400).json({
        message: "Stock quantities must be valid numbers",
      });
    }

    if (
      outQty < 0 ||
      inQty < 0 ||
      purchaseQty < 0
    ) {
      return res.status(400).json({
        message: "Stock quantities cannot be negative",
      });
    }

    // =====================================
    // FIND PREVIOUS DAILY RECORD
    // =====================================

    const previousRecord = await DailyStock.findOne({
      companyId,
      product: productId,
      date: {
        $lt: selectedDate,
      },
    }).sort({
      date: -1,
    });

    // =====================================
    // BEGINNING STOCK
    // =====================================

    let beginning;

    if (previousRecord) {
      beginning = Number(previousRecord.ending) || 0;
    } else {
      beginning = Number(product.openingStock) || 0;
    }

    // =====================================
    // ENDING STOCK
    // =====================================

    const ending =
      beginning -
      outQty +
      inQty +
      purchaseQty;

    if (ending < 0) {
      return res.status(400).json({
        message: "Insufficient stock",
        beginning,
        saleOut: outQty,
        saleIn: inQty,
        purchase: purchaseQty,
        ending,
      });
    }

    // =====================================
    // SAVE DAILY RECORD
    // =====================================

    const record =
      await DailyStock.findOneAndUpdate(
        {
          companyId,
          product: productId,
          date: selectedDate,
        },
        {
          $set: {
            companyId,
            product: productId,
            date: selectedDate,
            beginning,
            saleOut: outQty,
            saleIn: inQty,
            purchase: purchaseQty,
            ending,
          },
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        }
      ).populate(
        "product",
        "name brand flavor packaging sizeMl sizeUnit unit"
      );

    return res.status(200).json({
      message: "Daily stock saved successfully",
      dailyStock: record,
    });
  } catch (error) {
    console.error("SAVE DAILY STOCK ERROR:", error);

    return res.status(500).json({
      message:
        error.message ||
        "Failed to save daily stock",
    });
  }
};

// =====================================
// EXPORT
// =====================================

module.exports = {
  getDailyStock,
  saveDailyStock,
};