import { useEffect, useState } from "react";
import API from "../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  useEffect(() => {
    fetchEmployees();
  }, []);

  // =====================================
  // FETCH EMPLOYEES
  // =====================================

  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const res = await API.get("/employees");

      setEmployees(res.data);
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Failed to load employees"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // SOFT DELETE EMPLOYEE
  // =====================================

  const deleteEmployee = async (id) => {
    const employee = employees.find(
      (emp) => emp._id === id
    );

    if (!employee) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to deactivate ${employee.name}?\n\n` +
        "The employee will not be permanently deleted. " +
        "Payroll history and records will remain محفوظ."
    );

    if (!confirmDelete) return;

    try {
      const res = await API.delete(
        `/employees/${id}`
      );

      setEmployees((prev) =>
        prev.map((emp) =>
          emp._id === id
            ? {
                ...emp,
                status: "Inactive",
              }
            : emp
        )
      );

      toast.success(
        res.data?.message ||
          "Employee deactivated successfully"
      );
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Failed to deactivate employee"
      );
    }
  };

  // =====================================
  // RESTORE EMPLOYEE
  // =====================================

  const restoreEmployee = async (id) => {
    const employee = employees.find(
      (emp) => emp._id === id
    );

    if (!employee) return;

    const confirmRestore = window.confirm(
      `Restore ${employee.name} and make the employee Active again?`
    );

    if (!confirmRestore) return;

    try {
      const res = await API.put(
        `/employees/${id}/restore`
      );

      setEmployees((prev) =>
        prev.map((emp) =>
          emp._id === id
            ? {
                ...emp,
                status: "Active",
              }
            : emp
        )
      );

      toast.success(
        res.data?.message ||
          "Employee restored successfully"
      );
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Failed to restore employee"
      );
    }
  };

  // =====================================
  // SEARCH
  // =====================================

  const filteredEmployees = employees.filter(
    (emp) => {
      const searchText =
        search.toLowerCase().trim();

      return (
        emp.name
          ?.toLowerCase()
          .includes(searchText) ||
        emp.email
          ?.toLowerCase()
          .includes(searchText) ||
        emp.department
          ?.toLowerCase()
          .includes(searchText) ||
        emp.position
          ?.toLowerCase()
          .includes(searchText)
      );
    }
  );

  // =====================================
  // PDF
  // =====================================

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.text(
      "Employee Payroll Report",
      14,
      20
    );

    autoTable(doc, {
      startY: 30,

      head: [
        [
          "Name",
          "Department",
          "Position",
          "Gross",
          "Tax",
          "Pension",
          "Advance",
          "Other",
          "Net",
          "Status",
        ],
      ],

      body: filteredEmployees.map((emp) => [
        emp.name,
        emp.department,
        emp.position,
        `${Number(emp.salary || 0).toLocaleString()} ETB`,
        `${Number(emp.tax || 0).toLocaleString()} ETB`,
        `${Number(emp.pension || 0).toLocaleString()} ETB`,
        `${Number(
          emp.salaryAdvance || 0
        ).toLocaleString()} ETB`,
        `${Number(
          emp.otherDeduction || 0
        ).toLocaleString()} ETB`,
        `${Number(
          emp.netSalary || 0
        ).toLocaleString()} ETB`,
        emp.status || "Active",
      ]),
    });

    doc.save("employees-payroll.pdf");
  };

  // =====================================
  // EXCEL
  // =====================================

  const downloadExcel = () => {
    const data = filteredEmployees.map(
      (emp) => ({
        Name: emp.name,
        Email: emp.email,
        Department: emp.department,
        Position: emp.position,
        "Gross Salary": emp.salary || 0,
        Tax: emp.tax || 0,
        Pension: emp.pension || 0,
        "Salary Advance":
          emp.salaryAdvance || 0,
        "Other Deduction":
          emp.otherDeduction || 0,
        "Net Salary":
          emp.netSalary || 0,
        Status: emp.status || "Active",
      })
    );

    const worksheet =
      XLSX.utils.json_to_sheet(data);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Employees"
    );

    const excelBuffer = XLSX.write(
      workbook,
      {
        bookType: "xlsx",
        type: "array",
      }
    );

    const fileData = new Blob([
      excelBuffer,
    ]);

    saveAs(
      fileData,
      "Employees-Payroll.xlsx"
    );
  };

  // =====================================
  // PRINT
  // =====================================

  const printEmployees = () => {
    window.print();
  };

  // =====================================
  // UI
  // =====================================

  return (
    <div className="container mt-4">

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">

        <div>
          <h2 className="mb-1">
            Employees
          </h2>

          <small className="text-muted">
            Manage employees and payroll
          </small>
        </div>

        <div className="d-flex gap-2 flex-wrap">

          <input
            type="text"
            className="form-control"
            placeholder="Search employee..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={{
              maxWidth: "250px",
            }}
          />

          <button
            onClick={fetchEmployees}
            className="btn btn-outline-primary"
          >
            ↻ Refresh
          </button>

          <button
            onClick={downloadPDF}
            className="btn btn-danger"
          >
            PDF
          </button>

          <button
            onClick={downloadExcel}
            className="btn btn-success"
          >
            Excel
          </button>

          <button
            onClick={printEmployees}
            className="btn btn-secondary"
          >
            Print
          </button>

          {user?.role === "Admin" && (
            <Link
              to="/add-employee"
              className="btn btn-primary"
            >
              + Add Employee
            </Link>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center p-5">
          Loading employees...
        </div>
      ) : (
        <div className="card shadow-sm">

          <div className="card-body p-0">

            <div className="table-responsive">

              <table className="table table-bordered table-hover mb-0">

                <thead className="table-dark">

                  <tr>
                    <th>#</th>
                    <th>Photo</th>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Position</th>
                    <th>Gross Salary</th>
                    <th>Advance</th>
                    <th>Net Salary</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>

                </thead>

                <tbody>

                  {filteredEmployees.length === 0 ? (

                    <tr>
                      <td
                        colSpan="10"
                        className="text-center p-4"
                      >
                        No employees found.
                      </td>
                    </tr>

                  ) : (

                    filteredEmployees.map(
                      (emp, index) => (

                        <tr key={emp._id}>

                          <td>
                            {index + 1}
                          </td>

                          <td>

                            <img
                              src={
                                emp.photo ||
                                "/default.png"
                              }
                              alt={emp.name}
                              width="50"
                              height="50"
                              style={{
                                borderRadius:
                                  "50%",
                                objectFit:
                                  "cover",
                              }}
                            />

                          </td>

                          <td>

                            <strong>
                              {emp.name}
                            </strong>

                            <br />

                            <small className="text-muted">
                              {emp.email}
                            </small>

                          </td>

                          <td>
                            {emp.department}
                          </td>

                          <td>
                            {emp.position}
                          </td>

                          <td>
                            {Number(
                              emp.salary || 0
                            ).toLocaleString()}{" "}
                            ETB
                          </td>

                          <td>
                            {Number(
                              emp.salaryAdvance ||
                                0
                            ).toLocaleString()}{" "}
                            ETB
                          </td>

                          <td className="fw-bold text-success">

                            {Number(
                              emp.netSalary || 0
                            ).toLocaleString(
                              undefined,
                              {
                                maximumFractionDigits: 2,
                              }
                            )}{" "}
                            ETB

                          </td>

                          <td>

                            <span
                              className={`badge ${
                                emp.status ===
                                "Active"
                                  ? "bg-success"
                                  : emp.status ===
                                    "On Leave"
                                  ? "bg-warning text-dark"
                                  : "bg-secondary"
                              }`}
                            >
                              {emp.status ||
                                "Active"}
                            </span>

                          </td>

                          <td>

                            {user?.role ===
                              "Admin" && (

                              <div className="d-flex gap-1 flex-wrap">

                                <Link
                                  to={`/edit-employee/${emp._id}`}
                                  className="btn btn-warning btn-sm"
                                >
                                  Edit
                                </Link>

                                {emp.status ===
                                "Active" ? (

                                  <button
                                    type="button"
                                    onClick={() =>
                                      deleteEmployee(
                                        emp._id
                                      )
                                    }
                                    className="btn btn-danger btn-sm"
                                  >
                                    Delete
                                  </button>

                                ) : (

                                  <button
                                    type="button"
                                    onClick={() =>
                                      restoreEmployee(
                                        emp._id
                                      )
                                    }
                                    className="btn btn-success btn-sm"
                                  >
                                    Restore
                                  </button>

                                )}

                              </div>

                            )}

                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Employees;