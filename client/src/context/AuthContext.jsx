/**
 * Admin Authentication Context
 * Only handles admin login - no customer authentication
 */

import { createContext, useContext, useState, useEffect } from "react";
import API from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load admin from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("admin");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAdmin(parsed);
        API.defaults.headers.common["Authorization"] = `Bearer ${parsed.token}`;
      } catch (error) {
        console.error("Failed to parse admin data", error);
        localStorage.removeItem("admin");
      }
    }
    setLoading(false);
  }, []);

  const adminLogin = async (email, password) => {
    const { data } = await API.post("/admin-auth/admin-login", { email, password });
    localStorage.setItem("admin", JSON.stringify(data.data));
    setAdmin(data.data);
    API.defaults.headers.common["Authorization"] = `Bearer ${data.data.token}`;
    return data.data;
  };

  const adminLogout = () => {
    localStorage.removeItem("admin");
    setAdmin(null);
    delete API.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{ admin, loading, adminLogin, adminLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
