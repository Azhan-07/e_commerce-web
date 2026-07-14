import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 animate-fade-in">
      <div className="text-center animate-scale-in">
        <h1 className="font-display text-8xl font-bold mb-4 animate-pulse">404</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="btn-primary btn-ripple inline-block">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
