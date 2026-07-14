import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Register = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await register(fullname, email, password);
      toast.success("Account created!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
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
            Create your account
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-dark-900 border rounded-2xl p-8 dark:border-gray-800 hover:shadow-xl transition-shadow duration-500"
        >
          <h2 className="font-semibold text-xl mb-6">Sign Up</h2>

          <div className="space-y-4">
            {[
              { label: "Full Name", value: fullname, setter: setFullname, type: "text", delay: "50ms" },
              { label: "Email", value: email, setter: setEmail, type: "email", delay: "100ms" },
              { label: "Password", value: password, setter: setPassword, type: "password", delay: "150ms" },
              { label: "Confirm Password", value: confirmPassword, setter: setConfirmPassword, type: "password", delay: "200ms" },
            ].map((field) => (
              <div key={field.label} className="animate-slide-up" style={{ animationDelay: field.delay }}>
                <label className="text-sm font-medium mb-2 block">{field.label}</label>
                <input
                  type={field.type}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  className="input-field"
                  minLength={field.type === "password" ? 6 : undefined}
                  required
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary btn-ripple w-full mt-6"
          >
            {loading ? (
              <span className="flex items-center justify-center space-x-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating account...</span>
              </span>
            ) : (
              "Create Account"
            )}
          </button>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
