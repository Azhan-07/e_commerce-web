import { Link } from "react-router-dom";
import { useState } from "react";
import { HiOutlineEye } from "react-icons/hi2";

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
  const colorIndex = product.title.charCodeAt(0) % placeholderColors.length;
  const hasValidImage = product.images?.[0] && !imageError;

  return (
    <Link to={`/product/${product._id}`} className="group card animate-fade-in glow-border">
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-dark-800">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 skeleton" />
        )}
        {hasValidImage ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ease-out ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${placeholderColors[colorIndex]} flex items-center justify-center`}>
            <span className="font-display text-4xl font-bold text-white/50">
              {product.title.charAt(0)}
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
          <div className="w-12 h-12 bg-white/90 dark:bg-dark-950/90 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-all duration-300 delay-100">
            <HiOutlineEye className="w-5 h-5 text-primary-950 dark:text-white" />
          </div>
        </div>

        {/* Discount badge */}
        {product.discount > 0 && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-bounce-in">
            -{product.discount}%
          </span>
        )}

        {/* Featured badge */}
        {product.featured && (
          <span className="absolute top-3 right-3 bg-primary-950 dark:bg-white dark:text-dark-950 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            Featured
          </span>
        )}

        {/* Quick add indicator */}
        {product.stock > 0 && (
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <div className="bg-white/90 dark:bg-dark-950/90 backdrop-blur-sm rounded-lg py-2 text-center text-xs font-medium text-primary-950 dark:text-white">
              View Details
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 font-medium">
          {product.gender} / {product.category}
        </p>
        <h3 className="font-medium text-sm mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 line-clamp-1">
          {product.title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm">
            ${discountedPrice.toFixed(2)}
          </span>
          {product.discount > 0 && (
            <span className="text-xs text-gray-400 line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
        <div className="flex items-center mt-2">
          <div className="flex text-yellow-400 text-xs">
            {[...Array(5)].map((_, i) => (
              <span key={i}>{i < Math.round(product.rating) ? "★" : "☆"}</span>
            ))}
          </div>
          <span className="text-[11px] text-gray-400 ml-1">
            ({product.numReviews})
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
