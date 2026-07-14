import { Link } from "react-router-dom";
import { useState } from "react";

const ProductCard = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const discountedPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  const placeholderColors = [
    "from-primary-200 to-primary-400",
    "from-gray-200 to-gray-400",
    "from-blue-200 to-blue-400",
    "from-rose-200 to-rose-400",
    "from-amber-200 to-amber-400",
  ];
  const colorIndex =
    product.title.charCodeAt(0) % placeholderColors.length;

  const hasValidImage = product.images?.[0] && !imageError;

  return (
    <Link to={`/product/${product._id}`} className="group card animate-fade-in">
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-dark-800">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 skeleton" />
        )}
        {hasValidImage ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${placeholderColors[colorIndex]} flex items-center justify-center`}
          >
            <span className="font-display text-3xl font-bold text-white/70">
              {product.title.charAt(0)}
            </span>
          </div>
        )}
        {product.discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full animate-pulse">
            -{product.discount}%
          </span>
        )}
        {product.featured && (
          <span className="absolute top-3 right-3 bg-primary-950 dark:bg-white dark:text-dark-950 text-white text-xs font-medium px-2 py-1 rounded-full">
            Featured
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
          {product.gender} / {product.category}
        </p>
        <h3 className="font-medium text-sm mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
          {product.title}
        </h3>
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-sm">
            ${discountedPrice.toFixed(2)}
          </span>
          {product.discount > 0 && (
            <span className="text-sm text-gray-400 line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
        {product.rating > 0 && (
          <div className="flex items-center mt-2">
            <div className="flex text-yellow-400 text-xs">
              {[...Array(5)].map((_, i) => (
                <span key={i}>{i < Math.round(product.rating) ? "★" : "☆"}</span>
              ))}
            </div>
            <span className="text-xs text-gray-400 ml-1">
              ({product.numReviews})
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
