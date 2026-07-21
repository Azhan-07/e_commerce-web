import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../utils/api";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import ProductCard from "../components/ProductCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import toast from "react-hot-toast";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useUser();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

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

        const reviewsRes = await API.get(`/products/${id}/reviews`);
        setReviews(reviewsRes.data.data.reviews || []);

        if (user) {
          const eligibility = await API.get(`/products/${id}/reviews/can-review`);
          setCanReview(eligibility.data.data.canReview);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, user]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await API.post(`/products/${id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment,
      });
      toast.success("Review submitted!");
      setShowReviewForm(false);
      setReviewComment("");
      setReviewRating(5);
      setCanReview(false);

      const reviewsRes = await API.get(`/products/${id}/reviews`);
      setReviews(reviewsRes.data.data.reviews || []);

      const { data } = await API.get(`/products/${id}`);
      setProduct(data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

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

          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 text-sm">
              {[...Array(5)].map((_, i) => (
                <span key={i}>{i < Math.round(product.rating) ? "★" : "☆"}</span>
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-2">
              ({product.numReviews} {product.numReviews === 1 ? "review" : "reviews"})
            </span>
          </div>

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

      {/* Reviews Section */}
      <section className="mt-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl font-bold">
            Customer Reviews ({reviews.length})
          </h2>
          {user && canReview && !showReviewForm && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="btn-primary btn-ripple text-sm"
            >
              Write a Review
            </button>
          )}
          {!user && (
            <Link to="/login" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
              Login to review
            </Link>
          )}
        </div>

        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className="border rounded-2xl p-6 dark:border-gray-800 mb-8 animate-slide-up">
            <h3 className="font-semibold mb-4">Your Review</h3>
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className={`text-2xl transition-colors ${
                      star <= reviewRating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">Comment (optional)</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={3}
                maxLength={1000}
                className="input-field w-full"
                placeholder="Share your experience with this product..."
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submittingReview}
                className="btn-primary btn-ripple text-sm"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="btn-secondary text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {reviews.length === 0 ? (
          <div className="text-center py-12 border rounded-2xl dark:border-gray-800">
            <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review, i) => (
              <div
                key={review._id}
                className="border rounded-2xl p-6 dark:border-gray-800 animate-slide-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-sm font-medium text-primary-700 dark:text-primary-400">
                      {(review.user?.fullname || "A").charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-sm">{review.user?.fullname || "Anonymous"}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex text-yellow-400 text-sm mb-2">
                  {[...Array(5)].map((_, j) => (
                    <span key={j}>{j < review.rating ? "★" : "☆"}</span>
                  ))}
                </div>
                {review.comment && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductPage;
