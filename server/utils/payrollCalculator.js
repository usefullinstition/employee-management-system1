// ===============================
// TAX CALCULATION
// ===============================

const calculateTax = (salary) => {
  const amount = Number(salary) || 0;

  if (amount <= 2000) {
    return 0;
  }

  if (amount <= 4000) {
    return Math.max(0, amount * 0.15 - 300);
  }

  if (amount <= 7000) {
    return Math.max(0, amount * 0.2 - 500);
  }

  if (amount <= 10000) {
    return Math.max(0, amount * 0.25 - 850);
  }

  if (amount <= 14000) {
    return Math.max(0, amount * 0.3 - 1350);
  }

  return Math.max(0, amount * 0.35 - 2050);
};

// ===============================
// PAYROLL CALCULATION
// ===============================

const calculatePayroll = ({
  salary,
  salaryAdvance = 0,
  otherDeduction = 0,
}) => {
  const grossSalary = Number(salary) || 0;
  const advance = Number(salaryAdvance) || 0;
  const other = Number(otherDeduction) || 0;

  const tax = calculateTax(grossSalary);

  const pension = Number(
    (grossSalary * 0.07).toFixed(2)
  );

  const netSalary = Math.max(
    0,
    Number(
      (
        grossSalary -
        tax -
        pension -
        advance -
        other
      ).toFixed(2)
    )
  );

  return {
    grossSalary,
    tax,
    pension,
    salaryAdvance: advance,
    otherDeduction: other,
    netSalary,
  };
};

module.exports = {
  calculateTax,
  calculatePayroll,
};