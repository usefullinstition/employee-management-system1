
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Payslip() {
  const { id } = useParams();

  const [payroll, setPayroll] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayroll();
  }, [id]);

 const fetchPayroll = async () => {
  try {
    setLoading(true);

    console.log("PAYSLIP ID:", id);

    const res = await API.get(
      `/payroll/${id}/payslip`
    );

    console.log(
      "PAYSLIP RESPONSE:",
      res.data
    );

    const data = res.data;

    setPayroll({
      _id: data.payroll.id,

      month: data.payroll.month,
      status: data.payroll.status,
      paidAt: data.payroll.paidAt,
      createdAt: data.payroll.createdAt,

      employee: {
        _id: data.employee.id,
        employeeId: data.employee.employeeId,
        name: data.employee.name,
        email: data.employee.email,
        department: data.employee.department,
        position: data.employee.position,
      },

      grossSalary:
        data.earnings.grossSalary,

      tax:
        data.deductions.tax,

      pension:
        data.deductions.pension,

      salaryAdvance:
        data.deductions.salaryAdvance,

      otherDeduction:
        data.deductions.otherDeduction,

      netSalary:
        data.netSalary,
    });

  } catch (error) {
    console.error(
      "FETCH PAYSLIP ERROR:",
      error
    );

    console.error(
      "STATUS:",
      error.response?.status
    );

    console.error(
      "DATA:",
      error.response?.data
    );

    toast.error(
      error.response?.data?.message ||
        "Failed to load payslip"
    );
  } finally {
    setLoading(false);
  }
};

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString(
      undefined,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  const downloadPDF = () => {
    if (!payroll) return;

    const doc = new jsPDF();

    const employee =
      payroll.employee || {};

    // =========================
    // HEADER
    // =========================

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");

    doc.text(
      "Coca-Cola",
      105,
      20,
      { align: "center" }
    );

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    doc.text(
      "Employee Management & Payroll System",
      105,
      28,
      { align: "center" }
    );

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");

    doc.text(
      "SALARY PAYSLIP",
      105,
      42,
      { align: "center" }
    );

    // =========================
    // EMPLOYEE INFORMATION
    // =========================

    autoTable(doc, {
      startY: 52,

      theme: "grid",

      head: [
        [
          "Employee Information",
          "Details",
        ],
      ],

      body: [
        [
          "Employee Name",
          employee.name || "-",
        ],
        [
          "Employee ID",
          employee.employeeId || employee._id || "-",
        ],
        [
          "Department",
          employee.department || "-",
        ],
        [
          "Position",
          employee.position || "-",
        ],
        [
          "Payroll Month",
          payroll.month || "-",
        ],
        [
          "Status",
          payroll.status || "-",
        ],
      ],
    });

    // =========================
    // SALARY DETAILS
    // =========================

    const salaryStart =
      doc.lastAutoTable.finalY + 10;

    autoTable(doc, {
      startY: salaryStart,

      theme: "grid",

      head: [
        [
          "Salary Description",
          "Amount",
        ],
      ],

      body: [
        [
          "Gross Salary",
          `${formatMoney(
            payroll.grossSalary
          )} ETB`,
        ],
        [
          "Tax",
          `- ${formatMoney(
            payroll.tax
          )} ETB`,
        ],
        [
          "Pension",
          `- ${formatMoney(
            payroll.pension
          )} ETB`,
        ],
        [
          "Salary Advance",
          `- ${formatMoney(
            payroll.salaryAdvance
          )} ETB`,
        ],
        [
          "Other Deduction",
          `- ${formatMoney(
            payroll.otherDeduction
          )} ETB`,
        ],
        [
          "NET SALARY",
          `${formatMoney(
            payroll.netSalary
          )} ETB`,
        ],
      ],

      didParseCell: (data) => {
        if (
          data.row.index === 5 &&
          data.section === "body"
        ) {
          data.cell.styles.fontStyle =
            "bold";

          data.cell.styles.fontSize = 12;
        }
      },
    });

    // =========================
    // FOOTER
    // =========================

    const finalY =
      doc.lastAutoTable.finalY + 18;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    doc.text(
      "This payslip is electronically generated.",
      105,
      finalY,
      { align: "center" }
    );

    doc.text(
      "Coca-Cola Payroll System",
      105,
      finalY + 7,
      { align: "center" }
    );

    doc.save(
      `Payslip-${employee.name || "Employee"}-${payroll.month || ""}.pdf`
    );
  };

  const printPayslip = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" />
        <p className="mt-3">
          Loading payslip...
        </p>
      </div>
    );
  }

  if (!payroll) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          Payslip not found.
        </div>
      </div>
    );
  }

  const employee =
    payroll.employee || {};

  return (
    <>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }

            .payslip-container,
            .payslip-container * {
              visibility: visible;
            }

            .payslip-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }

            .payslip-actions {
              display: none !important;
            }
          }

          .payslip-container {
            max-width: 850px;
            margin: 30px auto;
          }

          .payslip-card {
            border: none;
            border-radius: 18px;
            overflow: hidden;
          }

          .payslip-header {
            padding: 30px;
            text-align: center;
            background: linear-gradient(
              135deg,
              #d71920,
              #a50000
            );
            color: white;
          }

          .company-name {
            font-size: 32px;
            font-weight: 800;
            letter-spacing: 1px;
          }

          .payslip-title {
            font-size: 22px;
            font-weight: 600;
            margin-top: 8px;
          }

          .info-card {
            border-radius: 12px;
            background: #f8f9fa;
            padding: 20px;
            height: 100%;
          }

          .info-label {
            font-size: 12px;
            color: #6c757d;
            margin-bottom: 4px;
          }

          .info-value {
            font-weight: 600;
            font-size: 15px;
          }

          .salary-table td,
          .salary-table th {
            padding: 14px;
            vertical-align: middle;
          }

          .net-row {
            font-size: 19px;
            font-weight: 800;
          }

          .net-box {
            border-radius: 14px;
            padding: 20px;
            text-align: center;
            background: #e8f7ee;
            border: 1px solid #b7e4c7;
          }

          .net-label {
            font-size: 13px;
            color: #198754;
            font-weight: 600;
          }

          .net-value {
            font-size: 28px;
            font-weight: 800;
            color: #198754;
          }
        `}
      </style>

      <div className="container mt-4 payslip-actions">
        <div className="d-flex justify-content-end gap-2">
          <button
            className="btn btn-danger"
            onClick={downloadPDF}
          >
            📥 Download PDF
          </button>

          <button
            className="btn btn-secondary"
            onClick={printPayslip}
          >
            🖨️ Print
          </button>
        </div>
      </div>

      <div className="payslip-container">
        <div className="card shadow-lg payslip-card">

          {/* HEADER */}

          <div className="payslip-header">
            <div className="company-name">
              Coca-Cola
            </div>

            <div>
              Employee Management &
              Payroll System
            </div>

            <div className="payslip-title">
              SALARY PAYSLIP
            </div>
          </div>

          <div className="card-body p-4 p-md-5">

            {/* EMPLOYEE INFORMATION */}

            <h5 className="fw-bold mb-3">
              👤 Employee Information
            </h5>

            <div className="row g-3 mb-4">

              <div className="col-md-6">
                <div className="info-card">
                  <div className="info-label">
                    Employee Name
                  </div>

                  <div className="info-value">
                    {employee.name || "-"}
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="info-card">
                  <div className="info-label">
                    Employee ID
                  </div>

                  <div className="info-value">
                    {employee.employeeId ||
                      employee._id ||
                      "-"}
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="info-card">
                  <div className="info-label">
                    Department
                  </div>

                  <div className="info-value">
                    {employee.department ||
                      "-"}
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="info-card">
                  <div className="info-label">
                    Position
                  </div>

                  <div className="info-value">
                    {employee.position ||
                      "-"}
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="info-card">
                  <div className="info-label">
                    Payroll Month
                  </div>

                  <div className="info-value">
                    {payroll.month || "-"}
                  </div>
                </div>
              </div>

            </div>

            {/* STATUS */}

            <div className="mb-4">
              <strong>
                Payroll Status:
              </strong>{" "}

              <span
                className={`badge ${
                  payroll.status === "Paid"
                    ? "bg-success"
                    : payroll.status ===
                      "Draft"
                    ? "bg-warning text-dark"
                    : "bg-secondary"
                }`}
              >
                {payroll.status}
              </span>
            </div>

            {/* SALARY */}

            <h5 className="fw-bold mb-3">
              💰 Salary Details
            </h5>

            <div className="table-responsive">
              <table className="table table-bordered salary-table">

                <thead className="table-dark">
                  <tr>
                    <th>
                      Description
                    </th>

                    <th className="text-end">
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody>

                  <tr>
                    <td>
                      Gross Salary
                    </td>

                    <td className="text-end fw-bold">
                      {formatMoney(
                        payroll.grossSalary
                      )}{" "}
                      ETB
                    </td>
                  </tr>

                  <tr>
                    <td>
                      Tax
                    </td>

                    <td className="text-end text-danger">
                      -{" "}
                      {formatMoney(
                        payroll.tax
                      )}{" "}
                      ETB
                    </td>
                  </tr>

                  <tr>
                    <td>
                      Pension
                    </td>

                    <td className="text-end text-danger">
                      -{" "}
                      {formatMoney(
                        payroll.pension
                      )}{" "}
                      ETB
                    </td>
                  </tr>

                  <tr>
                    <td>
                      Salary Advance
                    </td>

                    <td className="text-end text-danger">
                      -{" "}
                      {formatMoney(
                        payroll.salaryAdvance
                      )}{" "}
                      ETB
                    </td>
                  </tr>

                  <tr>
                    <td>
                      Other Deduction
                    </td>

                    <td className="text-end text-danger">
                      -{" "}
                      {formatMoney(
                        payroll.otherDeduction
                      )}{" "}
                      ETB
                    </td>
                  </tr>

                  <tr className="table-success net-row">
                    <th>
                      Net Salary
                    </th>

                    <th className="text-end">
                      {formatMoney(
                        payroll.netSalary
                      )}{" "}
                      ETB
                    </th>
                  </tr>

                </tbody>
              </table>
            </div>

            {/* NET SALARY BOX */}

            <div className="net-box mt-4">
              <div className="net-label">
                NET SALARY
              </div>

              <div className="net-value">
                {formatMoney(
                  payroll.netSalary
                )}{" "}
                ETB
              </div>
            </div>

            {/* FOOTER */}

            <div className="text-center text-muted mt-5">
              <small>
                This payslip is electronically
                generated and does not require
                a signature.
              </small>

              <br />

              <small>
                © Coca-Cola Payroll System
              </small>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default Payslip;

