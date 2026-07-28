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


  useEffect(() => {
    fetchEmployees();
  }, []);



  const fetchEmployees = async () => {

    try {

      const res = await API.get("/employees");

      setEmployees(res.data);

    } catch (err) {

      console.log(err);

    }

  };
const user = JSON.parse(
 localStorage.getItem("user")
);


  const deleteEmployee = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );


    if (!confirmDelete) return;


    try {

      await API.delete(`/employees/${id}`);


      setEmployees(
        employees.filter((emp) => emp._id !== id)
      );


      toast.success(
        "Employee Deleted Successfully!"
      );


    } catch (err) {

      console.log(err);

      toast.error(
        "Delete Failed"
      );

    }

  };



  const downloadPDF = () => {

    const doc = new jsPDF();


    doc.text(
      "Employee Report",
      14,
      20
    );


    autoTable(doc, {

      startY: 30,

      head: [
        [
          "Name",
          "Email",
          "Department",
          "Position",
          "Salary"
        ]
      ],


      body: employees.map((emp)=>[
        emp.name,
        emp.email,
        emp.department,
        emp.position,
        emp.salary
      ])

    });


    doc.save("employees.pdf");

  };



  const downloadExcel = () => {

    const data = employees.map((emp)=>({

      Name: emp.name,
      Email: emp.email,
      Department: emp.department,
      Position: emp.position,
      Salary: emp.salary

    }));


    const worksheet =
      XLSX.utils.json_to_sheet(data);


    const workbook =
      XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Employees"
    );


    const excelBuffer =
      XLSX.write(workbook,{
        bookType:"xlsx",
        type:"array"
      });


    const fileData = new Blob(
      [excelBuffer]
    );


    saveAs(
      fileData,
      "Employees.xlsx"
    );

  };



  const printEmployees = () => {

    window.print();

  };



  return (

    <div className="container mt-4">


      <div className="d-flex justify-content-between align-items-center mb-3">


        <h2>
          Employees
        </h2>


        <input

          type="text"

          className="form-control"

          placeholder="Search..."

          value={search}

          onChange={(e)=>setSearch(e.target.value)}

          style={{
            maxWidth:"300px"
          }}

        />


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



      <table className="table table-bordered table-hover">


        <thead className="table-dark">

          <tr>

            <th>#</th>
            <th>Photo</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Position</th>
            <th>Salary</th>
            <th>Action</th>

          </tr>

        </thead>



        <tbody>


        {employees

        .filter((emp)=>

          emp.name
          .toLowerCase()
          .includes(search.toLowerCase())

          ||

          emp.email
          .toLowerCase()
          .includes(search.toLowerCase())

        )


        .map((emp,index)=>(


          <tr key={emp._id}>


            <td>{index+1}</td>


            <td>

              <img

                src={emp.photo || "/default.png"}

                alt={emp.name}

                width="50"

                height="50"

                style={{
                  borderRadius:"50%",
                  objectFit:"cover"
                }}

              />

            </td>


            <td>{emp.name}</td>

            <td>{emp.email}</td>

            <td>{emp.department}</td>

            <td>{emp.position}</td>

            <td>${emp.salary}</td>


            <td>


             {user?.role === "Admin" && (
  <Link
    to={`/edit-employee/${emp._id}`}
    className="btn btn-warning btn-sm me-2"
  >
    Edit
  </Link>
)}



            {user?.role === "Admin" && (
  <button
    onClick={() => deleteEmployee(emp._id)}
    className="btn btn-danger btn-sm"
  >
    Delete
  </button>
)}


            </td>


          </tr>


        ))}


        </tbody>


      </table>


    </div>

  );

}


export default Employees;