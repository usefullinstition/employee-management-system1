import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", form);

      toast.success("Company account created successfully!");

      navigate("/login");
    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message ||
          "Registration failed"
      );
    }
  };

  return (
    <div
      className="container mt-5"
      style={{ maxWidth: "400px" }}
    >
      <h2 className="mb-4">
        Create Company Account
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Your Name */}
        <input
          className="form-control mb-3"
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        {/* Company Name */}
        <input
          className="form-control mb-3"
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={form.companyName}
          onChange={handleChange}
          required
        />

        {/* Email */}
        <input
          className="form-control mb-3"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        {/* Password */}
        <input
          className="form-control mb-3"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="btn btn-success w-100"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

export default Register;