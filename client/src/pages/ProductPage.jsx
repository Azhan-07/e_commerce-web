import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../utils/api";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import toast from "react-hot-toast";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data.data);
        setSelectedImage(0);

        const relatedRes = await API.get(
          `/products?category=${data.data.category}&gender=${data.data.gender}&limit=4`
        );
        setRelated(
          (relatedRes.data.data.products || []).filter((p) => p._id !== data.data._id).slice(0, 4)
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    try {
      await addToCart(product._id, quantity, selectedSize, selectedColor, product);
      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square skeleton rounded-2xl" />
          <div className="space-y-4">
            <div className="h-4 skeleton w-1/3" />
            <div className="h-8 skeleton w-2/3" />
            <div className="h-6 skeleton w-1/4" />
            <div className="h-20 skeleton" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-20 text-center animate-fade-in">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link to="/shop" className="text-primary-600 hover:underline">
          Back to Shop
        </Link>
      </div>
    );
  }

  const discountedPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  return (
    <div className="container-custom py-8 animate-fade-in">
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/shop" className="hover:text-primary-600 transition-colors">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Images */}
        <div className="animate-slide-up">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-dark-800 mb-4 group">
            {product.images[selectedImage] && !imageError ? (
              <img
                key={selectedImage}
                src={product.images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover animate-fade-in group-hover:scale-105 transition-transform duration-700"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center">
                <span className="font-display text-6xl font-bold text-white/50">{product.title.charAt(0)}</span>
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex space-x-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === i
                      ? "border-primary-950 dark:border-white shadow-lg scale-105"
                      : "border-transparent hover:border-gray-300 dark:hover:border-gray-600 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="animate-slide-up" style={{ animationDelay: "150ms" }}>
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            {product.gender} / {product.category}
          </p>
          <h1 className="font-display text-3xl font-bold mb-4">{product.title}</h1>

          {product.rating > 0 && (
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400 text-sm">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>{i < Math.round(product.rating) ? "★" : "☆"}</span>
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">
                ({product.numReviews} reviews)
              </span>
            </div>
          )}

          <div className="flex items-center space-x-3 mb-6">
            <span className="text-2xl font-bold">${discountedPrice.toFixed(2)}</span>
            {product.discount > 0 && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
                <span className="bg-red-100 text-red-600 text-sm font-medium px-2.5 py-1 rounded-full animate-bounce-in">
                  -{product.discount}%
                </span>
              </>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
            {product.description}
          </p>

          {product.sizes.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-sm mb-3">
                Size {selectedSize && <span className="text-primary-600 dark:text-primary-400">— {selectedSize}</span>}
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-sm border rounded-lg transition-all duration-300 ${
                      selectedSize === size
                        ? "bg-primary-950 text-white dark:bg-white dark:text-dark-950 shadow-lg scale-105"
                        : "hover:bg-gray-100 dark:hover:bg-dark-800 hover:scale-105"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-sm mb-3">
                Color {selectedColor && <span className="text-primary-600 dark:text-primary-400">— {selectedColor}</span>}
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 text-sm border rounded-lg transition-all duration-300 ${
                      selectedColor === color
                        ? "bg-primary-950 text-white dark:bg-white dark:text-dark-950 shadow-lg scale-105"
                        : "hover:bg-gray-100 dark:hover:bg-dark-800 hover:scale-105"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h4 className="font-medium text-sm mb-3">Quantity</h4>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-dark-800 transition-all duration-200 hover:scale-110 active:scale-95"
              >
                -
              </button>
              <span className="w-10 text-center font-medium text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-dark-800 transition-all duration-200 hover:scale-110 active:scale-95"
              >
                +
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {product.stock > 0 ? (
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                {product.stock} in stock
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-red-500 rounded-full" />
                Out of stock
              </span>
            )}
          </p>

          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn-primary btn-ripple flex-1"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="btn-secondary flex-1"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl font-bold mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p, i) => (
              <div key={p._id} className="animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductPage;
