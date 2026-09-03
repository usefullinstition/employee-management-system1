
import { useEffect, useState } from "react";
import API from "../services/api";
import "./DailyStock.css";

const DailyStock = () => {
  const [summary, setSummary] = useState([]);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================
  // FETCH DAILY STOCK
  // =====================================

  const fetchDailyStock = async (selectedDate = "") => {
    try {
      setLoading(true);
      setError("");

      const url = selectedDate
        ? `/stock/daily-summary?date=${selectedDate}`
        : "/stock/daily-summary";

      const response = await API.get(url);

      console.log("=================================");
      console.log("DAILY STOCK FULL RESPONSE:");
      console.log(response.data);
      console.log("=================================");

      const data = response.data;

      // Backend response:
      // {
      //   date: "2026-08-31",
      //   summary: [...]
      // }

      if (Array.isArray(data?.summary)) {
        setSummary(data.summary);
      } else if (Array.isArray(data)) {
        setSummary(data);
      } else {
        setSummary([]);
      }

      if (data?.date) {
        setDate(data.date);
      }
    } catch (err) {
      console.error(
        "DAILY STOCK ERROR:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load daily stock"
      );

      setSummary([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // LOAD ON PAGE OPEN
  // =====================================

  useEffect(() => {
    fetchDailyStock();
  }, []);

  // =====================================
  // DATE CHANGE
  // =====================================

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;

    setDate(selectedDate);

    if (selectedDate) {
      fetchDailyStock(selectedDate);
    } else {
      fetchDailyStock();
    }
  };

  // =====================================
  // CALCULATE ENDING
  // =====================================

  const calculateEnding = (item) => {
    const beginning = Number(item.beginning) || 0;
    const saleOut = Number(item.saleOut) || 0;
    const saleIn = Number(item.saleIn) || 0;
    const purchase = Number(item.purchase) || 0;

    return (
      beginning -
      saleOut +
      saleIn +
      purchase
    );
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="daily-stock-page">
        <div className="daily-loading">
          Loading daily stock...
        </div>
      </div>
    );
  }

  // =====================================
  // ERROR
  // =====================================

  if (error) {
    return (
      <div className="daily-stock-page">
        <div className="daily-error">
          <p>{error}</p>

          <button
            type="button"
            className="refresh-btn"
            onClick={() => fetchDailyStock(date)}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =====================================
  // PAGE
  // =====================================

  return (
    <div className="daily-stock-page">

      {/* ================================
          HEADER
      ================================= */}

      <div className="daily-stock-header">

        <div>
          <span className="page-label">
            WAREHOUSE INVENTORY
          </span>

          <h1>Daily Stock</h1>

          <p>
            Track beginning stock, vehicle sales,
            returns, purchases and ending stock.
          </p>
        </div>

        <div className="daily-header-actions">

          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            className="date-picker"
          />

          <button
            type="button"
            className="refresh-btn"
            onClick={() => fetchDailyStock(date)}
          >
            ↻ Refresh
          </button>

        </div>
      </div>

      {/* ================================
          STOCK FLOW
      ================================= */}

      <div className="stock-flow">

        <div className="flow-item beginning-flow">
          <span>Beginning</span>
          <small>Opening stock</small>
        </div>

        <span className="flow-arrow">→</span>

        <div className="flow-item sale-out-flow">
          <span>Sale Out</span>
          <small>Morning trucks</small>
        </div>

        <span className="flow-arrow">→</span>

        <div className="flow-item sale-in-flow">
          <span>Sale In</span>
          <small>Returns / unsold</small>
        </div>

        <span className="flow-arrow">→</span>

        <div className="flow-item purchase-flow">
          <span>Purchase</span>
          <small>Main company</small>
        </div>

        <span className="flow-arrow">→</span>

        <div className="flow-item ending-flow">
          <span>Ending</span>
          <small>Closing stock</small>
        </div>

      </div>

      {/* ================================
          TABLE CARD
      ================================= */}

      <div className="daily-stock-table-card">

        <div className="table-title">

          <div>
            <h2>Daily Warehouse Movement</h2>

            <p>
              {date || "Today"} ·{" "}
              {summary.length} product
              {summary.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="stock-formula">
            Beginning − Sale Out + Sale In + Purchase = Ending
          </div>

        </div>

        <div className="daily-table-container">

          <table className="daily-stock-table">

            <thead>
              <tr>
                <th>DATE</th>
                <th>PRODUCT</th>
                <th>BEGINNING</th>
                <th>SALE OUT</th>
                <th>SALE IN</th>
                <th>PURCHASE</th>
                <th>ENDING</th>
              </tr>
            </thead>

            <tbody>

              {summary.length === 0 ? (

                <tr>
                  <td
                    colSpan="7"
                    className="no-data"
                  >
                    No stock movement found for this date.
                  </td>
                </tr>

              ) : (

                summary.map((item) => {

                  const calculatedEnding =
                    calculateEnding(item);

                  return (
                    <tr
                      key={
                        item.product?._id ||
                        item._id
                      }
                    >

                      {/* DATE */}

                      <td>
                        {item.date || date || "-"}
                      </td>

                      {/* PRODUCT */}

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

                      {/* BEGINNING */}

                      <td>
                        <strong className="beginning-value">
                          {Number(item.beginning) || 0}
                        </strong>
                      </td>

                      {/* SALE OUT */}

                      <td>
                        <strong className="sale-out-value">
                          {Number(item.saleOut) || 0}
                        </strong>
                      </td>

                      {/* SALE IN */}

                      <td>
                        <strong className="sale-in-value">
                          {Number(item.saleIn) || 0}
                        </strong>
                      </td>

                      {/* PURCHASE */}

                      <td>
                        <strong className="purchase-value">
                          {Number(item.purchase) || 0}
                        </strong>
                      </td>

                      {/* ENDING */}

                      <td>
                        <strong className="ending-value">
                          {calculatedEnding}
                        </strong>
                      </td>

                    </tr>
                  );
                })

              )}

            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
};

export default DailyStock;

