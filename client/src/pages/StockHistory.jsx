
import { useEffect, useState } from "react";
import API from "../services/API";
import "./StockHistory.css";

const StockHistory = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDailySummary = async (date) => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        `/stock/daily-summary?date=${date}`
      );

      setSummary(
        Array.isArray(response.data?.data)
          ? response.data.data
          : []
      );
    } catch (err) {
      console.error("DAILY SUMMARY ERROR:", err);

      setSummary([]);

      setError(
        err.response?.data?.message ||
          "Failed to load daily stock history"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailySummary(selectedDate);
  }, [selectedDate]);

  const totalBeginning = summary.reduce(
    (total, item) => total + Number(item.beginning || 0),
    0
  );

  const totalSaleOut = summary.reduce(
    (total, item) => total + Number(item.saleOut || 0),
    0
  );

  const totalSaleIn = summary.reduce(
    (total, item) => total + Number(item.saleIn || 0),
    0
  );

  const totalPurchase = summary.reduce(
    (total, item) => total + Number(item.purchase || 0),
    0
  );

  const totalEnding = summary.reduce(
    (total, item) => total + Number(item.ending || 0),
    0
  );

  return (
    <div className="stock-history-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="stock-history-header">
        <div>
          <span className="page-label">
            WAREHOUSE INVENTORY
          </span>

          <h1>Daily Stock History</h1>

          <p>
            Track beginning stock, sales, purchases and
            ending stock for each day.
          </p>
        </div>

        <div className="date-selector">
          <label>Select Date</label>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) =>
              setSelectedDate(e.target.value)
            }
          />
        </div>
      </div>

      {/* =====================================
          DAILY SUMMARY CARDS
      ===================================== */}

      <div className="daily-summary-cards">

        <div className="daily-card">
          <span>Beginning</span>
          <strong>{totalBeginning}</strong>
        </div>

        <div className="daily-card sale-out-card">
          <span>Sale Out</span>
          <strong>{totalSaleOut}</strong>
        </div>

        <div className="daily-card sale-in-card">
          <span>Sale In</span>
          <strong>{totalSaleIn}</strong>
        </div>

        <div className="daily-card purchase-card">
          <span>Purchase</span>
          <strong>{totalPurchase}</strong>
        </div>

        <div className="daily-card ending-card">
          <span>Ending</span>
          <strong>{totalEnding}</strong>
        </div>

      </div>

      {/* =====================================
          ERROR
      ===================================== */}

      {error && (
        <div className="stock-history-error">
          {error}
        </div>
      )}

      {/* =====================================
          DAILY TABLE
      ===================================== */}

      <div className="stock-history-table-container">

        <div className="daily-table-header">
          <div>
            <h2>
              Daily Warehouse Report
            </h2>

            <p>
              {selectedDate}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              fetchDailySummary(selectedDate)
            }
            disabled={loading}
          >
            {loading ? "Loading..." : "↻ Refresh"}
          </button>
        </div>

        {loading ? (
          <div className="stock-history-loading">
            Loading daily stock...
          </div>
        ) : summary.length === 0 ? (
          <div className="no-data">
            No stock activity found for this date.
          </div>
        ) : (
          <table className="stock-history-table">

            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>SIZE</th>
                <th>BEGINNING</th>
                <th>SALE OUT</th>
                <th>SALE IN</th>
                <th>PURCHASE</th>
                <th>ENDING</th>
              </tr>
            </thead>

            <tbody>

              {summary.map((item) => (

                <tr key={item.productId}>

                  <td>
                    <div className="daily-product">

                      <strong>
                        {item.product?.name ||
                          "Unknown Product"}
                      </strong>

                      {item.product?.brand && (
                        <span>
                          {item.product.brand}
                        </span>
                      )}

                    </div>
                  </td>

                  <td>
                    {item.product?.sizeMl
                      ? `${item.product.sizeMl} ${
                          item.product.sizeUnit || "ml"
                        }`
                      : "-"}
                  </td>

                  <td>
                    <strong>
                      {item.beginning}
                    </strong>
                  </td>

                  <td>
                    <span className="sale-out-value">
                      -{item.saleOut}
                    </span>
                  </td>

                  <td>
                    <span className="sale-in-value">
                      +{item.saleIn}
                    </span>
                  </td>

                  <td>
                    <span className="purchase-value">
                      +{item.purchase}
                    </span>
                  </td>

                  <td>
                    <strong className="ending-value">
                      {item.ending}
                    </strong>
                  </td>

                </tr>

              ))}

            </tbody>

            <tfoot>

              <tr>

                <td colSpan="2">
                  <strong>TOTAL</strong>
                </td>

                <td>
                  <strong>
                    {totalBeginning}
                  </strong>
                </td>

                <td>
                  <strong className="sale-out-value">
                    -{totalSaleOut}
                  </strong>
                </td>

                <td>
                  <strong className="sale-in-value">
                    +{totalSaleIn}
                  </strong>
                </td>

                <td>
                  <strong className="purchase-value">
                    +{totalPurchase}
                  </strong>
                </td>

                <td>
                  <strong className="ending-value">
                    {totalEnding}
                  </strong>
                </td>

              </tr>

            </tfoot>

          </table>
        )}

      </div>

      {/* =====================================
          CALCULATION
      ===================================== */}

      <div className="stock-calculation">

        <h3>Daily Stock Calculation</h3>

        <div className="calculation-line">

          <span>
            Beginning
          </span>

          <strong>
            {totalBeginning}
          </strong>

          <span>−</span>

          <span>
            Sale Out
          </span>

          <strong>
            {totalSaleOut}
          </strong>

          <span>+</span>

          <span>
            Sale In
          </span>

          <strong>
            {totalSaleIn}
          </strong>

          <span>+</span>

          <span>
            Purchase
          </span>

          <strong>
            {totalPurchase}
          </strong>

          <span>=</span>

          <strong className="ending-value">
            {totalEnding}
          </strong>

        </div>

      </div>

    </div>
  );
};

export default StockHistory;

