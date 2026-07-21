import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import API from "../utils/api";
import toast from "react-hot-toast";
import { HiOutlineUser, HiOutlineShoppingBag, HiOutlineCog6Tooth, HiOutlineCheckCircle, HiOutlineClock, HiOutlineTruck, HiOutlineXCircle, HiOutlineMapPin, HiOutlineStar } from "react-icons/hi2";

const UserDashboard = () => {
  const { user, logout, updateProfile } = useUser();
  const navigate = useNavigate();
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({
    fullname: user?.fullname || "",
    phone: user?.phone || "",
  });
  const [addressForm, setAddressForm] = useState({
    fullName: user?.address?.fullName || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    postalCode: user?.address?.postalCode || "",
    country: user?.address?.country || "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (tab === "orders") fetchOrders();
  }, [tab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await API.get("/user-auth/my-orders");
      setOrders(data.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(profileForm);
      toast.success("Profile updated!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ address: addressForm });
      toast.success("Address updated!");
    } catch (error) {
      toast.error("Failed to update address");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Logged out");
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "processing": return { color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: HiOutlineClock, step: 0 };
      case "confirmed": return { color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: HiOutlineCheckCircle, step: 1 };
      case "shipped": return { color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: HiOutlineTruck, step: 2 };
      case "out_for_delivery": return { color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", icon: HiOutlineTruck, step: 3 };
      case "delivered": return { color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: HiOutlineCheckCircle, step: 4 };
      case "cancelled": return { color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: HiOutlineXCircle, step: -1 };
      default: return { color: "bg-gray-100 text-gray-700 dark:bg-dark-800 dark:text-gray-400", icon: HiOutlineClock, step: 0 };
    }
  };

  const tabs = [
    { id: "orders", name: "My Orders", icon: HiOutlineShoppingBag },
    { id: "profile", name: "Profile", icon: HiOutlineUser },
    { id: "address", name: "Address", icon: HiOutlineMapPin },
    { id: "settings", name: "Settings", icon: HiOutlineCog6Tooth },
  ];

  return (
    <div className="container-custom py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">My Account</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Welcome back, {user?.fullname}</p>
        </div>
        <Link to="/" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">Back to Store</Link>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-56 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center space-x-2 w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  tab === t.id
                    ? "bg-primary-950 text-white dark:bg-white dark:text-dark-950 shadow-lg"
                    : "hover:bg-gray-100 dark:hover:bg-dark-800"
                }`}
              >
                <t.icon className="w-4 h-4" />
                <span>{t.name}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 min-w-0">
          {tab === "orders" && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">Order History</h2>
              {loading ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-2 border-primary-950 dark:border-white border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 border rounded-2xl dark:border-gray-800">
                  <HiOutlineShoppingBag className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No orders yet</p>
                  <Link to="/shop" className="btn-primary btn-ripple inline-block text-sm">Start Shopping</Link>
                </div>
              ) : (
                orders.map((order, index) => {
                  const statusConfig = getStatusConfig(order.orderStatus);
                  const StatusIcon = statusConfig.icon;
                  return (
                    <div key={order._id} className="border rounded-2xl p-6 dark:border-gray-800 hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 80}ms` }}>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">Order #{order._id.slice(-8).toUpperCase()}</h3>
                          <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                        </div>
                        <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          <span>{order.orderStatus.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</span>
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        {order.products.map((item, i) => (
                          <div key={i} className="flex items-center space-x-3 text-sm">
                            {item.image && <img src={item.image} alt={item.title} className="w-10 h-10 rounded-lg object-cover" />}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium line-clamp-1">{item.title}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity} x ${item.price.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {order.orderStatus === "delivered" && item.product && (
                                <Link
                                  to={`/product/${item.product._id || item.product}`}
                                  className="inline-flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline"
                                >
                                  <HiOutlineStar className="w-3 h-3" />
                                  Review
                                </Link>
                              )}
                              <p className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t dark:border-gray-800">
                        <span className="font-semibold">${order.totalPrice.toFixed(2)}</span>
                        <span className="text-xs text-gray-500">Est. delivery: {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : "N/A"}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {tab === "profile" && (
            <form onSubmit={handleUpdateProfile} className="max-w-lg space-y-6">
              <h2 className="font-semibold text-lg">Personal Information</h2>
              <div>
                <label className="text-sm font-medium mb-2 block">Full Name</label>
                <input type="text" value={profileForm.fullname} onChange={(e) => setProfileForm({ ...profileForm, fullname: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <input type="email" value={user?.email || ""} className="input-field opacity-60" disabled />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Phone</label>
                <input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} className="input-field" placeholder="+1 (234) 567-890" />
              </div>
              <button type="submit" disabled={saving} className="btn-primary btn-ripple">
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          )}

          {tab === "address" && (
            <form onSubmit={handleUpdateAddress} className="max-w-lg space-y-6">
              <h2 className="font-semibold text-lg">Shipping Address</h2>
              <div>
                <label className="text-sm font-medium mb-2 block">Full Name</label>
                <input type="text" value={addressForm.fullName} onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Street Address</label>
                <input type="text" value={addressForm.street} onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })} className="input-field" placeholder="123 Main St" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">City</label>
                  <input type="text" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">State</label>
                  <input type="text" value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Postal Code</label>
                  <input type="text" value={addressForm.postalCode} onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Country</label>
                  <input type="text" value={addressForm.country} onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })} className="input-field" />
                </div>
              </div>
              <button type="submit" disabled={saving} className="btn-primary btn-ripple">
                {saving ? "Saving..." : "Save Address"}
              </button>
            </form>
          )}

          {tab === "settings" && (
            <div className="max-w-lg space-y-6">
              <h2 className="font-semibold text-lg">Account Settings</h2>
              <div className="border rounded-2xl p-6 dark:border-gray-800">
                <h3 className="font-medium mb-2">Account Info</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Name: {user?.fullname}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email: {user?.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Role: {user?.role}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Member since: {new Date(user?.createdAt || Date.now()).toLocaleDateString("en-US", { year: "numeric", month: "long" })}</p>
              </div>
              <button onClick={handleLogout} className="px-6 py-3 border border-red-200 dark:border-red-800 text-red-600 rounded-lg font-medium hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-300">
                Sign Out
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
