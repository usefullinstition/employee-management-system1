import { useNavigate } from "react-router-dom";
import {
  FaMoon,
  FaSun,
  FaBars,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

function Navbar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully");

    navigate("/login");
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <nav
      className={`navbar shadow-sm px-3 d-flex justify-content-between align-items-center ${
        darkMode
          ? "navbar-dark bg-dark"
          : "navbar-light bg-white"
      }`}
    >
      <div className="d-flex align-items-center">

        <button
          className="btn btn-outline-secondary d-md-none me-3"
          onClick={() =>
            setSidebarOpen(!sidebarOpen)
          }
        >
          <FaBars />
        </button>

        <h5 className="mb-0">
          Employee Management System
        </h5>

      </div>

      <div className="d-flex align-items-center">

        <button
          className="btn btn-outline-secondary me-3"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        <div className="me-3 d-none d-md-block">
          <strong>{user?.name}</strong>
          <br />
          <small>{user?.role}</small>
        </div>

        <button
          className="btn btn-danger btn-sm"
          onClick={logout}
        >
          Logout
        </button>

      </div>
    </nav>
  );
}

export default Navbar;