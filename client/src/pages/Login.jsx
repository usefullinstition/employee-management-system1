// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";
// import { toast } from "react-toastify";

// function Login() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await API.post("/auth/login", form);

//       // Save JWT token
//       localStorage.setItem("token", res.data.token);

//       // Save user information
//       localStorage.setItem(
//         "user",
//         JSON.stringify(res.data.user)
//       );

//       // console.log("Logged in user:", res.data.user);
//       console.log("FULL LOGIN RESPONSE:", res.data);
// console.log("USER:", res.data.user);
// console.log("COMPANY ID:", res.data.user?.companyId);

//       toast.success("Login Successful!");

//       navigate("/");
//     } catch (err) {
//       console.log(err);

//       toast.error(
//         err.response?.data?.message ||
//           "Login Failed"
//       );
//     }
//   };

//   return (
//     <div
//       className="container mt-5"
//       style={{ maxWidth: "400px" }}
//     >
//       <h2 className="mb-4">
//         Login
//       </h2>

//       <form onSubmit={handleSubmit}>
//         <input
//           className="form-control mb-3"
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={form.email}
//           onChange={handleChange}
//           required
//         />

//         <input
//           className="form-control mb-3"
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={form.password}
//           onChange={handleChange}
//           required
//         />

//         <button
//           type="submit"
//           className="btn btn-primary w-100"
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }

// export default Login;




import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
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
      const res = await API.post(
        "/auth/login",
        form
      );

      console.log(
        "========== FRONTEND LOGIN =========="
      );

      console.log(
        "FULL LOGIN RESPONSE:",
        res.data
      );

      console.log(
        "USER:",
        res.data.user
      );

      console.log(
        "COMPANY ID:",
        res.data.user?.companyId
      );

      console.log(
        "===================================="
      );

      // Save JWT
      localStorage.setItem(
        "token",
        res.data.token
      );

      // Save COMPLETE user
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      // Verify localStorage
      console.log(
        "USER SAVED TO LOCALSTORAGE:",
        JSON.parse(
          localStorage.getItem("user")
        )
      );

      toast.success("Login Successful!");

      navigate("/");
    } catch (err) {
      console.error(
        "LOGIN ERROR:",
        err
      );

      toast.error(
        err.response?.data?.message ||
          "Login Failed"
      );
    }
  };

  return (
    <div
      className="container mt-5"
      style={{ maxWidth: "400px" }}
    >
      <h2 className="mb-4">
        Login
      </h2>

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-3"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

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
          className="btn btn-primary w-100"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;