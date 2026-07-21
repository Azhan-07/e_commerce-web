import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import toast from "react-hot-toast";
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineUser, HiOutlinePhone } from "react-icons/hi2";

const Register = () => {
  const [form, setForm] = useState({ fullname: "", email: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullname.trim()) return toast.error("Name is required");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return toast.error("Valid email is required");
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");

    setLoading(true);
    try {
      await register(form.fullname, form.email, form.password, form.phone);
      toast.success("Account created! Welcome to KING");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary-200/20 dark:bg-primary-900/10 rounded-full blur-3xl floating-shape" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-100/30 dark:bg-primary-800/5 rounded-full blur-3xl animate-float-delayed" />

      <div className="w-full max-w-md relative z-10 animate-scale-in">
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-4xl font-bold hover:scale-105 inline-block transition-transform duration-300">
            <span className="text-gradient">KING</span>
          </Link>
          <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm tracking-wide">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 hover:shadow-2xl transition-all duration-500">
          <h2 className="font-semibold text-xl mb-6">Sign Up</h2>

          <div className="space-y-4">
            <div className="animate-slide-up" style={{ animationDelay: "50ms" }}>
              <label className="text-sm font-medium mb-2 block">Full Name</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" name="fullname" value={form.fullname} onChange={handleChange} className="input-field pl-10" placeholder="John Doe" required />
              </div>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <div className="relative">
                <HiOutlineEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field pl-10" placeholder="you@example.com" required />
              </div>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: "150ms" }}>
              <label className="text-sm font-medium mb-2 block">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} className="input-field pl-10" placeholder="At least 6 characters" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600">
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
              <label className="text-sm font-medium mb-2 block">Phone <span className="text-gray-400">(optional)</span></label>
              <div className="relative">
                <HiOutlinePhone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="input-field pl-10" placeholder="+1 (234) 567-890" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary btn-ripple w-full mt-6">
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
            <Link to="/login" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
