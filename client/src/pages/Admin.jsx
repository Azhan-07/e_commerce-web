import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";
import toast from "react-hot-toast";
import DashboardTab from "../components/admin/DashboardTab";
import ProductsTab from "../components/admin/ProductsTab";
import ProductFormTab from "../components/admin/ProductFormTab";
import OrdersTab from "../components/admin/OrdersTab";
import UsersTab from "../components/admin/UsersTab";

const defaultForm = {
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
};

const Admin = () => {
  const [tab, setTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productForm, setProductForm] = useState(defaultForm);
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
      setStats(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await API.get("/products?limit=100");
      setProducts(data.data.products);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await API.get("/orders");
      setOrders(data.data.orders);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/admin-auth/users");
      setUsers(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setProductForm(defaultForm);
    setImages([]);
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

  const handleOrderStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}`, { orderStatus: status });
      toast.success("Order updated");
      fetchOrders();
      fetchDashboard();
    } catch (error) {
      toast.error("Failed to update");
    }
  };

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
          {tab === "dashboard" && <DashboardTab stats={stats} />}
          {tab === "products" && (
            <ProductsTab
              products={products}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onStockUpdate={handleStockUpdate}
              onAddNew={() => setTab("create")}
            />
          )}
          {tab === "create" && (
            <ProductFormTab
              productForm={productForm}
              setProductForm={setProductForm}
              editingId={editingId}
              images={images}
              setImages={setImages}
              onSubmit={handleProductSubmit}
              onCancel={() => { resetForm(); setTab("products"); }}
            />
          )}
          {tab === "orders" && (
            <OrdersTab orders={orders} onUpdateStatus={handleOrderStatus} />
          )}
          {tab === "users" && <UsersTab users={users} />}
        </main>
      </div>
    </div>
  );
};

export default Admin;
