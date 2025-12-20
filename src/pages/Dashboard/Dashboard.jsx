import React from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useReports } from "../../context/ReportContext";
import "./Dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { dailySales, monthlySales, orderStatus, loading, error } =
    useReports();

  // Convert orderStatus object to array
  const orderStatusArray = Object.entries(orderStatus).map(
    ([status, users]) => ({
      status,
      totalOrders: users.length,
    })
  );

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>

      {loading ? (
        // SHOW LOADING SPINNER
        <div className="spinner-border text-info spinner-center"></div>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <div className="chart-grid">
            {/* Daily Sales Line Chart */}
            <div className="chart-card">
              <h3 className="chart-title">Daily Sales</h3>
              <Line
                data={{
                  labels: dailySales.map((d) => d._id.date), // FIXED
                  datasets: [
                    {
                      label: "Sales ($)",
                      data: dailySales.map((d) => d.totalSales),
                      borderColor: "#4e73df",
                      backgroundColor: "rgba(78, 115, 223, 0.2)",
                      tension: 0.3,
                      fill: true,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { position: "top" } },
                }}
              />
            </div>

            {/* Order Status Pie Chart */}
            <div className="chart-card">
              <h3 className="chart-title">Order Status</h3>
              <Pie
                data={{
                  labels: orderStatusArray.map((s) => s.status), // FIXED
                  datasets: [
                    {
                      data: orderStatusArray.map((s) => s.totalOrders), // FIXED
                      backgroundColor: [
                        "#36A2EB",
                        "#FF6384",
                        "#FFCE56",
                        "#4BC0C0",
                      ],
                      hoverOffset: 10,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { position: "bottom" } },
                }}
              />
            </div>

            {/* Monthly Sales Bar Chart */}
            <div className="chart-card full-width">
              <h3 className="chart-title">Monthly Sales</h3>
              <Bar
                data={{
                  labels: monthlySales.map((m) => m._id), // _id is string "YYYY-MM"
                  datasets: [
                    {
                      label: "Sales ($)",
                      data: monthlySales.map((m) => m.totalSales),
                      backgroundColor: "#1cc88a",
                      borderRadius: 5,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
