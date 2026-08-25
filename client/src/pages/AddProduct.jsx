import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import {
  FiArrowLeft,
  FiPackage,
  FiDroplet,
  FiBox,
  FiLayers,
  FiHash,
  FiAlertTriangle,
  FiSave,
} from "react-icons/fi";

import "./AddProduct.css";

// =====================================
// PRODUCT DATA
// =====================================

const productData = {
  "Coca-Cola": ["Original", "Zero Sugar"],

  Fanta: ["Orange", "Pineapple", "Strawberry", "Apple"],

  Sprite: ["Lemon-Lime", "Zero Sugar"],

  Schweppes: ["Tonic", "Bitter Lemon", "Ginger Ale"],

  "Minute Maid": ["Orange", "Apple", "Mango"],

  Other: ["Other"],
};

// =====================================
// PACKAGING OPTIONS
// =====================================

const packagingOptions = [
  {
    value: "Bottle",
    label: "Bottle",
    icon: "🍾",
    description: "Returnable / glass bottle",
  },
  {
    value: "Plastic",
    label: "Plastic",
    icon: "🧴",
    description: "PET plastic bottle",
  },
];

// =====================================
// SIZE OPTIONS
// =====================================

const sizeOptions = [
  { value: 250, label: "250 ml" },
  { value: 300, label: "300 ml" },
  { value: 330, label: "330 ml" },
  { value: 500, label: "500 ml" },
  { value: 600, label: "600 ml" },
  { value: 750, label: "750 ml" },
  { value: 1000, label: "1 L" },
  { value: 1500, label: "1.5 L" },
  { value: 2000, label: "2 L" },
  { value: 2500, label: "2.5 L" },
];

// =====================================
// UNIT OPTIONS
// =====================================

const unitOptions = [
  {
    value: "case",
    label: "Case",
  },
  {
    value: "piece",
    label: "Piece",
  },
  {
    value: "crate",
    label: "Crate",
  },
];

function AddProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    brand: "",
    name: "",
    flavor: "",
    packaging: "",
    size: "",
    sizeUnit: "ml",
    unit: "case",
    openingStock: "",
    minimumStock: "",
    price: "",
  });

  const [loading, setLoading] = useState(false);
  const [availableFlavors, setAvailableFlavors] = useState([]);

  // =====================================
  // BRAND CHANGE
  // =====================================

  const handleBrandChange = (e) => {
    const brand = e.target.value;

    setForm((prev) => ({
      ...prev,
      brand,
      name: "",
      flavor: "",
    }));

    setAvailableFlavors(
      brand ? productData[brand] || [] : []
    );
  };

  // =====================================
  // INPUT CHANGE
  // =====================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================
  // FLAVOR CHANGE
  // =====================================

  const handleFlavorChange = (e) => {
    const flavor = e.target.value;

    setForm((prev) => ({
      ...prev,
      flavor,
      name: prev.brand
        ? `${prev.brand} ${flavor}`
        : flavor,
    }));
  };

  // =====================================
  // PACKAGING SELECT
  // =====================================

  const handlePackagingSelect = (packaging) => {
    setForm((prev) => ({
      ...prev,
      packaging,
    }));
  };

  // =====================================
  // SUBMIT
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // -------------------------------
    // VALIDATION
    // -------------------------------

    if (!form.brand) {
      toast.error("Please select a brand");
      return;
    }

    if (!form.flavor) {
      toast.error("Please select a flavor");
      return;
    }

    if (!form.packaging) {
      toast.error("Please select packaging type");
      return;
    }

    if (!form.size) {
      toast.error("Please select product size");
      return;
    }

    if (form.openingStock === "") {
      toast.error("Please enter opening stock");
      return;
    }

    if (form.minimumStock === "") {
      toast.error("Please enter minimum stock");
      return;
    }

    // -------------------------------
    // CREATE PRODUCT
    // -------------------------------

    try {
      setLoading(true);

      const payload = {
        brand: form.brand,

        name:
          form.name ||
          `${form.brand} ${form.flavor}`,

        flavor: form.flavor,

        category: "Beverage",

        packaging: form.packaging,

        // IMPORTANT:
        // Backend Product.js should use sizeMl
        sizeMl: Number(form.size),

        sizeUnit: form.sizeUnit,

        unit: form.unit,

        openingStock: Number(form.openingStock),

        currentStock: Number(form.openingStock),

        minimumStock: Number(form.minimumStock),

        price: Number(form.price) || 0,
      };

      console.log(
        "================================="
      );
      console.log("SENDING PRODUCT:", payload);
      console.log(
        "================================="
      );

      const response = await API.post(
        "/products",
        payload
      );

      console.log(
        "PRODUCT CREATED:",
        response.data
      );

      toast.success(
        response.data?.message ||
          "Product created successfully!"
      );

      setTimeout(() => {
        navigate("/products");
      }, 700);

    } catch (error) {
      console.error(
        "================================="
      );

      console.error(
        "ADD PRODUCT ERROR:"
      );

      console.error(
        error.response?.data || error
      );

      console.error(
        "================================="
      );

      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to create product"
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // RESET
  // =====================================

  const handleReset = () => {
    setForm({
      brand: "",
      name: "",
      flavor: "",
      packaging: "",
      size: "",
      sizeUnit: "ml",
      unit: "case",
      openingStock: "",
      minimumStock: "",
      price: "",
    });

    setAvailableFlavors([]);
  };

  // =====================================
  // PREVIEW NAME
  // =====================================

  const previewName =
    form.brand && form.flavor
      ? `${form.brand} ${form.flavor}`
      : "Your product name";

  // =====================================
  // RETURN
  // =====================================

  return (
    <div className="add-product-page">

      {/* TOP NAV */}

      <div className="add-product-top">

        <Link
          to="/products"
          className="back-link"
        >
          <FiArrowLeft />
          Back to Products
        </Link>

        <div className="top-badge">
          <FiPackage />
          INVENTORY
        </div>

      </div>

      {/* HEADER */}

      <div className="add-product-header">

        <div>

          <p className="page-label">
            PRODUCT MANAGEMENT
          </p>

          <h1>
            Add New Product
          </h1>

          <p>
            Add a beverage product and configure
            its packaging, size and stock details.
          </p>

        </div>

      </div>

      {/* MAIN GRID */}

      <div className="add-product-layout">

        {/* FORM */}

        <form
          className="product-form-card"
          onSubmit={handleSubmit}
        >

          {/* PRODUCT INFORMATION */}

          <div className="form-section">

            <div className="section-title">

              <div className="section-icon">
                <FiDroplet />
              </div>

              <div>
                <h2>
                  Product Information
                </h2>

                <p>
                  Select the product and flavor.
                </p>
              </div>

            </div>

            <div className="form-grid">

              {/* BRAND */}

              <div className="form-group">

                <label>
                  Brand
                  <span>*</span>
                </label>

                <select
                  name="brand"
                  value={form.brand}
                  onChange={handleBrandChange}
                >

                  <option value="">
                    Select brand
                  </option>

                  {Object.keys(productData).map(
                    (brand) => (
                      <option
                        key={brand}
                        value={brand}
                      >
                        {brand}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* FLAVOR */}

              <div className="form-group">

                <label>
                  Flavor
                  <span>*</span>
                </label>

                <select
                  name="flavor"
                  value={form.flavor}
                  onChange={handleFlavorChange}
                  disabled={!form.brand}
                >

                  <option value="">
                    {form.brand
                      ? "Select flavor"
                      : "Select brand first"}
                  </option>

                  {availableFlavors.map(
                    (flavor) => (
                      <option
                        key={flavor}
                        value={flavor}
                      >
                        {flavor}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* PRODUCT NAME */}

              <div className="form-group full">

                <label>
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Product name"
                />

                <small>
                  Automatically generated from
                  brand and flavor. You can edit it.
                </small>

              </div>

            </div>

          </div>

          {/* PACKAGING */}

          <div className="form-section">

            <div className="section-title">

              <div className="section-icon">
                <FiBox />
              </div>

              <div>
                <h2>
                  Packaging
                </h2>

                <p>
                  Choose how the product is packaged.
                </p>
              </div>

            </div>

            <div className="packaging-grid">

              {packagingOptions.map(
                (option) => (

                  <button
                    type="button"
                    key={option.value}
                    className={`packaging-option ${
                      form.packaging ===
                      option.value
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handlePackagingSelect(
                        option.value
                      )
                    }
                  >

                    <div className="packaging-emoji">
                      {option.icon}
                    </div>

                    <div className="packaging-info">

                      <strong>
                        {option.label}
                      </strong>

                      <span>
                        {option.description}
                      </span>

                    </div>

                    <div className="radio-circle">

                      {form.packaging ===
                        option.value && (
                        <div />
                      )}

                    </div>

                  </button>

                )
              )}

            </div>

          </div>

          {/* SIZE & UNIT */}

          <div className="form-section">

            <div className="section-title">

              <div className="section-icon">
                <FiLayers />
              </div>

              <div>
                <h2>
                  Size & Unit
                </h2>

                <p>
                  Define product size and inventory unit.
                </p>
              </div>

            </div>

            <div className="form-grid">

              {/* SIZE */}

              <div className="form-group">

                <label>
                  Product Size
                  <span>*</span>
                </label>

                <select
                  name="size"
                  value={form.size}
                  onChange={handleChange}
                >

                  <option value="">
                    Select size
                  </option>

                  {sizeOptions.map(
                    (size) => (

                      <option
                        key={size.value}
                        value={size.value}
                      >
                        {size.label}
                      </option>

                    )
                  )}

                </select>

              </div>

              {/* SIZE UNIT */}

              <div className="form-group">

                <label>
                  Size Unit
                </label>

                <select
                  name="sizeUnit"
                  value={form.sizeUnit}
                  onChange={handleChange}
                >

                  <option value="ml">
                    Milliliter (ml)
                  </option>

                  <option value="L">
                    Liter (L)
                  </option>

                </select>

              </div>

              {/* INVENTORY UNIT */}

              <div className="form-group">

                <label>
                  Inventory Unit
                </label>

                <select
                  name="unit"
                  value={form.unit}
                  onChange={handleChange}
                >

                  {unitOptions.map(
                    (unit) => (

                      <option
                        key={unit.value}
                        value={unit.value}
                      >
                        {unit.label}
                      </option>

                    )
                  )}

                </select>

              </div>

            </div>

          </div>

          {/* STOCK */}

          <div className="form-section">

            <div className="section-title">

              <div className="section-icon">
                <FiHash />
              </div>

              <div>
                <h2>
                  Stock Information
                </h2>

                <p>
                  Set your initial inventory levels.
                </p>
              </div>

            </div>

            <div className="form-grid">

              {/* OPENING STOCK */}

              <div className="form-group">

                <label>
                  Opening Stock
                  <span>*</span>
                </label>

                <input
                  type="number"
                  name="openingStock"
                  value={form.openingStock}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                />

              </div>

              {/* MINIMUM STOCK */}

              <div className="form-group">

                <label>
                  Minimum Stock
                  <span>*</span>
                </label>

                <input
                  type="number"
                  name="minimumStock"
                  value={form.minimumStock}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                />

              </div>

              {/* PRICE */}

              <div className="form-group">

                <label>
                  Price
                </label>

                <div className="input-with-prefix">

                  <span>
                    ETB
                  </span>

                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />

                </div>

              </div>

            </div>

            {/* LOW STOCK ALERT */}

            <div className="stock-tip">

              <FiAlertTriangle />

              <div>

                <strong>
                  Low stock alert
                </strong>

                <p>
                  You'll be alerted when current
                  stock falls below the minimum level.
                </p>

              </div>

            </div>

          </div>

          {/* ACTIONS */}

          <div className="form-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={handleReset}
            >
              Reset
            </button>

            <button
              type="submit"
              className="save-product-btn"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="spinner" />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave />
                  Add Product
                </>
              )}

            </button>

          </div>

        </form>

        {/* PREVIEW */}

        <div className="product-preview-card">

          <div className="preview-header">

            <span>
              LIVE PREVIEW
            </span>

            <FiPackage />

          </div>

          <div className="bottle-preview">

            <div className="bottle-cap" />

            <div className="bottle-body">

              <div className="bottle-label">

                <small>
                  {form.brand || "YOUR BRAND"}
                </small>

                <strong>
                  {form.flavor || "PRODUCT"}
                </strong>

                <span>
                  {form.size
                    ? `${form.size} ${form.sizeUnit}`
                    : "300 ml"}
                </span>

              </div>

            </div>

          </div>

          <div className="preview-info">

            <p>
              PRODUCT
            </p>

            <h3>
              {previewName}
            </h3>

            <div className="preview-tags">

              {form.packaging && (
                <span>
                  {form.packaging === "Plastic"
                    ? "🧴"
                    : "🍾"}{" "}
                  {form.packaging}
                </span>
              )}

              {form.size && (
                <span>
                  📏 {form.size} {form.sizeUnit}
                </span>
              )}

              {form.unit && (
                <span>
                  📦 {form.unit}
                </span>
              )}

            </div>

            <div className="preview-stock">

              <div>

                <span>
                  Opening Stock
                </span>

                <strong>
                  {form.openingStock || 0}
                </strong>

              </div>

              <div>

                <span>
                  Minimum
                </span>

                <strong>
                  {form.minimumStock || 0}
                </strong>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AddProduct;