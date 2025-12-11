import StatCard from "../../components/Dashboard/StatCard";
import SalesChart from "../../components/Dashboard/SalesChart";
import RecentOrders from "../../components/Dashboard/RecentOrders";

import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <div className="dashboard">
        {/* Top Summary Cards */}
        <div className="stats-grid">
          <StatCard title="Total Orders" value="120" />
          <StatCard title="Total Users" value="52" />
          <StatCard title="Revenue Today" value="$340" />
          <StatCard title="Products" value="24" />
        </div>

        {/* Charts + Recent Orders */}
        <div className="main-grid">
          <SalesChart />
          <RecentOrders />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
