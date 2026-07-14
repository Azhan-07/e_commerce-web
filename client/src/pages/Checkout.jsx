import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import API from "../utils/api";
import toast from "react-hot-toast";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    phone: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/orders", { shippingAddress: form });
      await clearCart();
      toast.success("Order placed successfully!");
      navigate("/dashboard/orders");
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

  return (
    <div className="container-custom py-8 animate-fade-in">
      <h1 className="font-display text-3xl font-bold mb-8 page-enter">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6 animate-slide-up">
          <h3 className="font-semibold text-lg">Shipping Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="input-field"
              placeholder="Street address"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">City</label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Country</label>
              <input
                type="text"
                name="country"
                value={form.country}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary btn-ripple w-full md:w-auto"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        {/* Order Summary */}
        <div className="border rounded-2xl p-6 dark:border-gray-800 h-fit animate-slide-up hover:shadow-lg transition-shadow duration-500" style={{ animationDelay: "200ms" }}>
          <h3 className="font-semibold text-lg mb-6">Order Summary</h3>
          <div className="space-y-4 mb-6">
            {cart.products.map((item) => (
              <div key={item._id} className="flex items-center space-x-3">
                <img
                  src={item.image || "/placeholder.png"}
                  alt={item.title}
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Qty: {item.quantity}
                    {item.size && ` / ${item.size}`}
                  </p>
                </div>
                <p className="text-sm font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Shipping</span>
              <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
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
