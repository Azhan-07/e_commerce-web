import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import {
  HiOutlineShoppingBag,
  HiOutlineUser,
  HiOutlineSearch,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineSun,
  HiOutlineMoon,
} from "react-icons/hi";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery.trim()}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-dark-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 animate-slide-down">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="font-display text-2xl font-bold tracking-wider hover:scale-105 transition-transform duration-300"
          >
            KING
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="nav-link text-sm font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <HiOutlineSearch className="w-5 h-5" />
            </button>

            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-12 active:scale-95"
            >
              {darkMode ? (
                <HiOutlineSun className="w-5 h-5" />
              ) : (
                <HiOutlineMoon className="w-5 h-5" />
              )}
            </button>

            {user ? (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/dashboard"
                  className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
                >
                  <HiOutlineUser className="w-5 h-5" />
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="text-xs font-medium px-3 py-1 bg-primary-950 text-white dark:bg-white dark:text-dark-950 rounded-full hover:scale-105 transition-transform duration-300"
                  >
                    Admin
                  </Link>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:block text-sm font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Login
              </Link>
            )}

            <Link
              to="/cart"
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <HiOutlineShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-950 dark:bg-white dark:text-dark-950 text-white text-xs rounded-full flex items-center justify-center font-medium animate-scale-in">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-full transition-all duration-300"
            >
              {mobileOpen ? (
                <HiOutlineX className="w-5 h-5" />
              ) : (
                <HiOutlineMenu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {searchOpen && (
          <form onSubmit={handleSearch} className="pb-4 animate-slide-down">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="input-field"
              autoFocus
            />
          </form>
        )}

        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1 animate-slide-down">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className="block py-2 px-3 text-sm font-medium hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-dark-900 rounded-lg transition-all duration-200"
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 px-3 text-sm font-medium hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-dark-900 rounded-lg transition-all duration-200"
                >
                  Dashboard
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 px-3 text-sm font-medium hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-dark-900 rounded-lg transition-all duration-200"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="block w-full text-left py-2 px-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block py-2 px-3 text-sm font-medium hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-dark-900 rounded-lg transition-all duration-200"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
