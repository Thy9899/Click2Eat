import { createContext, useState, useEffect, useRef } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [admins, setAdmins] = useState([]);
  const logoutTimer = useRef(null);

  // ───────── AUTO LOGOUT ─────────
  useEffect(() => {
    if (token) {
      const loginTime = localStorage.getItem("loginTime");
      const elapsed = Date.now() - loginTime;
      const remaining = 3600000 - elapsed;

      if (remaining > 0) startAutoLogout(remaining);
      else logout();
    }
  }, [token]);

  const startAutoLogout = (duration) => {
    clearTimeout(logoutTimer.current);
    logoutTimer.current = setTimeout(() => {
      alert("Session expired");
      logout();
    }, duration);
  };

  // ───────── LOGIN ─────────
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        "https://click2eat-backend-admin-service.onrender.com/api/admins/login",
        { email, password }
      );
      setToken(res.data.token);
      setUser(res.data.user);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("loginTime", Date.now().toString());

      startAutoLogout(3600000);

      return res.data.user;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ───────── REGISTER ─────────
  const register = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        "https://click2eat-backend-admin-service.onrender.com/api/admins/register",
        formData
      );
      return { success: true, data: res.data };
    } catch (err) {
      setError(err.response?.data?.message || "Register failed");
      return { success: false, message: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  // ───────── LOGOUT ─────────
  const logout = () => {
    setUser(null);
    setToken(null);
    clearTimeout(logoutTimer.current);
    localStorage.clear();
  };

  // ───────── FETCH ADMINS ─────────
  const fetchAdmins = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(
        "https://click2eat-backend-admin-service.onrender.com/api/admins/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setAdmins(res.data.data);
        return res.data.data;
      } else {
        setError(res.data.message || "Failed to fetch admins");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        admins,
        login,
        logout,
        register,
        fetchAdmins,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
