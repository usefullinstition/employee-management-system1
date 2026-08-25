const DailyStock = require("../models/DailyStock");
const Product = require("../models/Product");

// =====================================
// GET DAILY STOCK
// =====================================

const getDailyStock = async (req, res) => {
  try {
    const { date } = req.query;

    if (!req.user || !req.user.companyId) {
      return res.status(401).json({
        message: "Company information is missing",
      });
    }

    const companyId = req.user.companyId;

    let query = {
      companyId,
    };

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      query.date = {
        $gte: start,
        $lt: end,
      };
    }

    const records = await DailyStock.find(query)
      .populate("product", "name brand flavor packaging sizeMl sizeUnit unit")
      .sort({
        date: -1,
        createdAt: -1,
      });

    return res.status(200).json(records);
  } catch (error) {
    console.error("GET DAILY STOCK ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch daily stock",
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

    if (!req.user || !req.user.companyId) {
      return res.status(401).json({
        message: "Company information is missing",
      });
    }

    const companyId = req.user.companyId;

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

    const product = await Product.findOne({
      _id: productId,
      companyId,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);

    // =====================================
    // FIND PREVIOUS DAY
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
    // BEGINNING
    // =====================================

    let beginning;

    if (previousRecord) {
      beginning = Number(previousRecord.ending) || 0;
    } else {
      beginning = Number(product.openingStock) || 0;
    }

    // =====================================
    // NUMBERS
    // =====================================

    const outQty = Number(saleOut) || 0;
    const inQty = Number(saleIn) || 0;
    const purchaseQty = Number(purchase) || 0;

    if (outQty < 0 || inQty < 0 || purchaseQty < 0) {
      return res.status(400).json({
        message: "Stock quantities cannot be negative",
      });
    }

    // =====================================
    // ENDING
    // =====================================

    const ending =
      beginning -
      outQty +
      inQty +
      purchaseQty;

    if (ending < 0) {
      return res.status(400).json({
        message: "Insufficient stock",
      });
    }

    // =====================================
    // SAVE DAILY RECORD
    // =====================================

    const record = await DailyStock.findOneAndUpdate(
      {
        companyId,
        product: productId,
        date: selectedDate,
      },
      {
        companyId,
        product: productId,
        date: selectedDate,
        beginning,
        saleOut: outQty,
        saleIn: inQty,
        purchase: purchaseQty,
        ending,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      message: "Daily stock saved successfully",
      dailyStock: record,
    });
  } catch (error) {
    console.error("SAVE DAILY STOCK ERROR:", error);

    return res.status(500).json({
      message: error.message || "Failed to save daily stock",
    });
  }
};

module.exports = {
  getDailyStock,
  saveDailyStock,
};