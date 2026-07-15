import { HiOutlineShoppingBag, HiOutlineCurrencyDollar, HiOutlineUsers, HiOutlineClipboardDocumentList } from "react-icons/hi2";

const DashboardTab = ({ stats }) => {
  if (!stats) return null;

  const statCards = [
    { label: "Products", value: stats.totalProducts, icon: HiOutlineShoppingBag, gradient: "from-blue-500 to-blue-600" },
    { label: "Orders", value: stats.totalOrders, icon: HiOutlineClipboardDocumentList, gradient: "from-amber-500 to-orange-600" },
    { label: "Users", value: stats.totalAdmins, icon: HiOutlineUsers, gradient: "from-purple-500 to-purple-600" },
    { label: "Revenue", value: `$${stats.revenue.toFixed(2)}`, icon: HiOutlineCurrencyDollar, gradient: "from-green-500 to-emerald-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <span className="font-medium">{order.customerName}</span>
              <span className="font-semibold">${order.totalPrice.toFixed(2)}</span>
              <span className="text-xs text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
