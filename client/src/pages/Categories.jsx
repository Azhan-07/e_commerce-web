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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12 animate-fade-in">
      <h1 className="font-display text-4xl font-bold mb-4">Categories</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-12">
        Browse our collections organized by category
      </p>

      {categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No categories available</p>
          <Link to="/shop" className="btn-primary">
            Browse All Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/shop?category=${category.slug}`}
              className="group overflow-hidden rounded-2xl hover:shadow-lg transition-all duration-300"
            >
              <div className="bg-gradient-to-br from-primary-100 to-primary-50 dark:from-dark-800 dark:to-dark-900 h-64 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-5xl">📦</span>
                )}
              </div>
              <div className="p-6 bg-white dark:bg-dark-900 border-t border-gray-200 dark:border-gray-800">
                <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
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
  );
};

export default Categories;
