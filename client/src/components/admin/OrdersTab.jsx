import { useState } from "react";

const OrdersTab = ({ orders, onUpdateStatus }) => {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? orders : orders.filter((o) => o.orderStatus === filter);

  const statusColors = {
    processing: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">All Orders ({filtered.length})</h2>
        <select
          className="input-field text-sm w-32"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filtered.map((order, i) => (
        <div
          key={order._id}
          className="border rounded-xl p-4 dark:border-gray-800 hover:shadow-md transition-all duration-300 animate-slide-up"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold">Order #{order._id.slice(-8).toUpperCase()}</h3>
              <p className="text-xs text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <select
              value={order.orderStatus}
              onChange={(e) => onUpdateStatus(order._id, e.target.value)}
              className="input-field w-auto text-sm"
            >
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Customer</p>
              <p className="font-medium">{order.customerName}</p>
              <p className="text-xs text-gray-500">{order.customerEmail}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Phone</p>
              <p className="font-medium">{order.customerPhone}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Shipping Address</p>
              <p className="font-medium text-xs">{order.shippingAddress.address}</p>
              <p className="text-xs">{order.shippingAddress.city}, {order.shippingAddress.country}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Estimated Delivery</p>
              <p className="font-medium">
                {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-dark-800 rounded-lg p-3 mb-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Items:</p>
            <div className="space-y-1">
              {order.products.map((item, j) => (
                <div key={j} className="flex items-center justify-between text-xs">
                  <span>{item.title} x {item.quantity}</span>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold">Total: ${order.totalPrice.toFixed(2)}</span>
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[order.orderStatus] || statusColors.processing}`}>
              {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersTab;
