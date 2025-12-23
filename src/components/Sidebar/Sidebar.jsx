import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Sidebar.css";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);
  const [openOrder, setOpenOrder] = useState(user.role === "user");

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
    {
      name: "Dashboard",
      path: "/",
      icon: "bx bx-home",
      roles: ["admin", "cashier"],
    },
    {
      name: "Customers",
      path: "customers",
      icon: "bx bx-user",
      roles: ["admin", "cashier", "user"],
    },
    {
      name: "Payment",
      path: "payment",
      icon: "bx bx-wallet",
      roles: ["admin", "cashier", "user"],
    },
    {
      name: "Stock",
      path: "stock",
      icon: "bx bx-store",
      roles: ["admin", "cashier", "user"],
    },
    {
      name: "Order",
      path: "order",
      icon: "bx bx-heart",
      roles: ["admin", "cashier", "user"],
      children: [
        {
          name: "View Order",
          path: "/order/view-order",
        },
        { name: "Print receipt", path: "/order/receipt" },
      ],
    },
    {
      name: "Report",
      path: "report",
      icon: "bx bx-bar-chart",
      roles: ["admin", "cashier"],
    },
    {
      name: "Setting",
      path: "setting",
      icon: "bx bx-cog",
      roles: ["admin", "cashier", "user"],
      children: [
        {
          name: "Profile",
          path: "/setting/profile",
        },
        { name: "Users", path: "/setting/users" },
      ],
    },
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
        {menuItems
          .filter((item) => item.roles.includes(user.role))
          .map((item) => (
            <li key={item.name}>
              {/* ORDER DROPDOWN */}
              {item.name === "Order" && item.children ? (
                <>
                  <a
                    className={`menu-link order-dropdown-toggle `}
                    onClick={() => setOpenOrder(!openOrder)}
                  >
                    <i className={item.icon}></i>
                    {!collapsed && <span>{item.name}</span>}
                    {!collapsed && (
                      <i
                        className={`bx bx-chevron-down arrow ${
                          openOrder ? "rotate" : ""
                        }`}
                      ></i>
                    )}
                  </a>

                  {openOrder && !collapsed && (
                    <ul className="submenu">
                      {item.children.map((sub) => (
                        <li key={sub.path}>
                          <NavLink
                            to={sub.path}
                            className={({ isActive }) =>
                              `submenu-link ${isActive ? "active" : ""}`
                            }
                          >
                            <i className="bx bx-radio-circle"></i>
                            {sub.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : item.name === "Setting" &&
                user.role === "admin" &&
                item.children ? (
                <>
                  <a
                    className="menu-link setting-dropdown-toggle"
                    onClick={() => setOpenSetting(!openSetting)}
                  >
                    <i className={item.icon}></i>
                    {!collapsed && <span>{item.name}</span>}
                    {!collapsed && (
                      <i
                        className={`bx bx-chevron-down arrow ${
                          openSetting ? "rotate" : ""
                        }`}
                      ></i>
                    )}
                  </a>

                  {openSetting && !collapsed && (
                    <ul className="submenu">
                      {item.children.map((sub) => (
                        <li key={sub.path}>
                          <NavLink
                            to={sub.path}
                            className={({ isActive }) =>
                              `submenu-link ${isActive ? "active" : ""}`
                            }
                          >
                            <i className="bx  bx-radio-circle"></i>
                            {sub.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                /* NORMAL LINK (User OR non-setting items) */
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `menu-link ${isActive ? "active" : ""}`
                  }
                >
                  <i className={item.icon}></i>
                  {!collapsed && <span>{item.name}</span>}
                </NavLink>
              )}
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
