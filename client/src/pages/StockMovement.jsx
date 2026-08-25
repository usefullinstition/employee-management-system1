import { useEffect, useState } from "react";
import API from "../services/API";
import "./StockMovement.css";

const StockMovement = () => {
  const [products, setProducts] = useState([]);

  const [type, setType] = useState("PURCHASE");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================
  // GET PRODUCTS
  // =====================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);

        const response = await API.get("/products");

        setProducts(
          Array.isArray(response.data)
            ? response.data
            : response.data.products || []
        );
      } catch (err) {
        console.error("GET PRODUCTS ERROR:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load products"
        );
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // =====================================
  // SUBMIT
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!productId) {
      setError("Please select a product");
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    try {
      setSaving(true);

      let endpoint = "";

      if (type === "PURCHASE") {
        endpoint = "/stock/purchase";
      }

      if (type === "SALE_OUT") {
        endpoint = "/stock/sale-out";
      }

      if (type === "SALE_IN") {
        endpoint = "/stock/sale-in";
      }

      const response = await API.post(endpoint, {
        productId,
        quantity: Number(quantity),
        note,
      });

      setMessage(
        response.data?.message ||
          "Stock movement recorded successfully"
      );

      setQuantity("");
      setNote("");
    } catch (err) {
      console.error("STOCK MOVEMENT ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Failed to record stock movement"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // TYPE DESCRIPTION
  // =====================================

  const getDescription = () => {
    if (type === "PURCHASE") {
      return "Stock received from the main company.";
    }

    if (type === "SALE_OUT") {
      return "Products taken by vehicles in the morning.";
    }

    return "Unsold or returned products coming back from vehicles.";
  };

  return (
    <div className="stock-movement-page">

      <div className="stock-movement-header">
        <span>WAREHOUSE INVENTORY</span>

        <h1>Stock Movement</h1>

        <p>
          Record purchase, vehicle sale out and returned
          stock.
        </p>
      </div>

      <div className="movement-card">

        <div className="movement-tabs">

          <button
            type="button"
            className={
              type === "PURCHASE"
                ? "active purchase"
                : ""
            }
            onClick={() => setType("PURCHASE")}
          >
            Purchase
          </button>

          <button
            type="button"
            className={
              type === "SALE_OUT"
                ? "active sale-out"
                : ""
            }
            onClick={() => setType("SALE_OUT")}
          >
            Sale Out
          </button>

          <button
            type="button"
            className={
              type === "SALE_IN"
                ? "active sale-in"
                : ""
            }
            onClick={() => setType("SALE_IN")}
          >
            Sale In
          </button>

        </div>

        <div className="movement-description">
          {getDescription()}
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>Product</label>

            <select
              value={productId}
              onChange={(e) =>
                setProductId(e.target.value)
              }
              disabled={loadingProducts || saving}
            >
              <option value="">
                {loadingProducts
                  ? "Loading products..."
                  : "Select product"}
              </option>

              {products.map((product) => (
                <option
                  key={product._id}
                  value={product._id}
                >
                  {product.name}
                  {product.brand
                    ? ` - ${product.brand}`
                    : ""}
                </option>
              ))}
            </select>

          </div>

          <div className="form-group">

            <label>Quantity</label>

            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value)
              }
              placeholder="Enter quantity"
              disabled={saving}
            />

          </div>

          <div className="form-group">

            <label>Note</label>

            <textarea
              value={note}
              onChange={(e) =>
                setNote(e.target.value)
              }
              placeholder="Optional note"
              rows="3"
              disabled={saving}
            />

          </div>

          {error && (
            <div className="movement-error">
              {error}
            </div>
          )}

          {message && (
            <div className="movement-success">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="save-movement-btn"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : `Record ${
                  type === "PURCHASE"
                    ? "Purchase"
                    : type === "SALE_OUT"
                    ? "Sale Out"
                    : "Sale In"
                }`}
          </button>

        </form>

      </div>
    </div>
  );
};

export default StockMovement;