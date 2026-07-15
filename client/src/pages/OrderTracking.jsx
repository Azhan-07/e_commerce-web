import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import API from "../utils/api";
import toast from "react-hot-toast";
import { HiOutlineCheckCircle, HiOutlineClock, HiOutlineTruck, HiOutlineXCircle } from "react-icons/hi2";

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
      setOrders(data.data || []);
      if (!data.data || data.data.length === 0) {
        toast.info("No orders found with this email");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "processing":
        return {
          color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
          icon: HiOutlineClock,
          stepIndex: 0,
        };
      case "shipped":
        return {
          color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
          icon: HiOutlineTruck,
          stepIndex: 1,
        };
      case "delivered":
        return {
          color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
          icon: HiOutlineCheckCircle,
          stepIndex: 2,
        };
      case "cancelled":
        return {
          color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
          icon: HiOutlineXCircle,
          stepIndex: -1,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700 dark:bg-dark-800 dark:text-gray-400",
          icon: HiOutlineClock,
          stepIndex: 0,
        };
    }
  };

  const statusSteps = [
    { key: "processing", label: "Processing" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
  ];

  return (
    <div className="container-custom py-12 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold mb-3 page-enter">Track Your Order</h1>
          <p className="text-gray-500 dark:text-gray-400 animate-slide-up">
            Enter your email address to check the status of your order
          </p>
        </div>

        <form onSubmit={handleSearch} className="bg-white dark:bg-dark-900 border rounded-2xl p-8 dark:border-gray-800 mb-8 animate-slide-up hover:shadow-lg transition-shadow duration-300 glow-border">
          <div className="flex gap-4">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className="input-field flex-1 input-glow"
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
          <div className="text-center py-12 animate-fade-in">
            <div className="w-12 h-12 border-4 border-primary-950 dark:border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Searching for your orders...</p>
          </div>
        )}

        {searched && !loading && orders.length === 0 && (
          <div className="text-center py-12 animate-scale-in">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-dark-800 rounded-full flex items-center justify-center">
              <HiOutlineClock className="w-8 h-8 text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-4">No orders found with this email address</p>
            <Link to="/shop" className="btn-primary btn-ripple inline-block">
              Continue Shopping
            </Link>
          </div>
        )}

        {orders.length > 0 && (
          <div className="space-y-6 animate-slide-up">
            <h2 className="font-semibold text-lg">Your Orders ({orders.length})</h2>
            {orders.map((order, index) => {
              const statusConfig = getStatusConfig(order.orderStatus);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={order._id}
                  className="border rounded-2xl p-6 dark:border-gray-800 hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-6">
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
                    <span className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-sm font-medium ${statusConfig.color}`}>
                      <StatusIcon className="w-4 h-4" />
                      <span>{order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}</span>
                    </span>
                  </div>

                  {/* Timeline */}
                  {order.orderStatus !== "cancelled" && (
                    <div className="flex items-center mb-6 px-4">
                      {statusSteps.map((s, i) => {
                        const isActive = statusSteps.findIndex(x => x.key === order.orderStatus) >= i;
                        const isCurrent = s.key === order.orderStatus;
                        return (
                          <div key={s.key} className="flex items-center flex-1">
                            <div className="flex flex-col items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                                isActive
                                  ? "bg-primary-950 text-white dark:bg-white dark:text-dark-950 shadow-lg"
                                  : "bg-gray-200 dark:bg-dark-800 text-gray-400"
                              } ${isCurrent ? "ring-4 ring-primary-200 dark:ring-primary-900/50 scale-110" : ""}`}>
                                {isActive ? "✓" : i + 1}
                              </div>
                              <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5 whitespace-nowrap">{s.label}</span>
                            </div>
                            {i < statusSteps.length - 1 && (
                              <div className={`flex-1 h-0.5 mx-2 mb-5 transition-colors duration-500 ${
                                statusSteps.findIndex(x => x.key === order.orderStatus) > i
                                  ? "bg-primary-950 dark:bg-white"
                                  : "bg-gray-200 dark:bg-dark-800"
                              }`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

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
                        <div key={i} className="flex items-center space-x-3 text-sm hover:bg-gray-50 dark:hover:bg-dark-800 p-2 rounded-lg transition-colors">
                          {item.image && (
                            <img src={item.image} alt={item.title} className="w-10 h-10 rounded-lg object-cover" />
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
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm text-blue-700 dark:text-blue-400 flex items-center space-x-2">
                      <HiOutlineTruck className="w-5 h-5 flex-shrink-0" />
                      <span>
                        Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
