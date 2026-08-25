// ========================================
// PAYROLL CALCULATOR
// ========================================

// Ethiopian employment income tax calculation
const calculateTax = (salary) => {
  const amount = Number(salary) || 0;

  if (amount <= 2000) {
    return 0;
  }

  if (amount <= 4000) {
    return amount * 0.15 - 300;
  }

  if (amount <= 7000) {
    return amount * 0.20 - 500;
  }

  if (amount <= 10000) {
    return amount * 0.25 - 850;
  }

  if (amount <= 14000) {
    return amount * 0.30 - 1350;
  }

  return amount * 0.35 - 2050;
};


// ========================================
// PENSION
// ========================================

const calculatePension = (salary) => {
  const amount = Number(salary) || 0;

  return amount * 0.07;
};


// ========================================
// NET SALARY
// ========================================

const calculateNetSalary = ({
  salary,
  salaryAdvance = 0,
  otherDeduction = 0,
}) => {

  const grossSalary = Number(salary) || 0;
  const advance = Number(salaryAdvance) || 0;
  const other = Number(otherDeduction) || 0;

  const tax = Math.max(
    0,
    calculateTax(grossSalary)
  );

  const pension = calculatePension(
    grossSalary
  );

  const netSalary = Math.max(
    0,
    grossSalary -
      tax -
      pension -
      advance -
      other
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


// ========================================
// EXPORT
// ========================================

module.exports = {
  calculateTax,
  calculatePension,
  calculateNetSalary,
};