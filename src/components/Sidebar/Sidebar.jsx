import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Sidebar.css";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  // Load theme from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
    document.body.classList.toggle("dark-mode", savedMode);
  }, []);

  // Toggle theme
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.body.classList.toggle("dark-mode", newMode);
    localStorage.setItem("darkMode", newMode);
  };

  const menuItems = [
    { name: "Dashboard", path: "/", icon: "bx bx-home" },
    { name: "Customers", path: "customers", icon: "bx bx-user" },
    { name: "Payment", path: "payment", icon: "bx bx-wallet" },
    { name: "Stock", path: "stock", icon: "bx bx-store" },
    { name: "Order", path: "order", icon: "bx bx-heart" },
    { name: "Report", path: "report", icon: "bx bx-bar-chart" },
    { name: "Setting", path: "setting", icon: "bx bx-cog" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Header */}
      <header className="sidebar-header">
        <div className="sidebar-logo">
          <img
            src="https://img.freepik.com/premium-vector/cute-bear-cartoon-vector-illustration_921448-901.jpg"
            alt="Logo"
            className="logo-img"
          />
          {!collapsed && <span className="logo-text">Click2Eat</span>}
        </div>

        {/* Collapse button */}
        <i
          className="bx bx-chevron-left toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
        ></i>
      </header>

      <hr />

      {/* Menu Links */}
      <ul className="menu-links">
        {menuItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `menu-link ${isActive ? "active" : ""}`
              }
            >
              <i className={item.icon}></i>
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Logout */}
      <div className="bottom-content">
        {/* Dark Mode Toggle */}
        <div
          className={`theme-toggle ${collapsed ? "collapsed-btn" : ""}`}
          onClick={toggleDarkMode}
        >
          <i className={`bx ${darkMode ? "bx-moon" : "bx-sun"}`}></i>
          {!collapsed && <span>{darkMode ? "Dark Mode" : "Light Mode"}</span>}
        </div>

        <button
          onClick={handleLogout}
          className={`logout-btn ${collapsed ? "collapsed-btn" : ""}`}
        >
          <i className="bx bx-log-out"></i>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
