import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "./Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Stock modal
  const [stockModal, setStockModal] = useState({
    open: false,
    type: null,
    product: null,
  });

  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");
  const [stockLoading, setStockLoading] = useState(false);

  // =====================================
  // FETCH PRODUCTS
  // =====================================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await API.get("/products");

      setProducts(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // =====================================
  // STOCK STATUS
  // =====================================

  const getStockStatus = (product) => {
    const currentStock = Number(product.currentStock) || 0;
    const minimumStock = Number(product.minimumStock) || 0;

    if (currentStock <= 0) {
      return {
        text: "Out of Stock",
        className: "out-stock",
      };
    }

    if (currentStock <= minimumStock) {
      return {
        text: "Low Stock",
        className: "low-stock",
      };
    }

    return {
      text: "In Stock",
      className: "in-stock",
    };
  };

  // =====================================
  // SIZE
  // =====================================

  const getSize = (product) => {
    if (product.sizeMl) {
      return `${product.sizeMl} ${product.sizeUnit || "ml"}`;
    }

    if (product.size) {
      return String(product.size);
    }

    return "-";
  };

  // =====================================
  // PACKAGING
  // =====================================

  const getPackaging = (product) => {
    if (product.packaging) {
      return String(product.packaging);
    }

    if (product.packageType) {
      return String(product.packageType);
    }

    return "Bottle";
  };

  // =====================================
  // PRODUCT ICON
  // =====================================

  const getProductIcon = (product) => {
    const packaging = getPackaging(product).toLowerCase();

    if (packaging.includes("plastic")) {
      return "🧴";
    }

    if (packaging.includes("glass")) {
      return "🍾";
    }

    if (packaging.includes("can")) {
      return "🥫";
    }

    if (packaging.includes("bottle")) {
      return "🥤";
    }

    return "📦";
  };

  // =====================================
  // DELETE PRODUCT
  // =====================================

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) return;

    try {
      await API.delete(`/products/${product._id}`);

      setProducts((prevProducts) =>
        prevProducts.filter(
          (item) => item._id !== product._id
        )
      );

      alert("Product deleted successfully");
    } catch (error) {
      console.error("DELETE PRODUCT ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete product"
      );
    }
  };

  // =====================================
  // OPEN STOCK MODAL
  // =====================================

  const openStockModal = (product, type) => {
    setStockModal({
      open: true,
      type,
      product,
    });

    setQuantity("");
    setNote("");
  };

  // =====================================
  // CLOSE STOCK MODAL
  // =====================================

  const closeStockModal = () => {
    if (stockLoading) return;

    setStockModal({
      open: false,
      type: null,
      product: null,
    });

    setQuantity("");
    setNote("");
  };

  // =====================================
  // SUBMIT STOCK IN / OUT
  // =====================================

  const handleStockSubmit = async (e) => {
    e.preventDefault();

    if (!stockModal.product) {
      return;
    }

    const qty = Number(quantity);

    if (!quantity || Number.isNaN(qty) || qty <= 0) {
      alert("Please enter a valid quantity greater than 0.");
      return;
    }

    const product = stockModal.product;
    const currentStock = Number(product.currentStock) || 0;

    if (
      stockModal.type === "OUT" &&
      qty > currentStock
    ) {
      alert(
        `Insufficient stock. Current stock is ${currentStock}.`
      );
      return;
    }

    try {
      setStockLoading(true);

      const endpoint =
        stockModal.type === "IN"
          ? "/stock/in"
          : "/stock/out";

      const response = await API.post(endpoint, {
        productId: product._id,
        quantity: qty,
        note: note.trim(),
      });

      const updatedProduct = response.data.product;

      setProducts((prevProducts) =>
        prevProducts.map((item) =>
          item._id === product._id
            ? updatedProduct
            : item
        )
      );

      alert(
        stockModal.type === "IN"
          ? "Stock added successfully!"
          : "Stock removed successfully!"
      );

      closeStockModal();
    } catch (error) {
      console.error("STOCK TRANSACTION ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update stock"
      );
    } finally {
      setStockLoading(false);
    }
  };

  // =====================================
  // FILTER PRODUCTS
  // =====================================

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchText = search.toLowerCase().trim();

      const name = String(product.name || "").toLowerCase();
      const brand = String(product.brand || "").toLowerCase();
      const category = String(
        product.category || ""
      ).toLowerCase();
      const packaging = getPackaging(product).toLowerCase();
      const size = getSize(product).toLowerCase();

      const matchesSearch =
        !searchText ||
        name.includes(searchText) ||
        brand.includes(searchText) ||
        category.includes(searchText) ||
        packaging.includes(searchText) ||
        size.includes(searchText);

      const status = getStockStatus(product);

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "in-stock" &&
          status.className === "in-stock") ||
        (filterStatus === "low-stock" &&
          status.className === "low-stock") ||
        (filterStatus === "out-stock" &&
          status.className === "out-stock");

      return matchesSearch && matchesStatus;
    });
  }, [products, search, filterStatus]);

  // =====================================
  // SUMMARY
  // =====================================

  const totalProducts = products.length;

  const inStockProducts = products.filter(
    (product) =>
      getStockStatus(product).className === "in-stock"
  ).length;

  const lowStockProducts = products.filter(
    (product) =>
      getStockStatus(product).className === "low-stock"
  ).length;

  const outOfStockProducts = products.filter(
    (product) =>
      getStockStatus(product).className === "out-stock"
  ).length;

  // =====================================
  // UI
  // =====================================

  return (
    <div className="products-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="products-header">
        <div className="products-title">
          <span className="page-label">
            INVENTORY MANAGEMENT
          </span>

          <h1>Products & Stock</h1>

          <p>
            Manage Coca-Cola products, packaging, sizes
            and warehouse stock.
          </p>
        </div>

        <Link
          to="/add-product"
          className="add-product-btn"
        >
          <span>+</span>
          Add Product
        </Link>
      </div>

      {/* =====================================
          SUMMARY
      ===================================== */}

      <div className="stock-summary">

        <div className="summary-card">
          <div className="summary-icon products-icon">
            📦
          </div>

          <div className="summary-content">
            <p>Total Products</p>
            <h2>{totalProducts}</h2>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon success-icon">
            ✓
          </div>

          <div className="summary-content">
            <p>In Stock</p>
            <h2>{inStockProducts}</h2>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon warning-icon">
            !
          </div>

          <div className="summary-content">
            <p>Low Stock</p>
            <h2>{lowStockProducts}</h2>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon danger-icon">
            ×
          </div>

          <div className="summary-content">
            <p>Out of Stock</p>
            <h2>{outOfStockProducts}</h2>
          </div>
        </div>

      </div>

      {/* =====================================
          PRODUCTS CARD
      ===================================== */}

      <div className="products-card">

        <div className="table-header">
          <div>
            <h2>Warehouse Stock</h2>

            <p>
              {filteredProducts.length} product
              {filteredProducts.length !== 1
                ? "s"
                : ""}{" "}
              displayed
            </p>
          </div>

          <button
            type="button"
            className="refresh-btn"
            onClick={fetchProducts}
            disabled={loading}
          >
            ↻ Refresh
          </button>
        </div>

        {/* =====================================
            SEARCH + FILTER
        ===================================== */}

        <div className="products-toolbar">

          <div className="search-box">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search product, brand, packaging..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <div className="filter-box">
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value)
              }
            >
              <option value="all">
                All Status
              </option>

              <option value="in-stock">
                In Stock
              </option>

              <option value="low-stock">
                Low Stock
              </option>

              <option value="out-stock">
                Out of Stock
              </option>
            </select>
          </div>

        </div>

        {/* =====================================
            LOADING
        ===================================== */}

        {loading ? (

          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading products...</p>
          </div>

        ) : products.length === 0 ? (

          /* =====================================
             NO PRODUCTS
          ===================================== */

          <div className="empty-state">

            <div className="empty-icon">
              📦
            </div>

            <h3>No Products Yet</h3>

            <p>
              Add your first Coca-Cola product to
              start managing warehouse stock.
            </p>

            <Link
              to="/add-product"
              className="add-product-btn"
            >
              <span>+</span>
              Add Product
            </Link>

          </div>

        ) : filteredProducts.length === 0 ? (

          /* =====================================
             NO SEARCH RESULTS
          ===================================== */

          <div className="empty-state">

            <div className="empty-icon">
              🔍
            </div>

            <h3>No Products Found</h3>

            <p>
              Try changing your search or stock
              status filter.
            </p>

            <button
              type="button"
              className="clear-filter-btn"
              onClick={() => {
                setSearch("");
                setFilterStatus("all");
              }}
            >
              Clear Filters
            </button>

          </div>

        ) : (

          /* =====================================
             TABLE
          ===================================== */

          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>PRODUCT</th>
                  <th>PACKAGING</th>
                  <th>SIZE</th>
                  <th>UNIT</th>
                  <th>OPENING</th>
                  <th>CURRENT</th>
                  <th>MINIMUM</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>

                {filteredProducts.map((product) => {

                  const status =
                    getStockStatus(product);

                  const packagingClass =
                    getPackaging(product)
                      .toLowerCase()
                      .replace(/\s+/g, "-");

                  return (

                    <tr key={product._id}>

                      {/* PRODUCT */}

                      <td>
                        <div className="product-name">

                          <div
                            className={`product-icon ${packagingClass}`}
                          >
                            {getProductIcon(product)}
                          </div>

                          <div className="product-info">

                            <strong>
                              {product.name ||
                                "Unnamed Product"}
                            </strong>

                            {product.brand && (
                              <span>
                                {product.brand}
                              </span>
                            )}

                          </div>

                        </div>
                      </td>

                      {/* PACKAGING */}

                      <td>
                        <span className="packaging-badge">
                          {getPackaging(product)}
                        </span>
                      </td>

                      {/* SIZE */}

                      <td>
                        <strong className="size-value">
                          {getSize(product)}
                        </strong>
                      </td>

                      {/* UNIT */}

                      <td>
                        <span className="unit-value">
                          {product.unit || "case"}
                        </span>
                      </td>

                      {/* OPENING */}

                      <td>
                        {Number(
                          product.openingStock
                        ) || 0}
                      </td>

                      {/* CURRENT */}

                      <td>
                        <strong className="current-stock">
                          {Number(
                            product.currentStock
                          ) || 0}
                        </strong>
                      </td>

                      {/* MINIMUM */}

                      <td>
                        {Number(
                          product.minimumStock
                        ) || 0}
                      </td>

                      {/* STATUS */}

                      <td>
                        <span
                          className={`status ${status.className}`}
                        >
                          <span className="status-dot"></span>
                          {status.text}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td>

                        <div className="product-actions">

                          <button
                            type="button"
                            className="stock-in-btn"
                            onClick={() =>
                              openStockModal(
                                product,
                                "IN"
                              )
                            }
                          >
                            + Stock In
                          </button>

                          <button
                            type="button"
                            className="stock-out-btn"
                            onClick={() =>
                              openStockModal(
                                product,
                                "OUT"
                              )
                            }
                          >
                            − Stock Out
                          </button>

                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() =>
                              handleDelete(product)
                            }
                          >
                            🗑️ Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  );
                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* =====================================
          STOCK MODAL
      ===================================== */}

      {stockModal.open && stockModal.product && (

        <div
          className="stock-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeStockModal();
            }
          }}
        >

          <div className="stock-modal">

            <div className="stock-modal-header">

              <div>

                <span
                  className={
                    stockModal.type === "IN"
                      ? "stock-modal-label stock-in-label"
                      : "stock-modal-label stock-out-label"
                  }
                >
                  {stockModal.type === "IN"
                    ? "STOCK IN"
                    : "STOCK OUT"}
                </span>

                <h2>
                  {stockModal.type === "IN"
                    ? "Add Stock"
                    : "Remove Stock"}
                </h2>

              </div>

              <button
                type="button"
                className="modal-close-btn"
                onClick={closeStockModal}
                disabled={stockLoading}
              >
                ×
              </button>

            </div>

            {/* PRODUCT INFO */}

            <div className="stock-product-info">

              <div className="stock-product-icon">
                {getProductIcon(
                  stockModal.product
                )}
              </div>

              <div>

                <strong>
                  {stockModal.product.name}
                </strong>

                <span>
                  {stockModal.product.brand}
                </span>

              </div>

            </div>

            {/* CURRENT STOCK */}

            <div className="current-stock-box">

              <span>Current Stock</span>

              <strong>
                {Number(
                  stockModal.product.currentStock
                ) || 0}
              </strong>

              <small>
                {stockModal.product.unit ||
                  "case"}
              </small>

            </div>

            {/* FORM */}

            <form onSubmit={handleStockSubmit}>

              <div className="form-group">

                <label htmlFor="stockQuantity">
                  Quantity
                </label>

                <input
                  id="stockQuantity"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(e.target.value)
                  }
                  disabled={stockLoading}
                  autoFocus
                />

              </div>

              <div className="form-group">

                <label htmlFor="stockNote">
                  Note
                  <span> (optional)</span>
                </label>

                <textarea
                  id="stockNote"
                  rows="3"
                  placeholder={
                    stockModal.type === "IN"
                      ? "Example: Received from supplier"
                      : "Example: Delivered to customer"
                  }
                  value={note}
                  onChange={(e) =>
                    setNote(e.target.value)
                  }
                  disabled={stockLoading}
                />

              </div>

              {/* PREVIEW */}

              {quantity &&
                Number(quantity) > 0 && (

                  <div className="stock-preview">

                    <span>
                      New Stock
                    </span>

                    <strong>
                      {stockModal.type === "IN"
                        ? (
                            Number(
                              stockModal.product
                                .currentStock
                            ) +
                            Number(quantity)
                          )
                        : (
                            Number(
                              stockModal.product
                                .currentStock
                            ) -
                            Number(quantity)
                          )}
                    </strong>

                  </div>

                )}

              {/* BUTTONS */}

              <div className="stock-modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeStockModal}
                  disabled={stockLoading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={
                    stockModal.type === "IN"
                      ? "confirm-stock-in-btn"
                      : "confirm-stock-out-btn"
                  }
                  disabled={stockLoading}
                >
                  {stockLoading
                    ? "Processing..."
                    : stockModal.type === "IN"
                    ? "+ Add Stock"
                    : "− Remove Stock"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Products;