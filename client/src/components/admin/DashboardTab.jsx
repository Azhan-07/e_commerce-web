import { HiOutlineShoppingBag, HiOutlineCurrencyDollar, HiOutlineUsers, HiOutlineClipboardDocumentList, HiOutlineArrowTrendingUp, HiOutlineClock } from "react-icons/hi2";

const DashboardTab = ({ stats }) => {
  if (!stats) return null;

  const statCards = [
    { label: "Revenue", value: `$${stats.revenue.toFixed(2)}`, icon: HiOutlineCurrencyDollar, gradient: "from-emerald-500 to-green-600" },
    { label: "Orders", value: stats.totalOrders, icon: HiOutlineClipboardDocumentList, gradient: "from-blue-500 to-blue-600" },
    { label: "Customers", value: stats.totalUsers || 0, icon: HiOutlineUsers, gradient: "from-purple-500 to-purple-600" },
    { label: "Products", value: stats.totalProducts, icon: HiOutlineShoppingBag, gradient: "from-amber-500 to-orange-600" },
    { label: "Today's Orders", value: stats.todayOrders || 0, icon: HiOutlineArrowTrendingUp, gradient: "from-pink-500 to-rose-600" },
    { label: "Pending", value: stats.pendingOrders, icon: HiOutlineClock, gradient: "from-yellow-500 to-amber-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statCards.map((stat, i) => (
          <div
            key={stat.label}
            className="border rounded-xl p-4 dark:border-gray-800 hover:shadow-lg transition-all duration-300 animate-slide-up group"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-semibold mb-4">Recent Orders</h3>
        <div className="space-y-2">
          {stats.recentOrders.map((order, i) => (
            <div
              key={order._id}
              className="border rounded-lg p-3 dark:border-gray-800 flex items-center justify-between text-sm hover:border-primary-200 dark:hover:border-primary-900/30 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center space-x-3">
                <span className="font-medium">{order.customerName}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  order.orderStatus === "delivered" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                  order.orderStatus === "cancelled" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                  "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                }`}>
                  {order.orderStatus}
                </span>
              </div>
              <span className="font-semibold">${order.totalPrice.toFixed(2)}</span>
              <span className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
