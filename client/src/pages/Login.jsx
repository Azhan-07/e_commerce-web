import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 animate-fade-in">
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-3xl font-bold hover:scale-105 inline-block transition-transform duration-300">
            KING
          </Link>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Welcome back
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-dark-900 border rounded-2xl p-8 dark:border-gray-800 hover:shadow-xl transition-shadow duration-500"
        >
          <h2 className="font-semibold text-xl mb-6">Sign In</h2>

          <div className="space-y-4">
            <div className="animate-slide-up" style={{ animationDelay: "50ms" }}>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
              <label className="text-sm font-medium mb-2 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
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
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </form>

        <div className="mt-6 p-4 bg-gray-50 dark:bg-dark-900 rounded-xl animate-slide-up" style={{ animationDelay: "200ms" }}>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2">Demo Accounts:</p>
          <div className="space-y-1 text-xs text-gray-400">
            <p><strong>Admin:</strong> admin@king.com / admin123</p>
            <p><strong>User:</strong> john@example.com / john123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
