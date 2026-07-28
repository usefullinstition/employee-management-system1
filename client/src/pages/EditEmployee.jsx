import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";


function EditEmployee() {

  const { id } = useParams();
  const navigate = useNavigate();


  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    position: "",
    salary: "",
  });



  useEffect(() => {
    fetchEmployee();
  }, [id]);



  const fetchEmployee = async () => {

    try {

      const res = await API.get(`/employees/${id}`);

      setForm(res.data);


    } catch (err) {

      console.error(err);

      toast.error("Failed to load employee");

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


    try {


      await API.put(`/employees/${id}`, form);



      toast.success(
        "Employee Updated Successfully!"
      );



      navigate("/employees");



    } catch (err) {


      console.error(err);



      toast.error(
        err.response?.data?.message ||
        "Update Failed"
      );


    }


  };





  return (

    <div 
    style={{
      padding:"20px",
      maxWidth:"500px",
      margin:"auto"
    }}
    >


      <h2>Edit Employee</h2>



      <form onSubmit={handleSubmit}>


        <input

          type="text"

          name="name"

          placeholder="Employee Name"

          value={form.name}

          onChange={handleChange}

          required

        />

        <br />
        <br />



        <input

          type="email"

          name="email"

          placeholder="Employee Email"

          value={form.email}

          onChange={handleChange}

          required

        />


        <br />
        <br />




        <select

          name="department"

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


        </select>


        <br />
        <br />




        <input

          type="text"

          name="position"

          placeholder="Position"

          value={form.position}

          onChange={handleChange}

          required

        />


        <br />
        <br />




        <input

          type="number"

          name="salary"

          placeholder="Salary"

          value={form.salary}

          onChange={handleChange}

          required

        />


        <br />
        <br />



        <button type="submit">

          Update Employee

        </button>



      </form>


    </div>

  );


}


export default EditEmployee;