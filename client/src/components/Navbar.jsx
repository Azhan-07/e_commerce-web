import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import {
  HiOutlineShoppingBag,
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
  const [scrolled, setScrolled] = useState(false);
  const { admin, adminLogout } = useAuth();
  const { cartCount } = useCart();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    { name: "Products", path: "/shop" },
    { name: "Categories", path: "/categories" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${
      scrolled
        ? "bg-white/90 dark:bg-dark-950/90 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20 border-b border-gray-200/50 dark:border-gray-800/50"
        : "bg-white/60 dark:bg-dark-950/60 backdrop-blur-lg border-b border-gray-200/30 dark:border-gray-800/30"
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="font-display text-2xl font-bold tracking-wider hover:scale-105 transition-transform duration-300 relative"
          >
            <span className="relative z-10">KING</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-950 dark:bg-white group-hover:w-full transition-all duration-300" />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="nav-link text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-950 dark:hover:text-white transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-1 md:space-x-3">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <HiOutlineSearch className="w-[18px] h-[18px]" />
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-12 active:scale-95"
            >
              {darkMode ? (
                <HiOutlineSun className="w-[18px] h-[18px]" />
              ) : (
                <HiOutlineMoon className="w-[18px] h-[18px]" />
              )}
            </button>

            {/* Admin */}
            {admin ? (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/admin"
                  className="text-xs font-semibold px-4 py-2 bg-primary-950 text-white dark:bg-white dark:text-dark-950 rounded-full hover:scale-105 transition-all duration-300 hover:shadow-lg"
                >
                  Admin
                </Link>
                <button
                  onClick={() => { adminLogout(); navigate("/"); }}
                  className="text-xs font-medium px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/admin-login"
                className="hidden md:inline text-xs font-medium px-4 py-2 bg-gray-100 dark:bg-dark-800 rounded-full hover:bg-gray-200 dark:hover:bg-dark-700 transition-all duration-300 hover:scale-105"
              >
                Admin
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2.5 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <HiOutlineShoppingBag className="w-[18px] h-[18px]" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-950 dark:bg-white dark:text-dark-950 text-white text-[10px] rounded-full flex items-center justify-center font-bold animate-bounce-in shadow-lg">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-full transition-all duration-300"
            >
              {mobileOpen ? (
                <HiOutlineX className="w-[18px] h-[18px]" />
              ) : (
                <HiOutlineMenu className="w-[18px] h-[18px]" />
              )}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className={`overflow-hidden transition-all duration-500 ease-out ${
          searchOpen ? "max-h-20 pb-4 opacity-100" : "max-h-0 opacity-0"
        }`}>
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="input-field pr-12 input-glow"
              autoFocus={searchOpen}
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-full transition-colors"
            >
              <HiOutlineSearch className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-400 ease-out ${
          mobileOpen ? "max-h-80 pb-4 opacity-100" : "max-h-0 opacity-0"
        }`}>
          <div className="space-y-1">
            {navLinks.map((link, i) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 px-4 text-sm font-medium hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-dark-900 rounded-xl transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {link.name}
              </Link>
            ))}
            {admin ? (
              <>
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2.5 px-4 text-sm font-semibold bg-primary-950 text-white dark:bg-white dark:text-dark-950 rounded-xl text-center mt-2"
                >
                  Admin Panel
                </Link>
                <button
                  onClick={() => { adminLogout(); setMobileOpen(false); navigate("/"); }}
                  className="block w-full text-left py-2.5 px-4 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/admin-login"
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 px-4 text-sm font-medium hover:bg-gray-50 dark:hover:bg-dark-900 rounded-xl transition-all duration-300"
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
