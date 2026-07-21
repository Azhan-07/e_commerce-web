import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import API from "../utils/api";
import toast from "react-hot-toast";
import { HiOutlineCheck, HiOutlineShoppingBag, HiOutlineMapPin } from "react-icons/hi2";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    fullName: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    phone: "",
    notes: "",
  });

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        customerName: user.fullname || "",
        customerEmail: user.email || "",
        customerPhone: user.phone || "",
        fullName: user.address?.fullName || user.fullname || "",
        address: user.address?.street || "",
        city: user.address?.city || "",
        country: user.address?.country || "",
        postalCode: user.address?.postalCode || "",
        phone: user.address?.phone || user.phone || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customerName.trim()) return toast.error("Your name is required");
    if (!form.customerEmail.trim()) return toast.error("Email is required");
    if (!/^\S+@\S+\.\S+$/.test(form.customerEmail)) return toast.error("Please provide a valid email");
    if (!form.customerPhone.trim()) return toast.error("Phone number is required");
    if (!form.fullName.trim()) return toast.error("Full name is required");
    if (!form.address.trim()) return toast.error("Address is required");
    if (!form.city.trim()) return toast.error("City is required");
    if (!form.country.trim()) return toast.error("Country is required");
    if (!form.postalCode.trim()) return toast.error("Postal code is required");

    setLoading(true);
    try {
      const orderData = {
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        customerPhone: form.customerPhone,
        products: cart.products,
        totalPrice: cart.total,
        shippingAddress: {
          fullName: form.fullName,
          address: form.address,
          city: form.city,
          country: form.country,
          postalCode: form.postalCode,
          phone: form.phone || form.customerPhone,
        },
        notes: form.notes,
      };

      await API.post("/orders", orderData);
      await clearCart();
      toast.success("Order placed successfully!");
      localStorage.setItem("lastOrderEmail", form.customerEmail);
      navigate(`/order-tracking?email=${encodeURIComponent(form.customerEmail)}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart.total || 0;
  const tax = subtotal * 0.08;
  const shipping = subtotal > 100 ? 0 : 9.99;
  const grandTotal = subtotal + tax + shipping;

  if (cart.products.length === 0) {
    return (
      <div className="container-custom py-20 text-center animate-fade-in">
        <div className="animate-scale-in">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-dark-800 rounded-full flex items-center justify-center">
            <HiOutlineShoppingBag className="w-10 h-10 text-gray-300 dark:text-gray-600" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Add some products before checking out</p>
          <a href="/shop" className="btn-primary btn-ripple inline-block">Continue Shopping</a>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8 animate-fade-in">
      <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>

      {user && (
        <div className="mb-6 p-4 bg-primary-50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-800 rounded-xl text-sm">
          <span className="font-medium text-primary-700 dark:text-primary-300">Signed in as {user.email}</span>
          <span className="text-primary-500 dark:text-primary-400 ml-2">— Your saved info has been pre-filled</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="animate-slide-up">
            <h3 className="font-semibold text-lg mb-4">Your Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Your Full Name *</label>
                <input type="text" name="customerName" value={form.customerName} onChange={handleChange} className="input-field input-glow" required />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Email Address *</label>
                <input type="email" name="customerEmail" value={form.customerEmail} onChange={handleChange} className="input-field input-glow" required />
              </div>
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium mb-2 block">Phone Number *</label>
              <input type="tel" name="customerPhone" value={form.customerPhone} onChange={handleChange} className="input-field input-glow" required />
            </div>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
            <h3 className="font-semibold text-lg mb-4">Shipping Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Full Name *</label>
                <input type="text" name="fullName" value={form.fullName} onChange={handleChange} className="input-field input-glow" required />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Phone Number </label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="input-field input-glow" placeholder="(Optional if same as above)" />
              </div>
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium mb-2 block">Address *</label>
              <input type="text" name="address" value={form.address} onChange={handleChange} className="input-field input-glow" placeholder="Street address" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">City *</label>
                <input type="text" name="city" value={form.city} onChange={handleChange} className="input-field input-glow" required />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Country *</label>
                <input type="text" name="country" value={form.country} onChange={handleChange} className="input-field input-glow" required />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Postal Code *</label>
                <input type="text" name="postalCode" value={form.postalCode} onChange={handleChange} className="input-field input-glow" required />
              </div>
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium mb-2 block">Order Notes (Optional)</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} className="input-field resize-none input-glow" rows="3" placeholder="Any special instructions..." />
            </div>
          </div>

          <button type="submit" disabled={loading || cart.products.length === 0} className="btn-primary btn-ripple w-full md:w-auto">
            {loading ? (
              <span className="flex items-center justify-center space-x-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Placing Order...</span>
              </span>
            ) : (
              `Place Order — $${grandTotal.toFixed(2)}`
            )}
          </button>
        </form>

        <div className="border rounded-2xl p-6 dark:border-gray-800 h-fit animate-slide-up glow-border" style={{ animationDelay: "200ms" }}>
          <h3 className="font-semibold text-lg mb-6">Order Summary</h3>
          <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-1">
            {cart.products.map((item, i) => (
              <div key={item._id} className="flex items-center space-x-3">
                <img src={item.image || "/placeholder.png"} alt={item.title} className="w-14 h-14 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}{item.size && ` / ${item.size}`}</p>
                </div>
                <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span>{shipping === 0 ? <span className="text-green-600 font-semibold">Free</span> : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
