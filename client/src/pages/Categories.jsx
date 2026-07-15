/**
 * Categories Page
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";
import toast from "react-hot-toast";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/categories");
      setCategories(data.data || []);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-950 dark:border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 to-[#1a1512] dark:from-dark-900 dark:to-dark-950" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-white/[0.03] rounded-full blur-3xl floating-shape" />
        <div className="container-custom relative z-10 text-center">
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-4 page-enter">Categories</h1>
          <p className="text-gray-400 max-w-xl mx-auto text-lg leading-relaxed animate-slide-up">
            Browse our collections organized by category
          </p>
        </div>
      </div>

      <div className="container-custom py-16">
        {categories.length === 0 ? (
          <div className="text-center py-12 animate-scale-in">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No categories available</p>
            <Link to="/shop" className="btn-primary btn-ripple">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, i) => (
              <Link
                key={category._id}
                to={`/shop?category=${category.slug}`}
                className="group overflow-hidden rounded-2xl hover:shadow-xl transition-all duration-500 animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="bg-gradient-to-br from-primary-100 to-primary-50 dark:from-dark-800 dark:to-dark-900 h-64 flex items-center justify-center overflow-hidden relative">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                      📦
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <span className="text-white text-sm font-medium bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      Browse Collection
                    </span>
                  </div>
                </div>
                <div className="p-6 bg-white dark:bg-dark-900 border-t border-gray-200 dark:border-gray-800">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
