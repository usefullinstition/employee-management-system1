import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";


function AddEmployee() {

  const navigate = useNavigate();


  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    position: "",
    salary: "",
    photo: null,
  });



  const handleChange = (e) => {

    if(e.target.name === "photo"){

      setForm({
        ...form,
        photo: e.target.files[0],
      });

    }else{

      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });

    }

  };




  const handleSubmit = async (e)=>{

    e.preventDefault();


    try{


      const formData = new FormData();


      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("department", form.department);
      formData.append("position", form.position);
      formData.append("salary", form.salary);


      if(form.photo){
        formData.append("photo", form.photo);
      }



      await API.post("/employees", formData, {

        headers:{
          "Content-Type":"multipart/form-data",
        },

      });



      toast.success("Employee Added Successfully!");

      navigate("/employees");



    }
    catch(err){


      console.log(err);


     console.log(err.response?.data);

  toast.error(
    err.response?.data?.message || "Failed to add employee"
  );


    }


  };




  return (

    <div style={{padding:"20px"}}>


      <h2>Add Employee</h2>


      <form onSubmit={handleSubmit}>


        <input
        type="text"
        name="name"
        placeholder="Name"
        onChange={handleChange}
        />

        <br/><br/>



        <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        />

        <br/><br/>



        <input
        type="text"
        name="position"
        placeholder="Position"
        onChange={handleChange}
        />

        <br/><br/>



        <input
        type="number"
        name="salary"
        placeholder="Salary"
        onChange={handleChange}
        />

        <br/><br/>



        <input
        type="file"
        name="photo"
        accept="image/*"
        onChange={handleChange}
        />

        <br/><br/>



        <select
        name="department"
        value={form.department}
        onChange={handleChange}
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


        </select>


        <br/><br/>



        <button type="submit">
          Add Employee
        </button>



      </form>


    </div>

  );


}


export default AddEmployee;