import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaUserPlus,
  FaBox,
  FaPlus,
  FaHistory,
  FaChartBar,
  FaLock,
  FaChevronDown,
  FaSignOutAlt,
  FaExchangeAlt,
} from "react-icons/fa";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const [openSection, setOpenSection] = useState("main");

  const toggleSection = (section) => {
    setOpenSection((prev) =>
      prev === section ? null : section
    );
  };

  const closeSidebar = () => {
    if (setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <aside className={`sidebar ${sidebarOpen ? "show" : ""}`}>

      {/* ============================= */}
      {/* LOGO */}
      {/* ============================= */}

      <div className="sidebar-logo">
        <div className="logo-mark">C</div>

        <div>
          <h2>Coca-Cola</h2>
          <span>Employee System</span>
        </div>
      </div>


      {/* ============================= */}
      {/* MAIN MENU */}
      {/* ============================= */}

      <div className="sidebar-section">

        <button
          className="section-title"
          onClick={() => toggleSection("main")}
        >
          <span>MAIN MENU</span>

          <FaChevronDown
            className={
              openSection === "main"
                ? "rotate"
                : ""
            }
          />
        </button>


        {openSection === "main" && (
          <div className="section-items">

            <NavLink
              to="/"
              className="sidebar-link"
              onClick={closeSidebar}
            >
              <FaHome />
              <span>Dashboard</span>
            </NavLink>


            <NavLink
              to="/employees"
              className="sidebar-link"
              onClick={closeSidebar}
            >
              <FaUsers />
              <span>Employees</span>
            </NavLink>


            <NavLink
              to="/add-employee"
              className="sidebar-link"
              onClick={closeSidebar}
            >
              <FaUserPlus />
              <span>Add Employee</span>
            </NavLink>

          </div>
        )}
      </div>

<div className="sidebar-section">

  <button
    className="section-title"
    onClick={() =>
      toggleSection("payroll")
    }
  >
    <span>PAYROLL</span>

    <FaChevronDown
      className={
        openSection === "payroll"
          ? "rotate"
          : ""
      }
    />
  </button>

  {openSection === "payroll" && (
    <div className="section-items">

      <NavLink
        to="/salary-advance"
        className="sidebar-link"
        onClick={closeSidebar}
      >
        💵
        <span>Salary Advances</span>
      </NavLink>

      <NavLink
        to="/payroll"
        className="sidebar-link"
        onClick={closeSidebar}
      >
        💰
        <span>Payroll</span>
      </NavLink>

      <NavLink
        to="/payroll-history"
        className="sidebar-link"
        onClick={closeSidebar}
      >
        📋
        <span>Payroll History</span>
      </NavLink>

    </div>
  )}

</div>
      {/* ============================= */}
      {/* INVENTORY */}
      {/* ============================= */}

      <div className="sidebar-section">

        <button
          className="section-title"
          onClick={() =>
            toggleSection("inventory")
          }
        >
          <span>INVENTORY</span>

          <FaChevronDown
            className={
              openSection === "inventory"
                ? "rotate"
                : ""
            }
          />
        </button>


        {openSection === "inventory" && (
          <div className="section-items">

            <NavLink
              to="/products"
              className="sidebar-link"
              onClick={closeSidebar}
            >
              <FaBox />
              <span>Products</span>
            </NavLink>


            <NavLink
              to="/add-product"
              className="sidebar-link"
              onClick={closeSidebar}
            >
              <FaPlus />
              <span>Add Product</span>
            </NavLink>


            <NavLink
              to="/stock-movement"
              className="sidebar-link"
              onClick={closeSidebar}
            >
              <FaExchangeAlt />
              <span>Stock Movement</span>
            </NavLink>


            <NavLink
              to="/stock-history"
              className="sidebar-link"
              onClick={closeSidebar}
            >
              <FaHistory />
              <span>Stock History</span>
            </NavLink>


            <NavLink
              to="/daily-stock"
              className="sidebar-link"
              onClick={closeSidebar}
            >
              <FaChartBar />
              <span>Daily Stock</span>
            </NavLink>

          </div>
        )}
      </div>


      {/* ============================= */}
      {/* ACCOUNT */}
      {/* ============================= */}

      <div className="sidebar-section">

        <button
          className="section-title"
          onClick={() =>
            toggleSection("account")
          }
        >
          <span>ACCOUNT</span>

          <FaChevronDown
            className={
              openSection === "account"
                ? "rotate"
                : ""
            }
          />
        </button>


        {openSection === "account" && (
          <div className="section-items">

            <NavLink
              to="/change-password"
              className="sidebar-link"
              onClick={closeSidebar}
            >
              <FaLock />
              <span>Change Password</span>
            </NavLink>

          </div>
        )}
      </div>


      {/* ============================= */}
      {/* BOTTOM */}
      {/* ============================= */}

      <div className="sidebar-bottom">

        <button className="logout-sidebar">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;