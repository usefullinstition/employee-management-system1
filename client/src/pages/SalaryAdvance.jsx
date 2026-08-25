import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

function SalaryAdvance() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    employeeId: "",
    amount: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employees");

      setEmployees(res.data);
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to load employees"
      );
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.employeeId) {
      toast.error("Please select employee");
      return;
    }

    if (
      !form.amount ||
      Number(form.amount) <= 0
    ) {
      toast.error(
        "Enter a valid advance amount"
      );
      return;
    }

    try {
      setLoading(true);

      await API.post(
        "/salary-advances",
        {
          employeeId: form.employeeId,
          amount: Number(form.amount),
          reason: form.reason,
        }
      );

      toast.success(
        "Salary advance recorded successfully!"
      );

      navigate("/salary-advances");
    } catch (error) {
      console.error(
        "SALARY ADVANCE ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to record salary advance"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container mt-4"
      style={{ maxWidth: "650px" }}
    >
      <div className="card shadow-sm">
        <div className="card-body p-4">

          <h2>Salary Advance</h2>

          <p className="text-muted">
            Record money borrowed by an employee
            before salary payment.
          </p>

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">
                Employee *
              </label>

              <select
                name="employeeId"
                className="form-select"
                value={form.employeeId}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Employee
                </option>

                {employees.map((employee) => (
                  <option
                    key={employee._id}
                    value={employee._id}
                  >
                    {employee.name}
                    {employee.employeeId
                      ? ` (${employee.employeeId})`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Advance Amount (ETB) *
              </label>

              <input
                type="number"
                name="amount"
                className="form-control"
                min="1"
                placeholder="5000"
                value={form.amount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Reason
              </label>

              <textarea
                name="reason"
                className="form-control"
                rows="3"
                placeholder="Reason for advance..."
                value={form.reason}
                onChange={handleChange}
              />
            </div>

            <div className="d-flex gap-2">

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  navigate("/salary-advances")
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : "Record Advance"}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default SalaryAdvance;