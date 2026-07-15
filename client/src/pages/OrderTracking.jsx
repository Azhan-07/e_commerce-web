import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import API from "../utils/api";
import toast from "react-hot-toast";

const OrderTracking = () => {
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [form, setForm] = useState({
    email: searchParams.get("email") || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!form.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      toast.error("Please provide a valid email");
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const { data } = await API.get(`/orders/track/${form.email}`);
      setOrders(data);
      if (data.length === 0) {
        toast.info("No orders found with this email");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "processing":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "shipped":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "delivered":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-dark-800 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "processing":
        return "⏳";
      case "shipped":
        return "📦";
      case "delivered":
        return "✅";
      case "cancelled":
        return "❌";
      default:
        return "📋";
    }
  };

  return (
    <div className="container-custom py-12 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold mb-3">Track Your Order</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Enter your email address to check the status of your order
          </p>
        </div>

        <form onSubmit={handleSearch} className="bg-white dark:bg-dark-900 border rounded-2xl p-8 dark:border-gray-800 mb-8 animate-slide-up">
          <div className="flex gap-4">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className="input-field flex-1"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary btn-ripple whitespace-nowrap"
            >
              {loading ? "Searching..." : "Track Order"}
            </button>
          </div>
        </form>

        {loading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary-950 dark:border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Searching for your orders...</p>
          </div>
        )}

        {searched && !loading && orders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No orders found with this email address</p>
            <Link to="/shop" className="btn-primary inline-block">
              Continue Shopping
            </Link>
          </div>
        )}

        {orders.length > 0 && (
          <div className="space-y-4 animate-slide-up">
            <h2 className="font-semibold text-lg mb-4">Your Orders ({orders.length})</h2>
            {orders.map((order, index) => (
              <div
                key={order._id}
                className="border rounded-2xl p-6 dark:border-gray-800 hover:shadow-lg transition-shadow duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">Order #{order._id.slice(-8).toUpperCase()}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                      <span>{getStatusIcon(order.orderStatus)}</span>
                      <span>{order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 mb-1">Customer Name</p>
                    <p className="font-medium">{order.customerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 mb-1">Phone</p>
                    <p className="font-medium">{order.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 mb-1">Shipping City</p>
                    <p className="font-medium">{order.shippingAddress.city}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 mb-1">Country</p>
                    <p className="font-medium">{order.shippingAddress.country}</p>
                  </div>
                </div>

                <div className="border-t dark:border-gray-800 pt-4 mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Items in this order:</p>
                  <div className="space-y-2">
                    {order.products.map((item, i) => (
                      <div key={i} className="flex items-center space-x-3 text-sm">
                        {item.image && (
                          <img src={item.image} alt={item.title} className="w-10 h-10 rounded object-cover" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Qty: {item.quantity} x ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-dark-800 rounded-lg p-4 space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                    <span>${(order.totalPrice / 1.08).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Tax</span>
                    <span>${(order.totalPrice / 1.08 * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="border-t dark:border-gray-700 pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {order.estimatedDelivery && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm text-blue-700 dark:text-blue-400">
                    📅 Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
