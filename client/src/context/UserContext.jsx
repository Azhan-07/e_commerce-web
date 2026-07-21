import { createContext, useContext, useState, useEffect } from "react";
import API from "../utils/api";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        API.defaults.headers.common["Authorization"] = `Bearer ${parsed.token}`;
      } catch (error) {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const register = async (fullname, email, password, phone) => {
    const { data } = await API.post("/user-auth/register", { fullname, email, password, phone });
    const userData = data.data;
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    API.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
    return userData;
  };

  const login = async (email, password) => {
    const { data } = await API.post("/user-auth/login", { email, password });
    const userData = data.data;
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    API.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    delete API.defaults.headers.common["Authorization"];
  };

  const updateProfile = async (updates) => {
    const { data } = await API.put("/user-auth/profile", updates);
    const updatedUser = { ...user, ...data.data };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    return data.data;
  };

  const getMyOrders = async () => {
    const { data } = await API.get("/user-auth/my-orders");
    return data.data;
  };

  return (
    <UserContext.Provider value={{ user, loading, register, login, logout, updateProfile, getMyOrders }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
