import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    password: "",
  });

  useEffect(() => {
    if (tab === "orders") {
      fetchOrders();
    }
  }, [tab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/orders/my-orders");
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updateData = { fullname: form.fullname, email: form.email };
      if (form.password) updateData.password = form.password;
      await updateProfile(updateData);
      toast.success("Profile updated!");
      setForm({ ...form, password: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const tabs = [
    { id: "profile", name: "Profile" },
    { id: "orders", name: "My Orders" },
  ];

  return (
    <div className="container-custom py-8 animate-fade-in">
      <h1 className="font-display text-3xl font-bold mb-8 page-enter">My Account</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-56">
          <nav className="space-y-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab === t.id
                    ? "bg-primary-950 text-white dark:bg-white dark:text-dark-950"
                    : "hover:bg-gray-100 dark:hover:bg-dark-800"
                }`}
              >
                {t.name}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              Logout
            </button>
          </nav>
        </aside>

        <main className="flex-1">
          {tab === "profile" && (
            <form onSubmit={handleUpdate} className="max-w-lg space-y-4">
              <h2 className="font-semibold text-lg mb-4">Profile Information</h2>
              <div>
                <label className="text-sm font-medium mb-2 block">Full Name</label>
                <input
                  type="text"
                  value={form.fullname}
                  onChange={(e) => setForm({ ...form, fullname: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  New Password (leave blank to keep current)
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field"
                />
              </div>
              <button type="submit" className="btn-primary btn-ripple">
                Update Profile
              </button>
            </form>
          )}

          {tab === "orders" && (
            <div>
              <h2 className="font-semibold text-lg mb-4">Order History</h2>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border rounded-xl p-4 dark:border-gray-800">
                      <div className="h-4 skeleton w-1/3 mb-2" />
                      <div className="h-3 skeleton w-1/4" />
                    </div>
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    No orders yet
                  </p>
                  <Link to="/shop" className="btn-primary inline-block">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="border rounded-xl p-4 dark:border-gray-800"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            order.orderStatus === "delivered"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : order.orderStatus === "shipped"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              : order.orderStatus === "cancelled"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 mb-2">
                        {order.products.slice(0, 3).map((item, i) => (
                          <img
                            key={i}
                            src={item.image || "/placeholder.png"}
                            alt={item.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ))}
                        {order.products.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{order.products.length - 3} more
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          {order.products.length} item(s)
                        </span>
                        <span className="font-semibold">
                          ${order.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
