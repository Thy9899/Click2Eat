import React, { useState, useEffect } from "react";
import { useReports } from "../../context/ReportContext";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./ReportPage.css";

const ReportPage = () => {
  const {
    dailySales,
    monthlySales,
    orderStatus,
    loading,
    error,
    refreshReports,
  } = useReports();

  const [reportType, setReportType] = useState("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusType, setStatusType] = useState("completed");
  const [filteredData, setFilteredData] = useState([]);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    refreshReports(); // fetch reports when component mounts
  }, []);

  // ==========================
  // Check if date is in range
  // ==========================
  const isInDateRange = (date) => {
    if (!startDate && !endDate) return true;
    const d = new Date(date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (start && d < start) return false;
    if (end && d > end) return false;
    return true;
  };

  // ==========================
  // Apply filter
  // ==========================
  const handleApplyFilter = () => {
    let data = [];

    if (reportType === "daily") {
      data = dailySales.filter((item) => isInDateRange(item._id.date));
    } else if (reportType === "monthly") {
      data = monthlySales.filter((item) => {
        const d = new Date(item._id + "-01");
        return isInDateRange(d);
      });
    } else if (reportType === "status") {
      data = Object.entries(orderStatus)
        .filter(([status]) => status === statusType)
        .map(([status, users]) => ({ status, users }));
    }

    setFilteredData(data);
    setIsFilterApplied(true); // If Data Is In Range
    setCurrentPage(1); // reset page
  };

  // ==========================
  // Clear filters
  // ==========================
  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setStatusType("completed");
    setFilteredData([]);
    setIsFilterApplied(false); // reset
    setCurrentPage(1);
  };

  // ==========================
  // Decide which data to display
  // ==========================
  const reportData = isFilterApplied
    ? filteredData
    : reportType === "daily"
    ? dailySales
    : reportType === "monthly"
    ? monthlySales
    : Object.entries(orderStatus).map(([status, users]) => ({ status, users }));

  const getStatusAmount = (users) => {
    return users.reduce((sum, user) => sum + (user.totalSpent || 0), 0);
  };

  // ==========================
  // Download Excel
  // ==========================
  const handleDownloadExcel = () => {
    let dataToExport = [];

    if (reportType === "daily") {
      dailySales.forEach((day) => {
        day.orders.forEach((order, orderIndex) => {
          order.items.forEach((item, itemIndex) => {
            dataToExport.push({
              Date: day._id.date,
              OrderNumber: orderIndex + 1,
              Product: item.name,
              Category: item.category,
              Quantity: item.quantity,
              UnitPrice: item.unit_price,
              TotalPrice: item.total_price,
              Status: order.status,
            });
          });
        });
      });
    } else if (reportType === "monthly") {
      monthlySales.forEach((month) => {
        dataToExport.push({
          Month: month._id,
          TotalOrders: month.totalOrders,
          TotalSales: month.totalSales,
        });
      });
    } else if (reportType === "status") {
      // Convert object to array
      Object.entries(orderStatus).forEach(([status, users]) => {
        users.forEach((user) => {
          dataToExport.push({
            Status: status,
            CustomerID: user.customer_id,
            Email: user.email,
            Phone: user.phone || "N/A",
            TotalOrders: user.totalOrders,
            TotalItems: user.totalItems,
            TotalSpent: user.totalSpent,
            LastOrderDate: new Date(user.lastOrderDate).toLocaleString(),
          });
        });
      });
    }

    // Create Excel file
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `Report_${reportType}_${new Date().toISOString()}.xlsx`);
  };

  // ==========================
  // PAGINATION
  // ==========================
  const totalPages = Math.ceil(reportData.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = reportData.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <h2>Reports</h2>
      <div className="report-container">
        {/* ================= Filter Section ================= */}
        {/* LOADING SPINNER */}
        {loading ? (
          // SHOW LOADING SPINNER
          <div className="spinner-border text-info spinner-center"></div>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <div className="report-filter">
              <div className="filter-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="filter-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div className="line"></div>

              <div className="filter-group">
                <label>Report Type</label>
                <select
                  value={reportType}
                  onChange={(e) => {
                    setReportType(e.target.value);
                    setFilteredData([]);
                    setCurrentPage(1); // reset page
                  }}
                >
                  <option value="daily">Daily Sales</option>
                  <option value="monthly">Monthly Sales</option>
                  <option value="status">Order Status</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Status Type</label>
                <select
                  value={statusType}
                  onChange={(e) => setStatusType(e.target.value)}
                  disabled={reportType !== "status"}
                >
                  <option value="completed">Completed</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <button className="btn-apply" onClick={handleApplyFilter}>
                Apply
              </button>
              <button className="btn-clear" onClick={handleClearFilter}>
                Clear
              </button>
              <button className="btn-download" onClick={handleDownloadExcel}>
                Download Excel
              </button>
            </div>

            {/* ================= Report Cards ================= */}
            <div className="report-cards">
              <div className="report-card">
                <h4>Daily Sales</h4>
                <p>Records</p>
                <span>{dailySales.length}</span>
              </div>
              <div className="report-card">
                <h4>Monthly Sales</h4>
                <p>Records</p>
                <span>{monthlySales.length}</span>
              </div>
              <div className="report-card">
                <h4>Order Status</h4>
                <p>Types</p>
                <span>{Object.keys(orderStatus).length}</span>
              </div>
            </div>

            {/* ================= Table Section ================= */}
            <div className="report-table">
              <h3>Report Details</h3>
              <table>
                <thead>
                  <tr>
                    {reportType === "status" && <th>Status</th>}
                    {reportType !== "status" && <th>Date</th>}
                    <th>Total Orders</th>
                    {reportType !== "status" && <th>Total Sales</th>}
                    {reportType === "status" && <th>Total Amount</th>}
                  </tr>
                </thead>
                <tbody>
                  {reportData.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center" }}>
                        {isFilterApplied
                          ? "No data found for selected date range"
                          : "No data available"}
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((item, index) => (
                      <tr key={index}>
                        {reportType === "status" ? (
                          <td>{item.status}</td>
                        ) : (
                          <td>
                            {reportType === "daily" ? item._id.date : item._id}
                          </td>
                        )}

                        <td>
                          {reportType === "status"
                            ? item.users.length
                            : item.totalOrders}
                        </td>

                        <td>
                          {reportType === "status"
                            ? `$${getStatusAmount(item.users).toFixed(2)}`
                            : `$${item.totalSales.toFixed(2)}`}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* ======================== PAGINATION ========================= */}
              <div className="pagination-container mt-3">
                <ul className="pagination">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => goToPage(currentPage - 1)}
                    >
                      Previous
                    </button>
                  </li>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <li
                      key={i}
                      className={`page-item ${
                        currentPage === i + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => goToPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}

                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => goToPage(currentPage + 1)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportPage;
