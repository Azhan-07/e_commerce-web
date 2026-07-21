import { useState } from "react";
import API from "../../utils/api";
import toast from "react-hot-toast";

const UsersTab = ({ users, onDeleteUser, onAddAdmin }) => {
  const [search, setSearch] = useState("");
  const [viewingUser, setViewingUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const filtered = users.filter(
    (u) =>
      u.fullname?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewOrders = async (user) => {
    setViewingUser(user);
    setLoadingOrders(true);
    try {
      const { data } = await API.get(`/user-auth/admin/users/${user._id}`);
      setUserOrders(data.data.orders || []);
    } catch (error) {
      toast.error("Failed to load orders");
      setUserOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">All Users ({filtered.length})</h2>
        <button onClick={onAddAdmin} className="btn-primary btn-ripple text-sm">
          + Add Admin
        </button>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search users by name or email..."
        className="input-field text-sm"
      />

      <div className="space-y-2">
        {filtered.map((u, i) => (
          <div
            key={u._id}
            className="border rounded-xl p-4 dark:border-gray-800 flex items-center justify-between hover:shadow-md hover:border-primary-200 dark:hover:border-primary-900/30 transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-200 to-primary-400 dark:from-primary-800 dark:to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                {u.fullname?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-medium text-sm">{u.fullname}</p>
                <p className="text-xs text-gray-500">{u.email}</p>
                <p className="text-xs text-gray-400">
                  Joined {new Date(u.createdAt).toLocaleDateString()}
                  {u.lastLogin && ` | Last login: ${new Date(u.lastLogin).toLocaleDateString()}`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${
                  u.role === "admin"
                    ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                    : "bg-gray-100 text-gray-600 dark:bg-dark-800 dark:text-gray-400"
                }`}
              >
                {u.role}
              </span>

              <button
                onClick={() => handleViewOrders(u)}
                className="px-3 py-1 text-xs border rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
              >
                Orders
              </button>

              <button
                onClick={() => onDeleteUser(u._id)}
                className="px-3 py-1 text-xs text-red-500 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {viewingUser && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setViewingUser(null)}>
          <div className="bg-white dark:bg-dark-900 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">
                Orders by {viewingUser.fullname}
              </h3>
              <button onClick={() => setViewingUser(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg">✕</button>
            </div>

            {loadingOrders ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-primary-950 dark:border-white border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : userOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No orders found for this user</p>
            ) : (
              <div className="space-y-3">
                {userOrders.map((order) => (
                  <div key={order._id} className="border rounded-xl p-4 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">#{order._id.slice(-8).toUpperCase()}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        order.orderStatus === "delivered" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                        order.orderStatus === "cancelled" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}>
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    <div className="mt-2 space-y-1">
                      {order.products.map((item, j) => (
                        <p key={j} className="text-xs">{item.title} x {item.quantity}</p>
                      ))}
                    </div>
                    <p className="text-sm font-semibold mt-2">${order.totalPrice.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTab;
