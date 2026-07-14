import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-primary-950 dark:border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return user && user.role === "admin" ? children : <Navigate to="/" />;
};

export default AdminRoute;
