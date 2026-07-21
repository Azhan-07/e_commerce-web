import { useState } from "react";
import toast from "react-hot-toast";

const CreateAdminTab = ({ onSubmit, onCancel }) => {
  const [form, setForm] = useState({ fullname: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullname.trim()) return toast.error("Name is required");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return toast.error("Valid email is required");
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");

    setLoading(true);
    try {
      await onSubmit(form);
      setForm({ fullname: "", email: "", password: "" });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
      <h2 className="font-semibold text-lg">Create New Admin</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">New admins will have full access to manage the store.</p>

      <div>
        <label className="text-sm font-medium mb-2 block">Full Name</label>
        <input type="text" value={form.fullname} onChange={(e) => setForm({ ...form, fullname: e.target.value })} className="input-field input-glow" placeholder="Admin name" required />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Email</label>
        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field input-glow" placeholder="admin@example.com" required />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Password</label>
        <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field input-glow" placeholder="Min 6 characters" required />
      </div>

      <div className="flex space-x-4">
        <button type="submit" disabled={loading} className="btn-primary btn-ripple">
          {loading ? "Creating..." : "Create Admin"}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CreateAdminTab;
