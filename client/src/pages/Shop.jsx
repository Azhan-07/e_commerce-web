import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../utils/api";
import ProductCard from "../components/ProductCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { HiOutlineAdjustmentsHorizontal, HiOutlineXMark } from "react-icons/hi2";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    gender: searchParams.get("gender") || "",
    size: searchParams.get("size") || "",
    color: searchParams.get("color") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sort: searchParams.get("sort") || "newest",
    featured: searchParams.get("featured") || "",
    page: parseInt(searchParams.get("page")) || 1,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
        const { data } = await API.get(`/products?${params.toString()}`);
        setProducts(data.products);
        setTotal(data.total);
        setPages(data.pages);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      gender: "",
      size: "",
      color: "",
      minPrice: "",
      maxPrice: "",
      sort: "newest",
      featured: "",
      page: 1,
    });
  };

  const categories = ["shirts", "hoodies", "jeans", "shoes", "jackets", "accessories", "tshirts", "pants", "dresses", "shorts"];
  const genders = ["men", "women", "kids", "unisex"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const colors = ["Black", "White", "Navy", "Blue", "Red", "Green", "Brown", "Grey", "Cream", "Olive"];
  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Top Rated" },
  ];

  return (
    <div className="container-custom py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8 page-enter">
        <div>
          <h1 className="font-display text-3xl font-bold">Shop</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {total} products found
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={filters.sort}
            onChange={(e) => updateFilter("sort", e.target.value)}
            className="input-field w-auto text-sm"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden p-2 border rounded-lg"
          >
            <HiOutlineAdjustmentsHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <aside
          className={`${
            showFilters ? "fixed inset-0 z-50 bg-white dark:bg-dark-950 p-6 overflow-y-auto" : "hidden"
          } lg:block lg:relative lg:w-64 flex-shrink-0`}
        >
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h3 className="font-semibold">Filters</h3>
            <button onClick={() => setShowFilters(false)}>
              <HiOutlineXMark className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-sm mb-3">Gender</h4>
              <div className="space-y-2">
                {genders.map((g) => (
                  <label key={g} className="flex items-center space-x-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={filters.gender === g}
                      onChange={() => updateFilter("gender", filters.gender === g ? "" : g)}
                      className="accent-primary-950"
                    />
                    <span className="capitalize">{g}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm mb-3">Category</h4>
              <div className="space-y-2">
                {categories.map((c) => (
                  <label key={c} className="flex items-center space-x-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === c}
                      onChange={() => updateFilter("category", filters.category === c ? "" : c)}
                      className="accent-primary-950"
                    />
                    <span className="capitalize">{c}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm mb-3">Size</h4>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateFilter("size", filters.size === s ? "" : s)}
                    className={`px-3 py-1 text-xs border rounded-full transition-colors ${
                      filters.size === s
                        ? "bg-primary-950 text-white dark:bg-white dark:text-dark-950"
                        : "hover:bg-gray-100 dark:hover:bg-dark-800"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm mb-3">Price Range</h4>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => updateFilter("minPrice", e.target.value)}
                  className="input-field text-sm"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter("maxPrice", e.target.value)}
                  className="input-field text-sm"
                />
              </div>
            </div>

            <button
              onClick={clearFilters}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              Clear All Filters
            </button>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <LoadingSkeleton count={8} />
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400">No products found</p>
              <button
                onClick={clearFilters}
                className="mt-4 text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {pages > 1 && (
                <div className="flex justify-center mt-10 space-x-2">
                  {[...Array(pages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => updateFilter("page", i + 1)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        filters.page === i + 1
                          ? "bg-primary-950 text-white dark:bg-white dark:text-dark-950"
                          : "border hover:bg-gray-100 dark:hover:bg-dark-800"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
