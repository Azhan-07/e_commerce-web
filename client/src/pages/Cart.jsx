import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { HiOutlineTrash } from "react-icons/hi";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const subtotal = cart.total || 0;
  const tax = subtotal * 0.08;
  const shipping = subtotal > 100 ? 0 : 9.99;
  const grandTotal = subtotal + tax + shipping;

  if (!user) {
    return (
      <div className="container-custom py-20 text-center animate-fade-in">
        <h2 className="text-2xl font-bold mb-4">Please login to view your cart</h2>
        <Link to="/login" className="btn-primary btn-ripple inline-block">
          Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex space-x-4 border rounded-xl p-4 animate-pulse">
              <div className="w-24 h-24 skeleton rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 skeleton w-1/3" />
                <div className="h-3 skeleton w-1/4" />
                <div className="h-3 skeleton w-1/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (cart.products.length === 0) {
    return (
      <div className="container-custom py-20 text-center animate-fade-in">
        <div className="animate-scale-in">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Discover our collection and find something you love.
          </p>
          <Link to="/shop" className="btn-primary btn-ripple inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8 animate-fade-in">
      <h1 className="font-display text-3xl font-bold mb-8 page-enter">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {cart.products.map((item, index) => (
            <div
              key={item._id}
              className="flex items-center space-x-4 border rounded-xl p-4 dark:border-gray-800 hover:shadow-lg transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <Link
                to={`/product/${item.product?._id || item.product}`}
                className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-800"
              >
                <img
                  src={item.image || "/placeholder.png"}
                  alt={item.title}
                  className="w-full h-full object-cover img-zoom"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  to={`/product/${item.product?._id || item.product}`}
                  className="font-medium text-sm hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-1"
                >
                  {item.title}
                </Link>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {item.size && <span>Size: {item.size}</span>}
                  {item.size && item.color && <span> / </span>}
                  {item.color && <span>Color: {item.color}</span>}
                </div>
                <p className="font-semibold text-sm mt-2">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                  className="w-8 h-8 border rounded flex items-center justify-center text-sm hover:bg-gray-100 dark:hover:bg-dark-800 transition-all duration-200 hover:scale-110 active:scale-95"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="w-8 h-8 border rounded flex items-center justify-center text-sm hover:bg-gray-100 dark:hover:bg-dark-800 transition-all duration-200 hover:scale-110 active:scale-95"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeFromCart(item._id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg"
              >
                <HiOutlineTrash className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="border rounded-2xl p-6 dark:border-gray-800 h-fit animate-slide-up hover:shadow-lg transition-shadow duration-500" style={{ animationDelay: "200ms" }}>
          <h3 className="font-semibold text-lg mb-6">Order Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Tax (8%)</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Shipping</span>
              <span className="font-medium">
                {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-gray-400">Free shipping on orders over $100</p>
            )}
            <div className="border-t pt-3 flex justify-between font-semibold">
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="btn-primary btn-ripple w-full mt-6"
          >
            Proceed to Checkout
          </button>
          <Link
            to="/shop"
            className="block text-center text-sm text-primary-600 dark:text-primary-400 mt-4 hover:underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
