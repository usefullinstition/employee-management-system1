const employees = [
  {
    id: 1,
    name: "John Doe",
    email: "john@gmail.com",
    department: "IT",
    position: "Frontend Developer",
    salary: "$1200",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@gmail.com",
    department: "HR",
    position: "HR Manager",
    salary: "$1000",
  },
];

function Employees() {
  return (
    <div>
      <h1>Employees</h1>

      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Position</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.department}</td>
              <td>{employee.position}</td>
              <td>{employee.salary}</td>
              <td>
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Employees;