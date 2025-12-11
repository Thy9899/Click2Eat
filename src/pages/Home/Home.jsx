import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import "./Home.css";

const Home = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="layout-container">
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <div className="layout-main">
        <Header className={sidebarCollapsed ? "sidebar-collapsed" : ""} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Home;
