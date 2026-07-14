import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";
import ProductCard from "../components/ProductCard";
import LoadingSkeleton from "../components/LoadingSkeleton";

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, arrivalsRes] = await Promise.allSettled([
          API.get("/products/featured"),
          API.get("/products/new-arrivals"),
        ]);
        if (featuredRes.status === "fulfilled") setFeatured(featuredRes.value.data);
        if (arrivalsRes.status === "fulfilled") setNewArrivals(arrivalsRes.value.data);
      } catch (err) {
        setError("Failed to load products. Make sure the server is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = [
    { name: "Men", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", path: "/shop?gender=men" },
    { name: "Women", image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400", path: "/shop?gender=women" },
    { name: "Kids", image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400", path: "/shop?gender=kids" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center bg-primary-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/90 to-primary-950/50" />
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600"
            alt="Hero"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-2xl animate-slide-up">
            <p className="text-sm uppercase tracking-[0.3em] mb-4 text-primary-300">
              New Collection 2026
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Elevate Your
              <br />
              <span className="italic">Style</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-md">
              Discover our curated collection of premium clothing designed for the
              modern individual.
            </p>
            <div className="flex space-x-4">
              <Link to="/shop" className="btn-primary group relative overflow-hidden">
                <span className="relative z-10">Shop Now</span>
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>
              <Link to="/shop?featured=true" className="btn-secondary">
                Featured
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-custom py-20">
        <h2 className="font-display text-3xl font-bold text-center mb-12">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <Link
              key={cat.name}
              to={cat.path}
              className="relative h-80 rounded-2xl overflow-hidden group"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-6 left-6 transform group-hover:translate-x-2 transition-transform duration-300">
                <h3 className="text-white font-display text-2xl font-bold">{cat.name}</h3>
                <p className="text-gray-300 text-sm mt-1 group-hover:text-white transition-colors">
                  Explore Collection →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container-custom py-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-display text-3xl font-bold">Featured</h2>
          <Link
            to="/shop?featured=true"
            className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
          >
            View All →
          </Link>
        </div>
        {loading ? (
          <LoadingSkeleton count={4} />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Trending Collection Banner */}
      <section className="container-custom py-16">
        <div className="relative rounded-2xl overflow-hidden h-80 bg-primary-950 flex items-center group">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200"
            alt="Trending"
            className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="relative z-10 p-10 md:p-16 text-white max-w-lg">
            <p className="text-sm uppercase tracking-[0.3em] mb-3 text-primary-300">
              Trending Now
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              The Essential Summer Edit
            </h2>
            <p className="text-gray-300 mb-6">
              Lightweight fabrics, bold colors, and timeless silhouettes for the
              season ahead.
            </p>
            <Link to="/shop" className="inline-block bg-white text-primary-950 px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              Shop the Collection
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container-custom py-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-display text-3xl font-bold">New Arrivals</h2>
          <Link
            to="/shop?sort=newest"
            className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
          >
            View All →
          </Link>
        </div>
        {loading ? (
          <LoadingSkeleton count={4} />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* About Brand */}
      <section className="bg-gray-50 dark:bg-dark-900 py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <p className="text-sm uppercase tracking-[0.3em] text-primary-600 dark:text-primary-400 mb-3">
                Our Story
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Crafted for the <span className="italic">Modern</span> Individual
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                At KING, we believe clothing is more than fabric. It's an expression
                of who you are. Every piece is thoughtfully designed and crafted from
                premium materials to ensure both style and comfort.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                From timeless classics to contemporary designs, our collections are
                curated to elevate your everyday wardrobe.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400"
                alt="About"
                className="rounded-2xl h-60 object-cover hover:scale-105 transition-transform duration-500"
              />
              <img
                src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=400"
                alt="About"
                className="rounded-2xl h-60 object-cover mt-8 hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
