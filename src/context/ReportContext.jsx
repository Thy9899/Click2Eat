import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

const ReportContext = createContext();

export const ReportProvider = ({ children }) => {
  const [dailySales, setDailySales] = useState([]);
  const { user } = useContext(AuthContext);
  const [monthlySales, setMonthlySales] = useState([]);
  const [orderStatus, setOrderStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get token from localStorage
  const getToken = () => localStorage.getItem("token");

  // Fetch reports from backend
  const fetchReports = async () => {
    if (!user || user.role !== "admin") {
      // User is not admin, don't fetch and optionally redirect
      setError("You do not have permission to view reports.");
      return;
    }

    setLoading(true);
    setError(null);

    const config = {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    };

    try {
      const [dailyRes, monthlyRes, statusRes] = await Promise.all([
        axios.get(
          "https://click2eat-backend-report-service.onrender.com/api/reports/daily-sales",
          config
        ),
        axios.get(
          "https://click2eat-backend-report-service.onrender.com/api/reports/monthly-sales",
          config
        ),
        axios.get(
          "https://click2eat-backend-report-service.onrender.com/api/reports/order-status",
          config
        ),
      ]);

      setDailySales(dailyRes.data.report || []);
      setMonthlySales(monthlyRes.data.report || []);
      setOrderStatus(statusRes.data.report || {});
    } catch (err) {
      console.error("ReportContext Error:", err);
      setError("Failed to fetch reports. Make sure you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch reports on mount (Only Admin)
  useEffect(() => {
    if (user?.role === "admin") {
      fetchReports();
    }
  }, [user]);

  return (
    <ReportContext.Provider
      value={{
        dailySales,
        monthlySales,
        orderStatus,
        loading,
        error,
        refreshReports: fetchReports, // call this to manually refresh
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

// Custom hook to use reports easily
export const useReports = () => useContext(ReportContext);
