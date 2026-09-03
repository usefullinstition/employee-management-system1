import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import "./PayrollHistory.css";
function PayrollHistory() {
  const navigate = useNavigate();

  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================================
  // LOAD PAYROLL HISTORY
  // ================================

  useEffect(() => {
    fetchPayrollHistory();
  }, []);

  const fetchPayrollHistory = async () => {
    try {
      setLoading(true);

      const res = await API.get("/payroll");

      console.log("PAYROLL HISTORY:", res.data);

      // Support different backend response formats
      const data =
        res.data?.payrolls ||
        res.data?.data ||
        res.data ||
        [];

      setPayrolls(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "FETCH PAYROLL HISTORY ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load payroll history"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // FORMAT MONEY
  // ================================

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString(
      undefined,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  // ================================
  // EMPLOYEE NAME
  // ================================

  const getEmployeeName = (payroll) => {
    if (payroll.employee?.name) {
      return payroll.employee.name;
    }

    if (payroll.employeeName) {
      return payroll.employeeName;
    }

    if (
      payroll.employeeId &&
      typeof payroll.employeeId === "object"
    ) {
      return payroll.employeeId.name || "-";
    }

    return "-";
  };

  // ================================
  // EMPLOYEE ID
  // ================================

  const getEmployeeId = (payroll) => {
    if (payroll.employee?.employeeId) {
      return payroll.employee.employeeId;
    }

    if (
      payroll.employeeId &&
      typeof payroll.employeeId === "object"
    ) {
      return (
        payroll.employeeId.employeeId ||
        payroll.employeeId._id ||
        "-"
      );
    }

    return "-";
  };

  // ================================
  // VIEW PAYSLIP
  // ================================

  const viewPayslip = (payroll) => {
    const id =
      payroll._id ||
      payroll.id;

    if (!id) {
      toast.error(
        "Payroll ID not found"
      );
      return;
    }

    navigate(
      `/payroll/${id}/payslip`
    );
  };

  // ================================
  // STATUS
  // ================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Paid":
        return "bg-success";

      case "Draft":
        return "bg-warning text-dark";

      case "Pending":
        return "bg-info text-dark";

      default:
        return "bg-secondary";
    }
  };

  // ================================
  // LOADING
  // ================================

  if (loading) {
    return (
      <div className="payroll-history-page container-fluid mt-4 mb-5">
        <div className="spinner-border" />

        <p className="mt-3">
          Loading payroll history...
        </p>
      </div>
    );
  }

  // ================================
  // RENDER
  // ================================

  return (
    <div className="container-fluid mt-4 mb-5">

      {/* HEADER */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2 className="mb-1">
            Payroll History
          </h2>

          <p className="text-muted mb-0">
            View all created employee payrolls.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() =>
            navigate("/payroll")
          }
        >
          + Create Payroll
        </button>

      </div>


      {/* CARD */}

      <div className="card shadow-sm border-0">

        <div className="card-body">

          {payrolls.length === 0 ? (
            <div className="text-center py-5">

              <div
                style={{
                  fontSize: "50px",
                }}
              >
                📋
              </div>

              <h5 className="mt-3">
                No Payroll History
              </h5>

              <p className="text-muted">
                No payroll records have been
                created yet.
              </p>

              <button
                className="btn btn-primary"
                onClick={() =>
                  navigate("/payroll")
                }
              >
                Create Payroll
              </button>

            </div>
          ) : (

            <div className="table-responsive">

              <table className="table table-hover align-middle">

                <thead className="table-dark">

                  <tr>

                    <th>
                      #
                    </th>

                    <th>
                      Employee
                    </th>

                    <th>
                      Employee ID
                    </th>

                    <th>
                      Month
                    </th>

                    <th className="text-end">
                      Gross Salary
                    </th>

                    <th className="text-end">
                      Tax
                    </th>

                    <th className="text-end">
                      Pension
                    </th>

                    <th className="text-end">
                      Other Deduction
                    </th>

                    <th className="text-end">
                      Net Salary
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {payrolls.map(
                    (payroll, index) => (

                      <tr
                        key={
                          payroll._id ||
                          payroll.id ||
                          index
                        }
                      >

                        <td>
                          {index + 1}
                        </td>

                        <td>
                          <strong>
                            {getEmployeeName(
                              payroll
                            )}
                          </strong>
                        </td>

                        <td>
                          {getEmployeeId(
                            payroll
                          )}
                        </td>

                        <td>
                          {payroll.month ||
                            "-"}
                        </td>

                        <td className="text-end">
                          {formatMoney(
                            payroll.grossSalary
                          )}{" "}
                          ETB
                        </td>

                        <td className="text-end text-danger">
                          -
                          {formatMoney(
                            payroll.tax
                          )}{" "}
                          ETB
                        </td>

                        <td className="text-end text-danger">
                          -
                          {formatMoney(
                            payroll.pension
                          )}{" "}
                          ETB
                        </td>

                        <td className="text-end text-danger">
                          -
                          {formatMoney(
                            payroll.otherDeduction
                          )}{" "}
                          ETB
                        </td>

                        <td className="text-end fw-bold text-success">
                          {formatMoney(
                            payroll.netSalary
                          )}{" "}
                          ETB
                        </td>

                        <td>
                          <span
                            className={`badge ${getStatusClass(
                              payroll.status
                            )}`}
                          >
                            {payroll.status ||
                              "Unknown"}
                          </span>
                        </td>

                        <td>

                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                              viewPayslip(
                                payroll
                              )
                            }
                          >
                            👁️ View Payslip
                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default PayrollHistory;