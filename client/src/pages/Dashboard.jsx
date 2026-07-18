function Dashboard() {
  const cards = [
    {
      title: "Total Employees",
      value: 120,
      color: "#2563eb",
    },
    {
      title: "Departments",
      value: 8,
      color: "#16a34a",
    },
    {
      title: "Active Employees",
      value: 110,
      color: "#ea580c",
    },
    {
      title: "Total Salary",
      value: "$45,000",
      color: "#7c3aed",
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: "20px" }}>Dashboard</h1>

      <div className="cards">
        {cards.map((card, index) => (
          <div
            key={index}
            className="card"
            style={{ borderLeft: `5px solid ${card.color}` }}
          >
            <h3>{card.title}</h3>
            <h2>{card.value}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;