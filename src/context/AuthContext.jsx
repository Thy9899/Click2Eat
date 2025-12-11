import { createContext, useState, useEffect, useRef } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const logoutTimer = useRef(null);

  // Auto start logout timer on refresh
  useEffect(() => {
    if (token) {
      const loginTime = localStorage.getItem("loginTime");

      if (loginTime) {
        const elapsed = Date.now() - parseInt(loginTime, 10);
        const remaining = 3600000 - elapsed;

        if (remaining > 0) {
          startAutoLogout(remaining);
        } else {
          logout();
        }
      }
    }
  }, [token]);

  const startAutoLogout = (duration) => {
    clearTimeout(logoutTimer.current);
    logoutTimer.current = setTimeout(() => {
      alert("Session expired. You have been logged out.");
      logout();
    }, duration);
  };

  // ──────────────────────────────
  // LOGIN
  // ──────────────────────────────
  const login = async (email, password) => {
    const res = await axios.post(
      "https://click2eat-backend-admin-service.onrender.com/api/admins/login",
      {
        email,
        password,
      }
    );

    const token = res.data.token;
    const userData = res.data.user;

    setToken(token);
    setUser(userData);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("loginTime", Date.now().toString());

    startAutoLogout(3600000);
  };

  // ──────────────────────────────
  // REGISTER
  // ──────────────────────────────
  const register = async (email, username, password) => {
    await axios.post(
      "https://click2eat-backend-admin-service.onrender.com/api/admins/register",
      {
        email,
        username,
        password,
      }
    );
  };

  // ──────────────────────────────
  // LOGOUT
  // ──────────────────────────────
  const logout = () => {
    setUser(null);
    setToken(null);

    clearTimeout(logoutTimer.current);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("loginTime");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
