import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950" />
      
      {/* Floating shapes */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary-200/20 dark:bg-primary-900/10 rounded-full blur-2xl floating-shape" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-primary-100/30 dark:bg-primary-800/5 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-gray-200/30 dark:bg-white/5 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-primary-100/20 dark:bg-primary-900/5 rounded-full blur-2xl animate-float-delayed" />

      <div className="text-center relative z-10 animate-scale-in">
        <div className="relative inline-block mb-6">
          <h1 className="font-display text-[10rem] font-bold leading-none text-gradient opacity-90">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full animate-pulse-glow" />
          </div>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg max-w-md mx-auto animate-slide-up">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center space-x-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
          <Link to="/" className="btn-primary btn-ripple px-8 py-3">
            Back to Home
          </Link>
          <Link to="/shop" className="btn-secondary px-8 py-3">
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
