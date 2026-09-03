import { useEffect, useState } from "react";

import API from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import "../styles/Dashboard.css";

function Dashboard() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employees");
      setEmployees(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const totalEmployees = employees.length;

  const totalSalary = employees.reduce(
    (sum, emp) => sum + Number(emp.salary),
    0
  );

  const averageSalary =
    totalEmployees > 0
      ? (totalSalary / totalEmployees).toFixed(2)
      : 0;

 
  const itEmployees = employees.filter(
  (emp) => emp.department?.toLowerCase() === "it"
).length;

const hrEmployees = employees.filter(
  (emp) => emp.department?.toLowerCase() === "hr"
).length;

const financeEmployees = employees.filter(
  (emp) => emp.department?.toLowerCase() === "finance"
).length;

const marketingEmployees = employees.filter(
  (emp) => emp.department?.toLowerCase() === "marketing"
).length;
const chartData = [
  { department: "IT", employees: itEmployees },
  { department: "HR", employees: hrEmployees },
  { department: "Finance", employees: financeEmployees },
  { department: "Marketing", employees: marketingEmployees },
];
  
console.log(chartData);
const COLORS = [
  "#0d6efd",
  "#198754",
  "#ffc107",
  "#dc3545",
];

  return (
    <div className="container mt-4">
  <div className="dashboard-hero-content">
    <div>
      <div className="dashboard-brand">
        Coca-Cola
      </div>

      <h2>
        Employee Management System
      </h2>

      <p>
        Welcome back 👋 Manage employees, payroll
        and inventory from one place.
      </p>
    </div>

    <div className="dashboard-logo-watermark">
      C
    </div>
  </div>
      <h2 className="mb-4">Dashboard</h2>

      <div className="row">

        <div className="col-md-4 mb-3">
          <div className="card dashboard-card blue">
            <div className="card-body">
              <h5>Total Employees</h5>
              <h2>{totalEmployees}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card dashboard-card green">
            <div className="card-body">
              <h5>Total Salary</h5>
              <h2>${totalSalary}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card dashboard-card orange">
            <div className="card-body">
              <h5>Average Salary</h5>
              <h2>${averageSalary}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card dashboard-card info">
            <div className="card-body">
              <h5>IT</h5>
              <h2>{itEmployees}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card dashboard-card purple">
            <div className="card-body">
              <h5>HR</h5>
              <h2>{hrEmployees}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card dashboard-card dark">
            <div className="card-body">
              <h5>Finance</h5>
              <h2>{financeEmployees}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card dashboard-card red">
            <div className="card-body">
              <h5>Marketing</h5>
              <h2>{marketingEmployees}</h2>
            </div>
          </div>
        </div>

      </div>

    <div className="card p-4 mt-4 shadow">
  <h4 className="mb-4">Employees by Department</h4>

  <ResponsiveContainer width="100%" height={350}>
    <BarChart data={chartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="department" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="employees" fill="#0d6efd" />
    </BarChart>
  </ResponsiveContainer>
</div>
<div className="card p-4 mt-4 shadow">
  <h4 className="mb-4">Department Distribution</h4>

  <ResponsiveContainer width="100%" height={350}>
    <PieChart>
      <Pie
        data={chartData}
        dataKey="employees"
        nameKey="department"
        cx="50%"
        cy="50%"
        outerRadius={120}
        label
      >
        {chartData.map((entry, index) => (
          <Cell
            key={index}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>

      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
</div>

    </div>
  );
}

export default Dashboard;