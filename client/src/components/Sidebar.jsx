
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
  FaMoneyBillWave,
  FaFileInvoiceDollar,
} from "react-icons/fa";

import "./Sidebar.css";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  // =====================================
  // EACH SECTION HAS ITS OWN STATE
  // =====================================

  const [openSections, setOpenSections] = useState({
    main: true,
    payroll: true,
    inventory: true,
    account: true,
  });

  // =====================================
  // TOGGLE SECTION
  // =====================================

  const [openSection, setOpenSection] = useState({
  main: true,
  payroll: true,
  inventory: true,
  account: true,
});

const toggleSection = (section) => {
  setOpenSection((prev) => ({
    ...prev,
    [section]: !prev[section],
  }));
};

  // =====================================
  // CLOSE MOBILE SIDEBAR
  // =====================================

  const closeSidebar = () => {
    if (setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  // =====================================
  // ACTIVE LINK
  // =====================================

  const linkClass = ({ isActive }) =>
    `sidebar-link ${isActive ? "active" : ""}`;

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    closeSidebar();

    window.location.href = "/login";
  };

  return (
    <aside
      className={`sidebar ${
        sidebarOpen ? "show" : ""
      }`}
    >

      {/* =====================================
          LOGO
      ===================================== */}

      <div className="sidebar-logo">

        <div className="logo-mark">
          C
        </div>

        <div className="logo-text">
          <h2>Coca-Cola</h2>
          <span>Employee System</span>
        </div>

      </div>


      {/* =====================================
          MENU
      ===================================== */}

      <div className="sidebar-menu">


        {/* =====================================
            MAIN MENU
        ===================================== */}

        <div className="sidebar-section">

          <button
            type="button"
            className="section-title"
            onClick={() =>
              toggleSection("main")
            }
          >

            <span>MAIN MENU</span>

            <FaChevronDown
              className={
                openSections.main
                  ? "chevron rotate"
                  : "chevron"
              }
            />

          </button>


          <div
            className={`section-items ${
              openSections.main
                ? "open"
                : ""
            }`}
          >

            <NavLink
              to="/"
              end
              className={linkClass}
              onClick={closeSidebar}
            >
              <FaHome />
              <span>Dashboard</span>
            </NavLink>


            <NavLink
              to="/employees"
              className={linkClass}
              onClick={closeSidebar}
            >
              <FaUsers />
              <span>Employees</span>
            </NavLink>


            <NavLink
              to="/add-employee"
              className={linkClass}
              onClick={closeSidebar}
            >
              <FaUserPlus />
              <span>Add Employee</span>
            </NavLink>

          </div>

        </div>


        {/* =====================================
            PAYROLL
        ===================================== */}

        <div className="sidebar-section">

          <button
            type="button"
            className="section-title"
            onClick={() =>
              toggleSection("payroll")
            }
          >

            <span>PAYROLL</span>

            <FaChevronDown
              className={
                openSections.payroll
                  ? "chevron rotate"
                  : "chevron"
              }
            />

          </button>


          <div
            className={`section-items ${
              openSections.payroll
                ? "open"
                : ""
            }`}
          >

            <NavLink
              to="/salary-advance"
              className={linkClass}
              onClick={closeSidebar}
            >
              <FaMoneyBillWave />
              <span>Salary Advances</span>
            </NavLink>


            <NavLink
              to="/payroll"
              className={linkClass}
              onClick={closeSidebar}
            >
              <FaFileInvoiceDollar />
              <span>Payroll</span>
            </NavLink>


            <NavLink
              to="/payroll-history"
              className={linkClass}
              onClick={closeSidebar}
            >
              <FaHistory />
              <span>Payroll History</span>
            </NavLink>

          </div>

        </div>


        {/* =====================================
            INVENTORY
        ===================================== */}

        <div className="sidebar-section">

          <button
            type="button"
            className="section-title"
            onClick={() =>
              toggleSection("inventory")
            }
          >

            <span>INVENTORY</span>

            <FaChevronDown
              className={
                openSections.inventory
                  ? "chevron rotate"
                  : "chevron"
              }
            />

          </button>


          <div
            className={`section-items ${
              openSections.inventory
                ? "open"
                : ""
            }`}
          >

            <NavLink
              to="/products"
              className={linkClass}
              onClick={closeSidebar}
            >
              <FaBox />
              <span>Products</span>
            </NavLink>


            <NavLink
              to="/add-product"
              className={linkClass}
              onClick={closeSidebar}
            >
              <FaPlus />
              <span>Add Product</span>
            </NavLink>


            <NavLink
              to="/stock-movement"
              className={linkClass}
              onClick={closeSidebar}
            >
              <FaExchangeAlt />
              <span>Stock Movement</span>
            </NavLink>


            <NavLink
              to="/stock-history"
              className={linkClass}
              onClick={closeSidebar}
            >
              <FaHistory />
              <span>Stock History</span>
            </NavLink>


            <NavLink
              to="/daily-stock"
              className={linkClass}
              onClick={closeSidebar}
            >
              <FaChartBar />
              <span>Daily Stock</span>
            </NavLink>

          </div>

        </div>


        {/* =====================================
            ACCOUNT
        ===================================== */}

        <div className="sidebar-section">

          <button
            type="button"
            className="section-title"
            onClick={() =>
              toggleSection("account")
            }
          >

            <span>ACCOUNT</span>

            <FaChevronDown
              className={
                openSections.account
                  ? "chevron rotate"
                  : "chevron"
              }
            />

          </button>


          <div
            className={`section-items ${
              openSections.account
                ? "open"
                : ""
            }`}
          >

            <NavLink
              to="/change-password"
              className={linkClass}
              onClick={closeSidebar}
            >
              <FaLock />
              <span>Change Password</span>
            </NavLink>

          </div>

        </div>

      </div>


      {/* =====================================
          LOGOUT
      ===================================== */}

      <div className="sidebar-bottom">

        <button
          type="button"
          className="logout-sidebar"
          onClick={handleLogout}
        >

          <FaSignOutAlt />

          <span>Logout</span>

        </button>

      </div>

    </aside>
  );
}

export default Sidebar;

