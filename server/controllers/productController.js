
const Product = require("../models/Product");

// =====================================
// CREATE PRODUCT
// =====================================

const createProduct = async (req, res) => {
  try {
    console.log("CREATE PRODUCT BODY:", req.body);

    const {
      brand,
      name,
      flavor,
      category,
      packaging,
      sizeMl,
      sizeUnit,
      unit,
      openingStock,
      currentStock,
      minimumStock,
      price,
    } = req.body;

    // Validation
    if (!brand) {
      return res.status(400).json({
        message: "Brand is required",
      });
    }

    if (!name) {
      return res.status(400).json({
        message: "Product name is required",
      });
    }

    if (!flavor) {
      return res.status(400).json({
        message: "Flavor is required",
      });
    }

    if (!packaging) {
      return res.status(400).json({
        message: "Packaging is required",
      });
    }

    if (!sizeMl) {
      return res.status(400).json({
        message: "Product size is required",
      });
    }

    if (openingStock === undefined) {
      return res.status(400).json({
        message: "Opening stock is required",
      });
    }

    if (minimumStock === undefined) {
      return res.status(400).json({
        message: "Minimum stock is required",
      });
    }

    const product = await Product.create({
      companyId: req.user.companyId,
      brand,
      name,
      flavor,
      category: category || "Beverage",
      packaging,
      sizeMl: Number(sizeMl),
      sizeUnit: sizeUnit || "ml",
      unit: unit || "case",

      openingStock: Number(openingStock),

      currentStock:
        currentStock !== undefined
          ? Number(currentStock)
          : Number(openingStock),

      minimumStock: Number(minimumStock),

      price: Number(price) || 0,
    });

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    return res.status(500).json({
      message: error.message || "Failed to create product",
    });
  }
};


// =====================================
// GET PRODUCTS
// =====================================

const getProducts = async (req, res) => {
  try {
    const products = await Product.find ({
  companyId: req.user.companyId,
}).sort({
      createdAt: -1,
    });

    return res.status(200).json(products);
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch products",
    });
  }
};

// =====================================
// UPDATE PRODUCT
// =====================================

const updateProduct = async (req, res) => {
  try {
    console.log("UPDATE PRODUCT:", req.params.id);
    console.log("UPDATE BODY:", req.body);

    const {
      brand,
      name,
      flavor,
      category,
      packaging,
      sizeMl,
      sizeUnit,
      unit,
      openingStock,
      currentStock,
      minimumStock,
      price,
    } = req.body;

   const product = await Product.findOne({
  _id: req.params.id,
  companyId: req.user.companyId,
});

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Update only fields that were sent
    if (brand !== undefined) product.brand = brand;
    if (name !== undefined) product.name = name;
    if (flavor !== undefined) product.flavor = flavor;
    if (category !== undefined) product.category = category;
    if (packaging !== undefined) product.packaging = packaging;
    if (sizeMl !== undefined) product.sizeMl = Number(sizeMl);
    if (sizeUnit !== undefined) product.sizeUnit = sizeUnit;
    if (unit !== undefined) product.unit = unit;
    if (openingStock !== undefined) {
      product.openingStock = Number(openingStock);
    }
    if (currentStock !== undefined) {
      product.currentStock = Number(currentStock);
    }
    if (minimumStock !== undefined) {
      product.minimumStock = Number(minimumStock);
    }
    if (price !== undefined) {
      product.price = Number(price);
    }

    await product.save();

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    return res.status(500).json({
      message: error.message || "Failed to update product",
    });
  }
};


// =====================================
// DELETE PRODUCT
// =====================================

const deleteProduct = async (req, res) => {
  try {
    console.log("DELETE PRODUCT:", req.params.id);

    const product = await Product.findOne({
  _id: req.params.id,
  companyId: req.user.companyId,
});

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

   await Product.findOneAndDelete({
  _id: req.params.id,
  companyId: req.user.companyId,
});

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    return res.status(500).json({
      message: error.message || "Failed to delete product",
    });
  }
};


// =====================================
// EXPORTS
// =====================================

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};




