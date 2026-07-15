import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";
import ProductCard from "../components/ProductCard";
import LoadingSkeleton from "../components/LoadingSkeleton";

const useCountUp = (end, duration = 2000) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, end, duration]);

  return [count, ref];
};

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [productCount, productRef] = useCountUp(500);
  const [customerCount, customerRef] = useCountUp(12000);
  const [orderCount, orderRef] = useCountUp(3200);
  const [ratingCount, ratingRef] = useCountUp(98);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, arrivalsRes] = await Promise.allSettled([
          API.get("/products/featured"),
          API.get("/products/new-arrivals"),
        ]);
        if (featuredRes.status === "fulfilled") setFeatured(featuredRes.value?.data?.data || []);
        if (arrivalsRes.status === "fulfilled") setNewArrivals(arrivalsRes.value?.data?.data || []);
      } catch (err) {
        setError("Failed to load products. Make sure the server is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = [
    { name: "Men", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", path: "/shop?gender=men", emoji: "👔" },
    { name: "Women", image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400", path: "/shop?gender=women", emoji: "👗" },
    { name: "Kids", image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400", path: "/shop?gender=kids", emoji: "🧸" },
  ];

  const brandWords = ["Premium Quality", "Free Shipping", "Easy Returns", "24/7 Support", "Sustainable", "Handcrafted", "Premium Quality", "Free Shipping", "Easy Returns", "24/7 Support", "Sustainable", "Handcrafted"];

  return (
    <div className="animate-fade-in overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-primary-950 text-white overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600"
            alt="Hero"
            className="w-full h-full object-cover opacity-30 scale-105 animate-[gradientShift_20s_ease_infinite]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-950/95 via-primary-950/80 to-primary-950/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-transparent to-transparent" />
        </div>

        {/* Floating decorative shapes */}
        <div className="floating-shape w-64 h-64 bg-white/5 top-20 right-20 animate-float" />
        <div className="floating-shape w-40 h-40 bg-white/5 bottom-20 right-40 animate-float-delayed" />
        <div className="floating-shape w-20 h-20 bg-white/5 top-40 left-10 animate-float" style={{ animationDelay: "1s" }} />

        {/* Rotating circle */}
        <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-96 h-96 border border-white/10 rounded-full animate-rotate-slow" />
        <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-64 h-64 border border-white/5 rounded-full animate-rotate-slow" style={{ animationDirection: "reverse", animationDuration: "30s" }} />

        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <div className="animate-blur-in">
              <p className="text-sm uppercase tracking-[0.4em] mb-6 text-primary-300 font-medium">
                New Collection 2026
              </p>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl md:text-8xl font-bold mb-8 leading-[0.95] animate-slide-up">
              Elevate Your
              <br />
              <span className="italic text-gradient bg-gradient-to-r from-white via-primary-200 to-white bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift">
                Style
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-lg leading-relaxed animate-slide-up" style={{ animationDelay: "200ms" }}>
              Discover our curated collection of premium clothing designed for the
              modern individual.
            </p>
            <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: "400ms" }}>
              <Link to="/shop" className="btn-primary btn-ripple group relative overflow-hidden text-lg px-8 py-4">
                <span className="relative z-10">Shop Now</span>
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>
              <Link to="/shop?featured=true" className="btn-secondary text-lg px-8 py-4">
                Featured
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Brand Marquee Strip */}
      <section className="py-5 border-y border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-dark-900 overflow-hidden">
        <div className="marquee-track">
          {brandWords.map((word, i) => (
            <span key={i} className="flex items-center mx-8 text-sm font-medium text-gray-400 dark:text-gray-500 whitespace-nowrap">
              <span className="w-2 h-2 bg-primary-950 dark:bg-white rounded-full mr-3 flex-shrink-0" />
              {word}
            </span>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-dark-950">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div ref={productRef} className="text-center animate-slide-up">
              <p className="font-display text-4xl md:text-5xl font-bold text-gradient mb-2">{productCount}+</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">Products</p>
            </div>
            <div ref={customerRef} className="text-center animate-slide-up" style={{ animationDelay: "100ms" }}>
              <p className="font-display text-4xl md:text-5xl font-bold text-gradient mb-2">{customerCount.toLocaleString()}+</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">Happy Customers</p>
            </div>
            <div ref={orderRef} className="text-center animate-slide-up" style={{ animationDelay: "200ms" }}>
              <p className="font-display text-4xl md:text-5xl font-bold text-gradient mb-2">{orderCount.toLocaleString()}+</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">Orders Delivered</p>
            </div>
            <div ref={ratingRef} className="text-center animate-slide-up" style={{ animationDelay: "300ms" }}>
              <p className="font-display text-4xl md:text-5xl font-bold text-gradient mb-2">{ratingCount}%</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-custom py-20">
        <div className="text-center mb-14">
          <p className="text-sm uppercase tracking-[0.3em] text-primary-600 dark:text-primary-400 mb-3 font-medium">Browse</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            Shop by Category
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className="relative h-96 rounded-2xl overflow-hidden group glow-border"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/70 transition-all duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-8 transform group-hover:translate-y-[-8px] transition-transform duration-500">
                <span className="text-3xl mb-3 block">{cat.emoji}</span>
                <h3 className="text-white font-display text-2xl font-bold mb-2">{cat.name}</h3>
                <p className="text-gray-300 text-sm group-hover:text-white transition-colors duration-300 flex items-center gap-2">
                  Explore Collection
                  <span className="inline-block transform group-hover:translate-x-2 transition-transform duration-300">→</span>
                </p>
              </div>
              {/* Decorative corner */}
              <div className="absolute top-4 right-4 w-12 h-12 border-2 border-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:rotate-90">
                <span className="text-white text-lg">+</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50 dark:bg-dark-900">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-primary-600 dark:text-primary-400 mb-2 font-medium">Curated</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold">Featured</h2>
            </div>
            <Link
              to="/shop?featured=true"
              className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors flex items-center gap-1 group"
            >
              View All
              <span className="inline-block transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          {loading ? (
            <LoadingSkeleton count={4} />
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 stagger-children">
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trending Collection Banner */}
      <section className="container-custom py-16">
        <div className="relative rounded-3xl overflow-hidden h-[28rem] bg-primary-950 flex items-center group">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200"
            alt="Trending"
            className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-950/90 to-transparent" />
          <div className="relative z-10 p-10 md:p-16 max-w-xl">
            <div className="animate-blur-in">
              <p className="text-sm uppercase tracking-[0.3em] mb-4 text-primary-300 font-medium">
                Trending Now
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-5 leading-tight">
                The Essential Summer Edit
              </h2>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                Lightweight fabrics, bold colors, and timeless silhouettes for the
                season ahead.
              </p>
              <Link to="/shop" className="inline-block bg-white text-primary-950 px-10 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
                Shop the Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-primary-600 dark:text-primary-400 mb-2 font-medium">Just In</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold">New Arrivals</h2>
            </div>
            <Link
              to="/shop?sort=newest"
              className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors flex items-center gap-1 group"
            >
              View All
              <span className="inline-block transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          {loading ? (
            <LoadingSkeleton count={4} />
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 stagger-children">
              {newArrivals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Brand */}
      <section className="bg-gray-50 dark:bg-dark-900 py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-up">
              <p className="text-sm uppercase tracking-[0.3em] text-primary-600 dark:text-primary-400 mb-4 font-medium">
                Our Story
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-8 leading-tight">
                Crafted for the <span className="italic text-gradient">Modern</span> Individual
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 text-lg">
                At KING, we believe clothing is more than fabric. It's an expression
                of who you are. Every piece is thoughtfully designed and crafted from
                premium materials to ensure both style and comfort.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8 text-lg">
                From timeless classics to contemporary designs, our collections are
                curated to elevate your everyday wardrobe.
              </p>
              <Link to="/about" className="btn-primary btn-ripple inline-flex items-center gap-2">
                Learn More
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-5">
                <img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400"
                  alt="About"
                  className="rounded-2xl h-56 object-cover hover:scale-105 transition-transform duration-700 shadow-lg"
                />
                <img
                  src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400"
                  alt="About"
                  className="rounded-2xl h-40 object-cover hover:scale-105 transition-transform duration-700 shadow-lg"
                />
              </div>
              <div className="space-y-5 mt-10">
                <img
                  src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=400"
                  alt="About"
                  className="rounded-2xl h-40 object-cover hover:scale-105 transition-transform duration-700 shadow-lg"
                />
                <img
                  src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400"
                  alt="About"
                  className="rounded-2xl h-56 object-cover hover:scale-105 transition-transform duration-700 shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20">
        <div className="container-custom">
          <div className="relative rounded-3xl overflow-hidden py-20 px-10 text-center bg-gradient-to-r from-primary-950 via-primary-800 to-primary-950 text-white animate-glow">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full animate-rotate-slow" />
              <div className="absolute bottom-10 right-10 w-48 h-48 border border-white rounded-full animate-rotate-slow" style={{ animationDirection: "reverse" }} />
            </div>
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-5">Ready to Elevate Your Wardrobe?</h2>
              <p className="text-gray-300 mb-8 text-lg max-w-xl mx-auto">Join thousands of customers who trust KING for premium quality clothing.</p>
              <Link to="/shop" className="inline-block bg-white text-primary-950 px-10 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
