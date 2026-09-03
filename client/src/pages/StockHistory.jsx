import { useEffect, useState } from "react";
import API from "../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import "./StockHistory.css";

const StockHistory = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================
  // FETCH DAILY SUMMARY
  // =====================================

  const fetchDailySummary = async (date) => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        `/stock/daily-summary?date=${date}`
      );

      setSummary(
        Array.isArray(response.data?.summary)
          ? response.data.summary
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

  // =====================================
  // TOTALS
  // =====================================

  const totalBeginning = summary.reduce(
    (total, item) =>
      total + Number(item.beginning || 0),
    0
  );

  const totalSaleOut = summary.reduce(
    (total, item) =>
      total + Number(item.saleOut || 0),
    0
  );

  const totalSaleIn = summary.reduce(
    (total, item) =>
      total + Number(item.saleIn || 0),
    0
  );

  const totalPurchase = summary.reduce(
    (total, item) =>
      total + Number(item.purchase || 0),
    0
  );

  const totalEnding = summary.reduce(
    (total, item) =>
      total + Number(item.ending || 0),
    0
  );

  // =====================================
  // PRODUCT SIZE
  // =====================================

  const getSize = (product) => {
    if (product?.sizeMl) {
      return `${product.sizeMl} ${
        product.sizeUnit || "ml"
      }`;
    }

    return "-";
  };

  // =====================================
  // PRINT
  // =====================================

  const handlePrint = () => {
    if (summary.length === 0) {
      alert("There is no stock data to print.");
      return;
    }

    window.print();
  };

  // =====================================
  // PDF EXPORT
  // =====================================

  const handleExportPDF = () => {
    if (summary.length === 0) {
      alert("There is no stock data to export.");
      return;
    }

    const doc = new jsPDF();

    // -------------------------------------
    // TITLE
    // -------------------------------------

    doc.setFontSize(18);
    doc.text("DAILY STOCK REPORT", 14, 20);

    doc.setFontSize(11);
    doc.text(`Date: ${selectedDate}`, 14, 29);

    doc.setFontSize(9);
    doc.text(
      "Daily warehouse stock movement report",
      14,
      36
    );

    // -------------------------------------
    // TABLE
    // -------------------------------------

    const tableData = summary.map((item) => [
      item.product?.name || "Unknown Product",
      getSize(item.product),
      Number(item.beginning || 0),
      Number(item.saleOut || 0),
      Number(item.saleIn || 0),
      Number(item.purchase || 0),
      Number(item.ending || 0),
    ]);

    autoTable(doc, {
      startY: 43,

      head: [
        [
          "PRODUCT",
          "SIZE",
          "BEGINNING",
          "SALE OUT",
          "SALE IN",
          "PURCHASE",
          "ENDING",
        ],
      ],

      body: tableData,

      foot: [
        [
          "TOTAL",
          "",
          totalBeginning,
          totalSaleOut,
          totalSaleIn,
          totalPurchase,
          totalEnding,
        ],
      ],

      theme: "grid",

      styles: {
        fontSize: 8,
        cellPadding: 3,
      },

      headStyles: {
        fontStyle: "bold",
      },

      footStyles: {
        fontStyle: "bold",
      },
    });

    // -------------------------------------
    // CALCULATION
    // -------------------------------------

    const finalY =
      doc.lastAutoTable.finalY + 12;

    doc.setFontSize(10);
    doc.text(
      `Beginning ${totalBeginning} - Sale Out ${totalSaleOut} + Sale In ${totalSaleIn} + Purchase ${totalPurchase} = Ending ${totalEnding}`,
      14,
      finalY
    );

    // -------------------------------------
    // SAVE
    // -------------------------------------

    doc.save(
      `Daily-Stock-Report-${selectedDate}.pdf`
    );
  };

  // =====================================
  // EXCEL EXPORT
  // =====================================

  const handleExportExcel = () => {
    if (summary.length === 0) {
      alert("There is no stock data to export.");
      return;
    }

    // -------------------------------------
    // REPORT DATA
    // -------------------------------------

    const rows = summary.map((item) => ({
      Product:
        item.product?.name ||
        "Unknown Product",

      Brand:
        item.product?.brand ||
        "",

      Size: getSize(item.product),

      Beginning: Number(
        item.beginning || 0
      ),

      "Sale Out": Number(
        item.saleOut || 0
      ),

      "Sale In": Number(
        item.saleIn || 0
      ),

      Purchase: Number(
        item.purchase || 0
      ),

      Ending: Number(
        item.ending || 0
      ),
    }));

    // -------------------------------------
    // TOTAL ROW
    // -------------------------------------

    rows.push({
      Product: "TOTAL",
      Brand: "",
      Size: "",
      Beginning: totalBeginning,
      "Sale Out": totalSaleOut,
      "Sale In": totalSaleIn,
      Purchase: totalPurchase,
      Ending: totalEnding,
    });

    // -------------------------------------
    // CREATE WORKSHEET
    // -------------------------------------

    const worksheet =
      XLSX.utils.json_to_sheet(rows);

    // -------------------------------------
    // COLUMN WIDTH
    // -------------------------------------

    worksheet["!cols"] = [
      { wch: 25 },
      { wch: 18 },
      { wch: 12 },
      { wch: 14 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
    ];

    // -------------------------------------
    // CREATE WORKBOOK
    // -------------------------------------

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Daily Stock"
    );

    // -------------------------------------
    // ADD DATE
    // -------------------------------------

    worksheet["J1"] = {
      v: "Report Date",
    };

    worksheet["J2"] = {
      v: selectedDate,
    };

    // -------------------------------------
    // DOWNLOAD
    // -------------------------------------

    XLSX.writeFile(
      workbook,
      `Daily-Stock-Report-${selectedDate}.xlsx`
    );
  };

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
            Track beginning stock, sales,
            purchases and ending stock for each day.
          </p>
        </div>

        <div className="date-selector">

          <label>
            Select Date
          </label>

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
          SUMMARY CARDS
      ===================================== */}

      <div className="daily-summary-cards">

        <div className="daily-card">
          <span>Beginning</span>
          <strong>
            {totalBeginning}
          </strong>
        </div>

        <div className="daily-card sale-out-card">
          <span>Sale Out</span>
          <strong>
            {totalSaleOut}
          </strong>
        </div>

        <div className="daily-card sale-in-card">
          <span>Sale In</span>
          <strong>
            {totalSaleIn}
          </strong>
        </div>

        <div className="daily-card purchase-card">
          <span>Purchase</span>
          <strong>
            {totalPurchase}
          </strong>
        </div>

        <div className="daily-card ending-card">
          <span>Ending</span>
          <strong>
            {totalEnding}
          </strong>
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
          DAILY REPORT
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

          {/* =================================
              REPORT BUTTONS
          ================================= */}

          <div className="report-actions">

            <button
              type="button"
              onClick={handlePrint}
              disabled={
                loading ||
                summary.length === 0
              }
              className="print-btn"
            >
              🖨 Print
            </button>

            <button
              type="button"
              onClick={handleExportPDF}
              disabled={
                loading ||
                summary.length === 0
              }
              className="pdf-btn"
            >
              📄 PDF
            </button>

            <button
              type="button"
              onClick={handleExportExcel}
              disabled={
                loading ||
                summary.length === 0
              }
              className="excel-btn"
            >
              📊 Excel
            </button>

            <button
              type="button"
              onClick={() =>
                fetchDailySummary(
                  selectedDate
                )
              }
              disabled={loading}
              className="refresh-btn"
            >
              {loading
                ? "Loading..."
                : "↻ Refresh"}
            </button>

          </div>

        </div>

        {/* =====================================
            TABLE
        ===================================== */}

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

              {summary.map((item, index) => (

                <tr
                  key={
                    item.product?._id ||
                    index
                  }
                >

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
                    {getSize(item.product)}
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
                  <strong>
                    TOTAL
                  </strong>
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

        <h3>
          Daily Stock Calculation
        </h3>

        <div className="calculation-line">

          <span>Beginning</span>

          <strong>
            {totalBeginning}
          </strong>

          <span>−</span>

          <span>Sale Out</span>

          <strong>
            {totalSaleOut}
          </strong>

          <span>+</span>

          <span>Sale In</span>

          <strong>
            {totalSaleIn}
          </strong>

          <span>+</span>

          <span>Purchase</span>

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