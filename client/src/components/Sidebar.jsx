import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>EMS</h2>

      <Link to="/">Dashboard</Link>

      <Link to="/employees">Employees</Link>

      <Link to="/add-employee">Add Employee</Link>
    </div>
  );
}

export default Sidebar;