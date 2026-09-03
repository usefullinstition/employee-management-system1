const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/DB");

const employeeRoutes = require("./routes/employeeRoutes");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const stockRoutes = require("./routes/stockRoutes");
const dailyStockRoutes = require("./routes/dailyStockRoutes");
const salaryAdvanceRoutes = require("./routes/salaryAdvanceRoutes");
const payrollRoutes = require("./routes/payrollRoutes");

dotenv.config();

connectDB();

const app = express();

// =========================
// MIDDLEWARE
// =========================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://employee-management-system1-theta.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// =========================
// ROUTES
// =========================

app.use("/api/auth", authRoutes);

app.use("/api/employees", employeeRoutes);

app.use("/api/products", productRoutes);

app.use("/api/stock", stockRoutes);

app.use("/api/daily-stock", dailyStockRoutes);

app.use("/api/salary-advances", salaryAdvanceRoutes);

app.use("/api/payroll", payrollRoutes);

// =========================
// ROOT
// =========================

app.get("/", (req, res) => {
  res.send("Employee Management API is running...");
});

// =========================
// SERVER
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});