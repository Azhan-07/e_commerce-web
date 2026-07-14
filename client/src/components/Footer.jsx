import { Link } from "react-router-dom";
import { useState } from "react";
import API from "../utils/api";
import toast from "react-hot-toast";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      await API.post("/subscribe", { email });
      toast.success("Subscribed successfully!");
      setEmail("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Subscription failed");
    }
  };

  return (
    <footer className="bg-primary-950 text-white dark:bg-dark-900 mt-20">
      <div className="container-custom py-16 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="font-display text-2xl font-bold mb-4">KING</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium clothing for the modern individual. Crafted with care,
              designed for elegance.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/shop?gender=men" className="hover:text-white transition-colors">
                  Men
                </Link>
              </li>
              <li>
                <Link to="/shop?gender=women" className="hover:text-white transition-colors">
                  Women
                </Link>
              </li>
              <li>
                <Link to="/shop?gender=kids" className="hover:text-white transition-colors">
                  Kids
                </Link>
              </li>
              <li>
                <Link to="/shop?featured=true" className="hover:text-white transition-colors">
                  Featured
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Help</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/dashboard/orders" className="hover:text-white transition-colors">
                  Order Tracking
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe for exclusive offers and updates.
            </p>
            <form onSubmit={handleSubscribe} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 px-4 py-2 bg-dark-800 rounded-l-lg text-sm focus:outline-none text-white placeholder-gray-500"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-white text-dark-950 rounded-r-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>&copy; 2026 KING. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
