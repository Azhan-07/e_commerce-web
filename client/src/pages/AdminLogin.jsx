/**
 * Admin Login Page
 */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please provide a valid email");
      return;
    }
    if (!password) {
      toast.error("Password is required");
      return;
    }

    setLoading(true);
    try {
      await adminLogin(email, password);
      toast.success("Admin login successful!");
      navigate("/admin");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950" />
      
      {/* Floating decorative shapes */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary-200/20 dark:bg-primary-900/10 rounded-full blur-3xl floating-shape" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-100/30 dark:bg-primary-800/5 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-gray-200/20 dark:bg-white/5 rounded-full blur-2xl animate-float" />

      <div className="w-full max-w-md relative z-10 animate-scale-in">
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-4xl font-bold hover:scale-105 inline-block transition-transform duration-300">
            <span className="text-gradient">KING</span>
          </Link>
          <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm tracking-wide">
            Admin Access Portal
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass rounded-2xl p-8 hover:shadow-2xl transition-all duration-500"
        >
          <h2 className="font-semibold text-xl mb-6">Sign In</h2>

          <div className="space-y-4">
            <div className="animate-slide-up" style={{ animationDelay: "50ms" }}>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field input-glow"
                placeholder="admin@king.com"
                required
              />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
              <label className="text-sm font-medium mb-2 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field input-glow"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary btn-ripple w-full mt-6"
          >
            {loading ? (
              <span className="flex items-center justify-center space-x-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing in...</span>
              </span>
            ) : (
              "Sign In"
            )}
          </button>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            <Link
              to="/"
              className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
            >
              Back to home
            </Link>
          </p>
        </form>

        <div className="mt-6 p-4 bg-gray-50/80 dark:bg-dark-900/80 backdrop-blur-sm rounded-xl animate-slide-up border border-gray-100 dark:border-dark-800" style={{ animationDelay: "200ms" }}>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2">Demo Admin Account:</p>
          <div className="space-y-1 text-xs text-gray-400">
            <p><strong>Email:</strong> admin@king.com</p>
            <p><strong>Password:</strong> admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
