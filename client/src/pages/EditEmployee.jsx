import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    salaryAdvance: 0,
    otherDeduction: 0,
  });

  const [photo, setPhoto] = useState(null);
  const [currentPhoto, setCurrentPhoto] = useState("");

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/employees/${id}`);

      const employee = res.data;

      setForm({
        name: employee.name || "",
        email: employee.email || "",
        phone: employee.phone || "",
        address: employee.address || "",
        department: employee.department || "",
        position: employee.position || "",
        hireDate: employee.hireDate
          ? employee.hireDate.substring(0, 10)
          : "",
        status: employee.status || "Active",
        salary: employee.salary || "",
        salaryAdvance: employee.salaryAdvance || 0,
        otherDeduction: employee.otherDeduction || 0,
      });

      setCurrentPhoto(employee.photo || "");
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load employee"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Number(form.salary) <= 0) {
      toast.error("Salary must be greater than 0");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (photo) {
        formData.append("photo", photo);
      }

      await API.put(
        `/employees/${id}`,
        formData
      );

      toast.success(
        "Employee updated successfully!"
      );

      navigate("/employees");
    } catch (error) {
      console.error(
        "UPDATE EMPLOYEE ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Update failed"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Loading employee...</p>;
  }

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "600px",
        margin: "auto",
      }}
    >
      <h2>Edit Employee</h2>

      <form onSubmit={handleSubmit}>
        <label>Name</label>

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <label>Email</label>

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <label>Phone</label>

        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />

        <br />
        <br />

        <label>Address</label>

        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
        />

        <br />
        <br />

        <label>Department</label>

        <select
          name="department"
          value={form.department}
          onChange={handleChange}
          required
        >
          <option value="">Select Department</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Finance">
            Finance
          </option>
          <option value="Marketing">
            Marketing
          </option>
        </select>

        <br />
        <br />

        <label>Position</label>

        <input
          type="text"
          name="position"
          value={form.position}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <label>Hire Date</label>

        <input
          type="date"
          name="hireDate"
          value={form.hireDate}
          onChange={handleChange}
        />

        <br />
        <br />

        <label>Status</label>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <br />
        <br />

        <label>Salary</label>

        <input
          type="number"
          name="salary"
          value={form.salary}
          onChange={handleChange}
          min="0"
          required
        />

        <br />
        <br />

        <label>Salary Advance</label>

        <input
          type="number"
          name="salaryAdvance"
          value={form.salaryAdvance}
          onChange={handleChange}
          min="0"
        />

        <br />
        <br />

        <label>Other Deduction</label>

        <input
          type="number"
          name="otherDeduction"
          value={form.otherDeduction}
          onChange={handleChange}
          min="0"
        />

        <br />
        <br />

        <label>Employee Photo</label>

        {currentPhoto && (
          <div style={{ margin: "10px 0" }}>
            <img
              src={currentPhoto}
              alt={form.name}
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
        />

        <br />
        <br />

        <button
          type="submit"
          disabled={saving}
        >
          {saving
            ? "Updating..."
            : "Update Employee"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/employees")}
          style={{ marginLeft: "10px" }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EditEmployee;