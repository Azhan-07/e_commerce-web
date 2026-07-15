import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import toast from "react-hot-toast";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
        setSelectedImage(0);

        if (user) {
          API.post(`/auth/recently-viewed/${id}`).catch(() => {});
        }

        const relatedRes = await API.get(
          `/products?category=${data.category}&gender=${data.gender}&limit=4`
        );
        setRelated(
          relatedRes.data.products.filter((p) => p._id !== data._id).slice(0, 4)
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, user]);

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

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to review");
      return;
    }
    try {
      await API.post(`/products/${id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment,
      });
      toast.success("Review added!");
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
      setReviewComment("");
      setReviewRating(5);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add review");
    }
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
      <div className="container-custom py-20 text-center">
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
        <Link to="/" className="hover:text-primary-600">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/shop" className="hover:text-primary-600">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Images */}
        <div className="animate-slide-up">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-dark-800 mb-4">
            {product.images[selectedImage] && !imageError ? (
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover animate-fade-in"
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
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === i
                      ? "border-primary-950 dark:border-white"
                      : "border-transparent"
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
                <span className="bg-red-100 text-red-600 text-sm font-medium px-2 py-1 rounded-full">
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
              <h4 className="font-medium text-sm mb-3">Size</h4>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-sm border rounded-lg transition-colors ${
                      selectedSize === size
                        ? "bg-primary-950 text-white dark:bg-white dark:text-dark-950"
                        : "hover:bg-gray-100 dark:hover:bg-dark-800"
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
                Color {selectedColor && `- ${selectedColor}`}
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 text-sm border rounded-lg transition-colors ${
                      selectedColor === color
                        ? "bg-primary-950 text-white dark:bg-white dark:text-dark-950"
                        : "hover:bg-gray-100 dark:hover:bg-dark-800"
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
                className="w-10 h-10 border rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-dark-800"
              >
                -
              </button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-dark-800"
              >
                +
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
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

      {/* Reviews */}
      <section className="mt-20">
        <h2 className="font-display text-2xl font-bold mb-8">Reviews</h2>

        {product.reviews.length > 0 ? (
          <div className="space-y-6 mb-10">
            {product.reviews.map((review) => (
              <div
                key={review._id}
                className="border rounded-2xl p-6 dark:border-gray-800"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{review.name}</span>
                  <div className="flex text-yellow-400 text-sm">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 mb-10">No reviews yet.</p>
        )}

        <form onSubmit={handleReview} className="border rounded-2xl p-6 dark:border-gray-800 max-w-lg">
          <h3 className="font-medium mb-4">Write a Review</h3>
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Rating</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className={`text-2xl ${
                    star <= reviewRating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Comment</label>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="input-field"
              rows="3"
              required
            />
          </div>
          <button type="submit" className="btn-primary text-sm">
            Submit Review
          </button>
        </form>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl font-bold mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductPage;
