function AddEmployee() {
  return (
    <div>
      <h1>Add Employee</h1>

      <form className="employee-form">
        <input type="text" placeholder="Full Name" />

        <input type="email" placeholder="Email" />

        <input type="text" placeholder="Department" />

        <input type="text" placeholder="Position" />

        <input type="number" placeholder="Salary" />

        <button type="submit">Save Employee</button>
      </form>
    </div>
  );
}

export default AddEmployee;