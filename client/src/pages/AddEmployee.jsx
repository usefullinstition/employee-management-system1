import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

function AddEmployee() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    department: "",
    position: "",
    hireDate: "",
    status: "Active",
    salary: "",
    salaryAdvance: "",
    otherDeduction: "",
    photo: null,
  });

  const [loading, setLoading] = useState(false);

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      setForm((prev) => ({
        ...prev,
        photo: files?.[0] || null,
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // TAX CALCULATION
  // =========================

  const calculateTax = (salary) => {
    const amount = Number(salary) || 0;

    if (amount <= 2000) {
      return 0;
    }

    if (amount <= 4000) {
      return amount * 0.15 - 300;
    }

    if (amount <= 7000) {
      return amount * 0.2 - 500;
    }

    if (amount <= 10000) {
      return amount * 0.25 - 850;
    }

    if (amount <= 14000) {
      return amount * 0.3 - 1350;
    }

    return amount * 0.35 - 2050;
  };

  // =========================
  // PAYROLL PREVIEW
  // =========================

  const salary = Number(form.salary) || 0;
  const salaryAdvance = Number(form.salaryAdvance) || 0;
  const otherDeduction = Number(form.otherDeduction) || 0;

  const tax = Math.max(0, calculateTax(salary));
  const pension = salary * 0.07;

  const netSalary = Math.max(
    0,
    salary -
      tax -
      pension -
      salaryAdvance -
      otherDeduction
  );

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Employee name is required");
      return;
    }

    if (!form.email.trim()) {
      toast.error("Employee email is required");
      return;
    }

    if (!form.department) {
      toast.error("Please select department");
      return;
    }

    if (!form.position.trim()) {
      toast.error("Employee position is required");
      return;
    }

    if (salary <= 0) {
      toast.error("Salary must be greater than 0");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("address", form.address);
      formData.append("department", form.department);
      formData.append("position", form.position);
      formData.append("hireDate", form.hireDate);
      formData.append("status", form.status);
      formData.append("salary", salary);
      formData.append("salaryAdvance", salaryAdvance);
      formData.append("otherDeduction", otherDeduction);

      if (form.photo) {
        formData.append("photo", form.photo);
      }

      await API.post("/employees", formData);

      toast.success("Employee added successfully!");

      navigate("/employees");
    } catch (error) {
      console.error("ADD EMPLOYEE ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to add employee"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="row g-4">

        {/* =========================
            FORM
        ========================= */}

        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">

              <h2 className="mb-1">
                Add New Employee
              </h2>

              <p className="text-muted mb-4">
                Add employee information and payroll details.
              </p>

              <form onSubmit={handleSubmit}>

                {/* PERSONAL INFORMATION */}

                <h5 className="border-bottom pb-2 mb-3">
                  Personal Information
                </h5>

                <div className="row g-3">

                  <div className="col-md-6">
                    <label className="form-label">
                      Full Name *
                    </label>

                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Employee full name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      Email *
                    </label>

                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="employee@email.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      Phone
                    </label>

                    <input
                      type="text"
                      name="phone"
                      className="form-control"
                      placeholder="+251..."
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      Address
                    </label>

                    <input
                      type="text"
                      name="address"
                      className="form-control"
                      placeholder="Employee address"
                      value={form.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">
                      Employee Photo
                    </label>

                    <input
                      type="file"
                      name="photo"
                      className="form-control"
                      accept="image/*"
                      onChange={handleChange}
                    />
                  </div>

                </div>

                {/* JOB INFORMATION */}

                <h5 className="border-bottom pb-2 mb-3 mt-5">
                  Job Information
                </h5>

                <div className="row g-3">

                  <div className="col-md-6">
                    <label className="form-label">
                      Department *
                    </label>

                    <select
                      name="department"
                      className="form-select"
                      value={form.department}
                      onChange={handleChange}
                      required
                    >
                      <option value="">
                        Select Department
                      </option>

                      <option value="IT">
                        IT
                      </option>

                      <option value="HR">
                        HR
                      </option>

                      <option value="Finance">
                        Finance
                      </option>

                      <option value="Marketing">
                        Marketing
                      </option>

                      <option value="Sales">
                        Sales
                      </option>

                      <option value="Operations">
                        Operations
                      </option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      Position *
                    </label>

                    <input
                      type="text"
                      name="position"
                      className="form-control"
                      placeholder="e.g. Sales Manager"
                      value={form.position}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      Hire Date
                    </label>

                    <input
                      type="date"
                      name="hireDate"
                      className="form-control"
                      value={form.hireDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      Status
                    </label>

                    <select
                      name="status"
                      className="form-select"
                      value={form.status}
                      onChange={handleChange}
                    >
                      <option value="Active">
                        Active
                      </option>

                      <option value="Inactive">
                        Inactive
                      </option>

                      <option value="On Leave">
                        On Leave
                      </option>
                    </select>
                  </div>

                </div>

                {/* PAYROLL */}

                <h5 className="border-bottom pb-2 mb-3 mt-5">
                  Salary & Payroll
                </h5>

                <div className="row g-3">

                  <div className="col-md-4">
                    <label className="form-label">
                      Gross Monthly Salary *
                    </label>

                    <input
                      type="number"
                      name="salary"
                      className="form-control"
                      placeholder="0"
                      min="0"
                      value={form.salary}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">
                      Salary Advance
                    </label>

                    <input
                      type="number"
                      name="salaryAdvance"
                      className="form-control"
                      placeholder="0"
                      min="0"
                      value={form.salaryAdvance}
                      onChange={handleChange}
                    />

                    <small className="text-muted">
                      Advance taken before salary
                    </small>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">
                      Other Deduction
                    </label>

                    <input
                      type="number"
                      name="otherDeduction"
                      className="form-control"
                      placeholder="0"
                      min="0"
                      value={form.otherDeduction}
                      onChange={handleChange}
                    />
                  </div>

                </div>

                <div className="d-flex gap-2 mt-4">

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/employees")}
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
                      : "Add Employee"}
                  </button>

                </div>

              </form>
            </div>
          </div>
        </div>

        {/* =========================
            PAYROLL PREVIEW
        ========================= */}

        <div className="col-lg-4">

          <div className="card shadow-sm border-0 sticky-top"
               style={{ top: "20px" }}>

            <div className="card-body p-4">

              <h4>
                Payroll Preview
              </h4>

              <p className="text-muted">
                Calculated automatically
              </p>

              <hr />

              <div className="d-flex justify-content-between mb-3">
                <span>Gross Salary</span>
                <strong>
                  {salary.toLocaleString()} ETB
                </strong>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span>Tax</span>
                <strong>
                  {tax.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}{" "}
                  ETB
                </strong>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span>Pension (7%)</span>
                <strong>
                  {pension.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}{" "}
                  ETB
                </strong>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span>Salary Advance</span>
                <strong>
                  {salaryAdvance.toLocaleString()} ETB
                </strong>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span>Other Deduction</span>
                <strong>
                  {otherDeduction.toLocaleString()} ETB
                </strong>
              </div>

              <hr />

              <div className="d-flex justify-content-between">
                <span className="fw-bold">
                  Net Salary
                </span>

                <strong className="text-success fs-5">
                  {netSalary.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}{" "}
                  ETB
                </strong>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default AddEmployee;