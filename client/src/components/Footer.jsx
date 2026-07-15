import { Link } from "react-router-dom";
import { useState } from "react";
import API from "../utils/api";
import toast from "react-hot-toast";
import { HiOutlinePaperAirplane } from "react-icons/hi2";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubscribing(true);
    try {
      await API.post("/subscribers", { email });
      toast.success("Subscribed successfully!");
      setEmail("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Subscription failed");
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-primary-950 to-[#1a1512] text-white dark:from-dark-900 dark:to-dark-950 mt-20 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
      <div className="absolute top-20 right-20 w-64 h-64 bg-white/[0.02] rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-white/[0.02] rounded-full blur-3xl" />

      <div className="container-custom py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <h3 className="font-display text-3xl font-bold mb-4 tracking-wider">KING</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Premium clothing for the modern individual. Crafted with care,
              designed for elegance.
            </p>
            <div className="flex space-x-3">
              {["Twitter", "Instagram", "Facebook"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xs font-medium hover:bg-white/20 hover:scale-110 transition-all duration-300"
                >
                  {social.charAt(0)}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-5 text-sm uppercase tracking-wider">Shop</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {[
                { name: "Men", path: "/shop?gender=men" },
                { name: "Women", path: "/shop?gender=women" },
                { name: "Kids", path: "/shop?gender=kids" },
                { name: "Featured", path: "/shop?featured=true" },
                { name: "New Arrivals", path: "/shop?sort=newest" },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-1">
                    <span className="w-0 group-hover:w-2 h-px bg-white transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-5 text-sm uppercase tracking-wider">Help</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {[
                { name: "Order Tracking", path: "/order-tracking" },
                { name: "Contact Us", path: "/contact" },
                { name: "About Us", path: "/about" },
                { name: "FAQ", path: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-1">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-5 text-sm uppercase tracking-wider">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe for exclusive offers and updates.
            </p>
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-gray-500 transition-all duration-300 hover:border-white/20"
                required
              />
              <button
                type="submit"
                disabled={subscribing}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white text-primary-950 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-all duration-300 hover:scale-110 disabled:opacity-50"
              >
                <HiOutlinePaperAirplane className="w-4 h-4 -rotate-45" />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>&copy; 2026 KING. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
