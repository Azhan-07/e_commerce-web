import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";
import toast from "react-hot-toast";

const Admin = () => {
  const [tab, setTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productForm, setProductForm] = useState({
    title: "",
    description: "",
    price: "",
    discount: "0",
    category: "shirts",
    gender: "men",
    sizes: [],
    colors: [],
    stock: "",
    featured: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (tab === "products") fetchProducts();
    if (tab === "orders") fetchOrders();
    if (tab === "users") fetchUsers();
  }, [tab]);

  const fetchDashboard = async () => {
    try {
      const { data } = await API.get("/orders/dashboard");
      setStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await API.get("/products?limit=100");
      setProducts(data.products);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await API.get("/orders");
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/auth/users");
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(productForm).forEach(([key, value]) => {
      if (key === "sizes" || key === "colors") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });
    images.forEach((img) => formData.append("images", img));

    try {
      if (editingId) {
        await API.put(`/products/${editingId}`, formData);
        toast.success("Product updated!");
      } else {
        await API.post("/products", formData);
        toast.success("Product created!");
      }
      resetForm();
      fetchProducts();
      setTab("products");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const handleStockUpdate = async (productId, newStock) => {
    try {
      await API.put(`/products/${productId}`, { stock: newStock });
      toast.success("Stock updated!");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to update stock");
    }
  };

  const handleEditProduct = (product) => {
    setEditingId(product._id);
    setProductForm({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      discount: product.discount.toString(),
      category: product.category,
      gender: product.gender,
      sizes: product.sizes || [],
      colors: product.colors || [],
      stock: product.stock.toString(),
      featured: product.featured,
    });
    setTab("create");
  };

  const resetForm = () => {
    setEditingId(null);
    setProductForm({
      title: "",
      description: "",
      price: "",
      discount: "0",
      category: "shirts",
      gender: "men",
      sizes: [],
      colors: [],
      stock: "",
      featured: false,
    });
    setImages([]);
  };

  const handleOrderStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}`, { orderStatus: status });
      toast.success("Order updated");
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  const allSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const allColors = ["Black", "White", "Navy", "Blue", "Red", "Green", "Brown", "Grey", "Cream", "Olive"];
  const categories = ["shirts", "hoodies", "jeans", "shoes", "jackets", "accessories", "tshirts", "pants", "dresses", "shorts"];

  const tabs = [
    { id: "dashboard", name: "Dashboard" },
    { id: "products", name: "Products" },
    { id: "create", name: editingId ? "Edit Product" : "Add Product" },
    { id: "orders", name: "Orders" },
    { id: "users", name: "Users" },
  ];

  return (
    <div className="container-custom py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8 page-enter">
        <h1 className="font-display text-3xl font-bold">Admin Panel</h1>
        <Link
          to="/"
          className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
        >
          Back to Store
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-56 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTab(t.id);
                  if (t.id !== "create") resetForm();
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab === t.id
                    ? "bg-primary-950 text-white dark:bg-white dark:text-dark-950"
                    : "hover:bg-gray-100 dark:hover:bg-dark-800"
                }`}
              >
                {t.name}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 min-w-0">
          {tab === "dashboard" && stats && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Products", value: stats.totalProducts },
                  { label: "Orders", value: stats.totalOrders },
                  { label: "Users", value: stats.totalUsers },
                  { label: "Revenue", value: `$${stats.revenue.toFixed(2)}` },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="border rounded-xl p-4 dark:border-gray-800"
                  >
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="font-semibold mb-4">Recent Orders</h3>
                <div className="space-y-2">
                  {stats.recentOrders.map((order) => (
                    <div
                      key={order._id}
                      className="border rounded-lg p-3 dark:border-gray-800 flex items-center justify-between text-sm"
                    >
                      <span>{order.user?.fullname}</span>
                      <span className="font-medium">
                        ${order.totalPrice.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "products" && (
            <div>
              <button
                onClick={() => setTab("create")}
                className="btn-primary btn-ripple mb-6"
              >
                Add New Product
              </button>
              <div className="space-y-3">
                {products.map((p) => (
                  <div
                    key={p._id}
                    className="border rounded-xl p-4 dark:border-gray-800 flex items-center space-x-4"
                  >
                    <img
                      src={p.images?.[0] || "/placeholder.png"}
                      alt={p.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-1">{p.title}</p>
                      <p className="text-xs text-gray-500">
                        ${p.price} / Stock: {p.stock}
                      </p>
                      <div className="mt-2 flex items-center space-x-2">
                        <input
                          type="number"
                          value={p.stock}
                          onChange={(e) => handleStockUpdate(p._id, parseInt(e.target.value))}
                          className="input-field text-xs w-20"
                          min="0"
                        />
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          p.stock > 20 ? "bg-green-100 text-green-700" :
                          p.stock > 5 ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {p.stock > 20 ? "✓ In Stock" : p.stock > 5 ? "⚠ Low Stock" : "❌ Critical"}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditProduct(p)}
                        className="px-3 py-1 text-xs border rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p._id)}
                        className="px-3 py-1 text-xs text-red-500 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "create" && (
            <form
              onSubmit={handleProductSubmit}
              className="max-w-2xl space-y-4"
            >
              <h2 className="font-semibold text-lg">
                {editingId ? "Edit Product" : "Add New Product"}
              </h2>
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <input
                  type="text"
                  value={productForm.title}
                  onChange={(e) =>
                    setProductForm({ ...productForm, title: e.target.value })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Description
                </label>
                <textarea
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      description: e.target.value,
                    })
                  }
                  className="input-field"
                  rows="3"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Price</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Discount %
                  </label>
                  <input
                    type="number"
                    value={productForm.discount}
                    onChange={(e) =>
                      setProductForm({ ...productForm, discount: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Category
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({ ...productForm, category: e.target.value })
                    }
                    className="input-field"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Gender</label>
                  <select
                    value={productForm.gender}
                    onChange={(e) =>
                      setProductForm({ ...productForm, gender: e.target.value })
                    }
                    className="input-field"
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Stock</label>
                <input
                  type="number"
                  value={productForm.stock}
                  onChange={(e) =>
                    setProductForm({ ...productForm, stock: e.target.value })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {allSizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        const sizes = productForm.sizes.includes(s)
                          ? productForm.sizes.filter((x) => x !== s)
                          : [...productForm.sizes, s];
                        setProductForm({ ...productForm, sizes });
                      }}
                      className={`px-3 py-1 text-xs border rounded-full ${
                        productForm.sizes.includes(s)
                          ? "bg-primary-950 text-white dark:bg-white dark:text-dark-950"
                          : ""
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Colors</label>
                <div className="flex flex-wrap gap-2">
                  {allColors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        const colors = productForm.colors.includes(c)
                          ? productForm.colors.filter((x) => x !== c)
                          : [...productForm.colors, c];
                        setProductForm({ ...productForm, colors });
                      }}
                      className={`px-3 py-1 text-xs border rounded-full ${
                        productForm.colors.includes(c)
                          ? "bg-primary-950 text-white dark:bg-white dark:text-dark-950"
                          : ""
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setImages(Array.from(e.target.files))}
                  className="input-field"
                />
              </div>
              <label className="flex items-center space-x-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={productForm.featured}
                  onChange={(e) =>
                    setProductForm({ ...productForm, featured: e.target.checked })
                  }
                  className="accent-primary-950"
                />
                <span>Featured Product</span>
              </label>
              <div className="flex space-x-4">
                <button type="submit" className="btn-primary btn-ripple">
                  {editingId ? "Update Product" : "Create Product"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {tab === "orders" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">All Orders ({orders.length})</h2>
                <div className="flex items-center space-x-2">
                  <select
                    className="input-field text-sm w-32"
                    onChange={(e) => {
                      const filtered = orders.filter(o =>
                        e.target.value === "all" ? true : o.orderStatus === e.target.value
                      );
                      setOrders(filtered);
                    }}
                  >
                    <option value="all">All Status</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {orders.map((order) => (
                <div
                  key={order._id}
                  className="border rounded-xl p-4 dark:border-gray-800"
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
                      onChange={(e) =>
                        handleOrderStatus(order._id, e.target.value)
                      }
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
                      {order.products.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span>{item.title} x {item.quantity}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total: ${order.totalPrice.toFixed(2)}</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      order.orderStatus === "delivered"
                        ? "bg-green-100 text-green-700"
                        : order.orderStatus === "shipped"
                        ? "bg-blue-100 text-blue-700"
                        : order.orderStatus === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "users" && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">All Users</h2>
              {users.map((u) => (
                <div
                  key={u._id}
                  className="border rounded-xl p-4 dark:border-gray-800 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-sm">{u.fullname}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      u.role === "admin"
                        ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                        : "bg-gray-100 text-gray-600 dark:bg-dark-800 dark:text-gray-400"
                    }`}
                  >
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;
