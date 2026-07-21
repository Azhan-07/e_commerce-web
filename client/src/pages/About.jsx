import { HiOutlineCheckCircle, HiOutlineSparkles, HiOutlineHeart, HiOutlineLightBulb } from "react-icons/hi2";

const About = () => {
  const features = [
    {
      icon: HiOutlineSparkles,
      title: "Quality Products",
      desc: "Curated collection of premium items carefully selected for you.",
    },
    {
      icon: HiOutlineHeart,
      title: "Fast Shipping",
      desc: "Estimated delivery within 7 days to your doorstep.",
    },
    {
      icon: HiOutlineCheckCircle,
      title: "Order Tracking",
      desc: "Track your orders in real-time from your account dashboard.",
    },
    {
      icon: HiOutlineLightBulb,
      title: "Secure Shopping",
      desc: "Industry-standard security to protect your data and transactions.",
    },
  ];

  const values = [
    { title: "Quality", desc: "Every product is carefully selected to ensure the best value for money", gradient: "from-primary-500 to-primary-700" },
    { title: "Customer First", desc: "Your satisfaction is our priority — simple, transparent, reliable", gradient: "from-rose-500 to-pink-600" },
    { title: "Innovation", desc: "We continuously improve our platform for a better experience", gradient: "from-amber-500 to-orange-600" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 to-[#1a1512] dark:from-dark-900 dark:to-dark-950" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-white/[0.03] rounded-full blur-3xl floating-shape" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-white/[0.03] rounded-full blur-2xl animate-float-delayed" />
        <div className="container-custom relative z-10 text-center">
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-4 page-enter">About KING</h1>
          <p className="text-gray-400 max-w-xl mx-auto text-lg leading-relaxed animate-slide-up">
            Premium fashion for the modern individual. Crafted with care, designed for elegance.
          </p>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="max-w-3xl mx-auto mb-20 animate-slide-up">
          <h2 className="font-display text-3xl font-bold mb-6 text-center">Our Story</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-center text-lg">
            KING is a premium fashion e-commerce platform dedicated to bringing you the finest clothing and accessories. We believe in quality, style, and affordability combined into one seamless shopping experience.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="font-display text-3xl font-bold mb-10 text-center">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-900/30 transition-all duration-300 animate-slide-up group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <f.icon className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-3xl mx-auto mb-20 animate-slide-up">
          <h2 className="font-display text-3xl font-bold mb-6 text-center">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-center text-lg">
            To provide an accessible, enjoyable, and reliable platform where customers can discover and purchase high-quality fashion products with complete security and transparency. We prioritize convenience and trust in every transaction.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-bold mb-10 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div
                key={v.title}
                className="rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 animate-slide-up group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`h-2 bg-gradient-to-r ${v.gradient}`} />
                <div className="p-6 bg-gray-50 dark:bg-dark-800 h-full">
                  <h3 className="font-semibold text-lg mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{v.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
