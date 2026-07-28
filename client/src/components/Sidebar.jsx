import { Link } from "react-router-dom";

function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  return (
    <div className="sidebar">
      <h2>EMS</h2>

      <Link to="/">Dashboard</Link>

      <Link to="/employees">Employees</Link>

    <Link to="/add-employee">
  Add Employee
</Link>

      {/* <Link
        to="/profile"
        className="nav-link"
      >
        Profile
      </Link> */}

      <Link
        to="/change-password"
        className="nav-link"
      >
        Change Password
      </Link>
    </div>
  );
}

export default Sidebar;