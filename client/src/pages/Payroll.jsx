import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

function Payroll() {
   const navigate = useNavigate();

  
  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    employeeId: "",
    month: "",
    otherDeduction: "",
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [employeesLoading, setEmployeesLoading] =
    useState(true);

  // =====================================
  // LOAD EMPLOYEES
  // =====================================

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setEmployeesLoading(true);

      const res = await API.get("/employees");

      setEmployees(res.data || []);
    } catch (error) {
      console.error(
        "FETCH EMPLOYEES ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load employees"
      );
    } finally {
      setEmployeesLoading(false);
    }
  };

  // =====================================
  // HANDLE FORM CHANGE
  // =====================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "employeeId") {
      setPreview(null);
    }
  };

  // =====================================
  // TAX CALCULATION
  // SAME AS BACKEND
  // =====================================

  const calculateTax = (salary) => {
    const amount = Number(salary) || 0;

    if (amount <= 2000) {
      return 0;
    }

    if (amount <= 4000) {
      return Math.max(
        0,
        amount * 0.15 - 300
      );
    }

    if (amount <= 7000) {
      return Math.max(
        0,
        amount * 0.2 - 500
      );
    }

    if (amount <= 10000) {
      return Math.max(
        0,
        amount * 0.25 - 850
      );
    }

    if (amount <= 14000) {
      return Math.max(
        0,
        amount * 0.3 - 1350
      );
    }

    return Math.max(
      0,
      amount * 0.35 - 2050
    );
  };

  // =====================================
  // CALCULATE PREVIEW
  // =====================================

  const calculatePreview = () => {
    const employee = employees.find(
      (item) =>
        item._id === form.employeeId
    );

    if (!employee) {
      toast.error(
        "Please select an employee"
      );
      return;
    }

    const grossSalary =
      Number(employee.salary) || 0;

    if (grossSalary <= 0) {
      toast.error(
        "Employee salary must be greater than 0"
      );
      return;
    }

    const tax =
      calculateTax(grossSalary);

    const pension =
      grossSalary * 0.07;

    const salaryAdvance =
      Number(employee.salaryAdvance) || 0;

    const otherDeduction =
      Number(form.otherDeduction) || 0;

    const netSalary = Math.max(
      0,
      grossSalary -
        tax -
        pension -
        salaryAdvance -
        otherDeduction
    );

    setPreview({
      grossSalary,
      tax,
      pension,
      salaryAdvance,
      otherDeduction,
      netSalary,
    });
  };

  // =====================================
  // CREATE PAYROLL
  // =====================================

  const createPayroll = async () => {
    if (!form.employeeId) {
      toast.error(
        "Please select an employee"
      );
      return;
    }

    if (!form.month) {
      toast.error(
        "Please select payroll month"
      );
      return;
    }

    if (!preview) {
      toast.error(
        "Please calculate payroll preview first"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await API.post(
        "/payroll",
        {
          employeeId:
            form.employeeId,

          month:
            form.month,

          otherDeduction:
            Number(
              form.otherDeduction
            ) || 0,
        }
      );

      console.log(
        "PAYROLL CREATED:",
        response.data
      );

      toast.success(
        "Payroll created successfully!"
      );

     const payrollId =
  response.data.payroll._id;

navigate(
  `/payroll/${payrollId}/payslip`
);

      setPreview(null);
    } catch (error) {
      console.error(
        "CREATE PAYROLL ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to create payroll"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // FORMAT MONEY
  // =====================================

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString(
      undefined,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  // =====================================
  // RENDER
  // =====================================

  return (
    <div
      className="container mt-4 mb-5"
      style={{ maxWidth: "950px" }}
    >

      {/* HEADER */}

      <div className="mb-4">
        <h2 className="mb-1">
          Payroll
        </h2>

        <p className="text-muted mb-0">
          Calculate and create monthly
          employee payroll.
        </p>
      </div>

      {/* MAIN CARD */}

      <div className="card shadow-sm border-0">

        <div className="card-body p-4">

          {/* FORM */}

          <div className="row">

            {/* EMPLOYEE */}

            <div className="col-md-6 mb-3">

              <label className="form-label fw-semibold">
                Employee
              </label>

              <select
                name="employeeId"
                className="form-select"
                value={form.employeeId}
                onChange={handleChange}
                disabled={employeesLoading}
              >

                <option value="">
                  {employeesLoading
                    ? "Loading employees..."
                    : "Select Employee"}
                </option>

                {employees.map(
                  (employee) => (
                    <option
                      key={employee._id}
                      value={employee._id}
                    >
                      {employee.name} —{" "}
                      {Number(
                        employee.salary || 0
                      ).toLocaleString()}{" "}
                      ETB
                    </option>
                  )
                )}

              </select>

            </div>

            {/* MONTH */}

            <div className="col-md-6 mb-3">

              <label className="form-label fw-semibold">
                Payroll Month
              </label>

              <input
                type="month"
                name="month"
                className="form-control"
                value={form.month}
                onChange={handleChange}
              />

            </div>

            {/* OTHER DEDUCTION */}

            <div className="col-md-6 mb-3">

              <label className="form-label fw-semibold">
                Other Deduction
              </label>

              <input
                type="number"
                name="otherDeduction"
                className="form-control"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={
                  form.otherDeduction
                }
                onChange={handleChange}
              />

              <small className="text-muted">
                Optional deduction
              </small>

            </div>

          </div>

          {/* CALCULATE BUTTON */}

          <div className="mt-2">

            <button
              type="button"
              className="btn btn-secondary"
              onClick={calculatePreview}
              disabled={
                employeesLoading ||
                !form.employeeId
              }
            >
              🧮 Calculate Preview
            </button>

          </div>

          {/* PREVIEW */}

          {preview && (
            <div className="mt-5">

              <div className="d-flex justify-content-between align-items-center mb-3">

                <div>
                  <h4 className="mb-1">
                    Payroll Preview
                  </h4>

                  <small className="text-muted">
                    Review deductions before
                    creating payroll.
                  </small>
                </div>

                <span className="badge bg-warning text-dark">
                  Draft
                </span>

              </div>

              <div className="table-responsive">

                <table className="table table-bordered align-middle">

                  <tbody>

                    {/* GROSS */}

                    <tr>
                      <td>
                        <strong>
                          Gross Salary
                        </strong>
                      </td>

                      <td className="text-end fw-semibold">
                        {formatMoney(
                          preview.grossSalary
                        )}{" "}
                        ETB
                      </td>
                    </tr>

                    {/* TAX */}

                    <tr>
                      <td>
                        Tax
                      </td>

                      <td className="text-end text-danger">
                        -
                        {formatMoney(
                          preview.tax
                        )}{" "}
                        ETB
                      </td>
                    </tr>

                    {/* PENSION */}

                    <tr>
                      <td>
                        Pension
                      </td>

                      <td className="text-end text-danger">
                        -
                        {formatMoney(
                          preview.pension
                        )}{" "}
                        ETB
                      </td>
                    </tr>

                    {/* SALARY ADVANCE */}

                    <tr>
                      <td>
                        Salary Advance
                      </td>

                      <td className="text-end text-danger">
                        -
                        {formatMoney(
                          preview.salaryAdvance
                        )}{" "}
                        ETB
                      </td>
                    </tr>

                    {/* OTHER DEDUCTION */}

                    <tr>
                      <td>
                        Other Deduction
                      </td>

                      <td className="text-end text-danger">
                        -
                        {formatMoney(
                          preview.otherDeduction
                        )}{" "}
                        ETB
                      </td>
                    </tr>

                    {/* NET */}

                    <tr className="table-success">

                      <th>
                        Net Salary
                      </th>

                      <th className="text-end fs-5">
                        {formatMoney(
                          preview.netSalary
                        )}{" "}
                        ETB
                      </th>

                    </tr>

                  </tbody>

                </table>

              </div>

              {/* CREATE */}

              <div className="d-flex justify-content-end gap-2 mt-3">

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    setPreview(null)
                  }
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={createPayroll}
                  disabled={loading}
                >
                  {loading
                    ? "Creating..."
                    : "Create Payroll"}
                </button>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default Payroll;