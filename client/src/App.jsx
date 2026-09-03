import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import AddEmployee from "./pages/AddEmployee";
import EditEmployee from "./pages/EditEmployee";

import SalaryAdvance from "./pages/SalaryAdvance";
import Payroll from "./pages/Payroll";
import PayrollHistory from "./pages/PayrollHistory";
import Payslip from "./pages/Payslip";

import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import StockHistory from "./pages/StockHistory";
import DailyStock from "./pages/DailyStock";
import StockMovement from "./pages/StockMovement";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";

import ProtectedRoute from "./components/ProtectedRoute";

import "./styles/Layout.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <div
      className={`layout ${
        isAuthPage ? "auth-layout" : ""
      }`}
    >

      {/* =================================
          SIDEBAR
      ================================== */}

      {!isAuthPage && (
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      )}


      {/* =================================
          MAIN AREA
      ================================== */}

      <div className="main">

        {!isAuthPage && (
          <Navbar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        )}


        <main className="content">

          <Routes>

            {/* =========================
                PUBLIC
            ========================== */}

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />


            {/* =========================
                DASHBOARD
            ========================== */}

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />


            {/* =========================
                PROFILE
            ========================== */}

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/change-password"
              element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              }
            />


            {/* =========================
                EMPLOYEES
            ========================== */}

            <Route
              path="/employees"
              element={
                <ProtectedRoute>
                  <Employees />
                </ProtectedRoute>
              }
            />

            <Route
              path="/add-employee"
              element={
                <ProtectedRoute>
                  <AddEmployee />
                </ProtectedRoute>
              }
            />

            <Route
              path="/edit-employee/:id"
              element={
                <ProtectedRoute>
                  <EditEmployee />
                </ProtectedRoute>
              }
            />


            {/* =========================
                PAYROLL
            ========================== */}

            <Route
              path="/salary-advance"
              element={
                <ProtectedRoute>
                  <SalaryAdvance />
                </ProtectedRoute>
              }
            />

            <Route
              path="/payroll"
              element={
                <ProtectedRoute>
                  <Payroll />
                </ProtectedRoute>
              }
            />

            <Route
              path="/payroll-history"
              element={
                <ProtectedRoute>
                  <PayrollHistory />
                </ProtectedRoute>
              }
            />

            <Route
              path="/payroll/:id/payslip"
              element={
                <ProtectedRoute>
                  <Payslip />
                </ProtectedRoute>
              }
            />


            {/* =========================
                PRODUCTS
            ========================== */}

            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              }
            />

            <Route
              path="/add-product"
              element={
                <ProtectedRoute>
                  <AddProduct />
                </ProtectedRoute>
              }
            />


            {/* =========================
                STOCK
            ========================== */}

            <Route
              path="/stock-history"
              element={
                <ProtectedRoute>
                  <StockHistory />
                </ProtectedRoute>
              }
            />

            <Route
              path="/daily-stock"
              element={
                <ProtectedRoute>
                  <DailyStock />
                </ProtectedRoute>
              }
            />

            <Route
              path="/stock-movement"
              element={
                <ProtectedRoute>
                  <StockMovement />
                </ProtectedRoute>
              }
            />

          </Routes>

        </main>

      </div>

    </div>
  );
}

export default App;