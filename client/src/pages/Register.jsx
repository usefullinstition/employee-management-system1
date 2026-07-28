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

      await API.post(
        "/auth/register",
        form
      );


      toast.success(
        "Account created successfully!"
      );


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
      style={{maxWidth:"400px"}}
    >


      <h2 className="mb-4">
        Register
      </h2>



      <form onSubmit={handleSubmit}>


        <input
          className="form-control mb-3"
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />


        <input
          className="form-control mb-3"
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />


        <input
          className="form-control mb-3"
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />


        <button className="btn btn-success w-100">
          Register
        </button>


      </form>


    </div>

  );

}


export default Register;