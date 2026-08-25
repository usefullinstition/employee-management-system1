import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import AddEmployee from "./pages/AddEmployee";

import SalaryAdvance from "./pages/SalaryAdvance";
import EditEmployee from "./pages/EditEmployee";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Payroll from "./pages/Payroll";
import PayrollHistory from "./pages/PayrollHistory";
import ChangePassword from "./pages/ChangePassword";

import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import StockHistory from "./pages/StockHistory";
import DailyStock from "./pages/DailyStock";
import StockMovement from "./pages/StockMovement";

import ProtectedRoute from "./components/ProtectedRoute";
import Payslip from "./pages/Payslip";
import "./styles/Layout.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="main">
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="content">
          <Routes>

            {/* =========================
                PUBLIC ROUTES
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
                SALARY ADVANCE
            ========================== */}

            <Route
              path="/salary-advance"
              element={
                <ProtectedRoute>
                  <SalaryAdvance />
                </ProtectedRoute>
              }
            />

        


            {/* =========================
                PAYROLL
            ========================== */}

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
<Route
  path="/payroll/:id/payslip"
  element={
    <ProtectedRoute>
      <Payslip />
    </ProtectedRoute>
  }
/>
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;