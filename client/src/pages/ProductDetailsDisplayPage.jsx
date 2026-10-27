import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import AxiosToastError from "../utils/AxioxToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { DisplayPriceInBDT } from "../utils/DisplayPriceInBDT";
import { calculatePriceWithDiscount } from "../utils/calculatePriceWithDiscount.js";
import AddToCartButton from "../components/DesignModel/AddToCartButton.jsx";
import ProductDisplayCard from "../components/DesignModel/ProductDisplayCard";
import { URLvalidation } from "../utils/URLValidation";
import Divider from "../components/Divider";
import StarRating from "../components/StarRating";
import ReviewModal from "../components/ReviewModal";
import toast from "react-hot-toast";
import {
  ChevronRight,
  ChevronLeft,
  Truck,
  CreditCard,
  Tag,
  ShieldCheck,
  RotateCcw,
  Package,
  Star,
  ThumbsUp,
  MessageSquare,
  Trash2,
  Edit3,
  Sparkles,
} from "lucide-react";

const ProductDetailsDisplayPage = () => {
  const params = useParams();
  const productParams = params["product-details"] || "";
  const productIdFromParams = productParams.split("-").slice(-1)[0];

  const [productDetailsData, setProductDetailsData] = useState({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    unit: "",
    stock: 0,
    price: 0,
    discount: 0,
    description: "",
    more_details: {},
  });

  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const relatedScrollRef = useRef(null);

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productIdFromParams]);

  const fetchRelatedProducts = async (catId, currentProdId) => {
    try {
      const response = await Axios({
        ...SummaryApi.getProductByCategoryWise,
        data: {
          categoryId: catId,
        },
      });
      if (response.data.success && Array.isArray(response.data.data)) {
        const filtered = response.data.data.filter(
          (item) => item._id !== currentProdId
        );
        setRelatedProducts(filtered);
      }
    } catch {
      // Gracefully handle error
    }
  };

  const fetchSingleProductDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getSingleProductDetails,
        data: {
          productId: productIdFromParams,
        },
      });

      if (response.data.success) {
        const prod = response.data.data;
        setProductDetailsData(prod);
        setSelectedImage(0);

        const categoryId = Array.isArray(prod?.category)
          ? prod.category[0]?._id || prod.category[0]
          : prod?.category?._id || prod?.category;

        if (categoryId) {
          fetchRelatedProducts(categoryId, prod._id);
        }
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  }, [productIdFromParams]);

  useEffect(() => {
    if (productIdFromParams) {
      fetchSingleProductDetails();
    }
  }, [productIdFromParams, fetchSingleProductDetails]);

  // Product Reviews State & Operations
  const currentUser = useSelector((state) => state?.user);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [reviewFilter, setReviewFilter] = useState("all");
  const [reviewSort, setReviewSort] = useState("newest");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const fetchReviews = useCallback(async () => {
    if (!productIdFromParams) return;
    try {
      setReviewsLoading(true);
      const params = new URLSearchParams({
        rating: reviewFilter,
        sortBy: reviewSort,
      });

      const response = await Axios({
        ...SummaryApi.getProductReviews,
        url: `${SummaryApi.getProductReviews.url}/${productIdFromParams}?${params.toString()}`,
      });

      if (response.data.success) {
        setReviews(response.data.data || []);
        if (response.data.stats) {
          setReviewStats(response.data.stats);
        }
      }
    } catch {
      // Handled silently
    } finally {
      setReviewsLoading(false);
    }
  }, [productIdFromParams, reviewFilter, reviewSort]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleToggleLikeReview = async (reviewId) => {
    if (!currentUser?._id) {
      toast.error("Please login to upvote reviews!");
      return;
    }

    try {
      const response = await Axios({
        ...SummaryApi.toggleLikeReview,
        url: `${SummaryApi.toggleLikeReview.url}/${reviewId}`,
      });

      if (response.data.success) {
        setReviews((prev) =>
          prev.map((r) => {
            if (r._id === reviewId) {
              const currentUserId = currentUser._id;
              const hasLiked = r.likes?.some((id) => (id?._id || id) === currentUserId);
              const updatedLikes = hasLiked
                ? r.likes.filter((id) => (id?._id || id) !== currentUserId)
                : [...(r.likes || []), currentUserId];
              return { ...r, likes: updatedLikes };
            }
            return r;
          })
        );
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete your review?")) return;

    try {
      const response = await Axios({
        ...SummaryApi.deleteReview,
        url: `${SummaryApi.deleteReview.url}/${reviewId}`,
      });

      if (response.data.success) {
        toast.success("Review deleted successfully!");
        fetchReviews();
        if (response.data.productStats) {
          setProductDetailsData((prev) => ({
            ...prev,
            averageRating: response.data.productStats.averageRating,
            totalReviews: response.data.productStats.totalReviews,
          }));
        }
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const myReview = reviews.find(
    (r) => (r.userId?._id || r.userId) === currentUser?._id
  );

  const scrollRelated = (direction) => {
    if (relatedScrollRef.current) {
      relatedScrollRef.current.scrollBy({
        left: direction === "left" ? -340 : 340,
        behavior: "smooth",
      });
    }
  };

  if (loading && !productDetailsData?.name) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-4">
        <div className="container mx-auto px-2 sm:px-4 space-y-4">
          <div className="h-4 w-56 bg-slate-200 rounded animate-pulse"></div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-slate-100 rounded-lg animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-slate-100 rounded animate-pulse"></div>
              <div className="h-4 w-32 bg-slate-100 rounded animate-pulse"></div>
              <div className="h-10 w-44 bg-slate-100 rounded animate-pulse"></div>
              <div className="h-12 w-56 bg-slate-100 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const originalPrice = Number(productDetailsData?.price) || 0;
  const discountPercent = Number(productDetailsData?.discount) || 0;
  const discountedPrice =
    discountPercent > 0
      ? calculatePriceWithDiscount(originalPrice, discountPercent)
      : originalPrice;

  const firstCategory = Array.isArray(productDetailsData?.category)
    ? productDetailsData.category[0]
    : productDetailsData?.category;
  const firstSubCategory = Array.isArray(productDetailsData?.subCategory)
    ? productDetailsData.subCategory[0]
    : productDetailsData?.subCategory;

  const categoryUrl =
    firstCategory && firstSubCategory
      ? `/${URLvalidation(firstCategory.name || "category")}-${firstCategory._id}/${URLvalidation(firstSubCategory.name || "subcategory")}-${firstSubCategory._id}`
      : firstCategory
      ? `/${URLvalidation(firstCategory.name || "category")}-${firstCategory._id}`
      : "/";

  const hasMoreDetails =
    productDetailsData?.more_details &&
    Object.keys(productDetailsData.more_details).length > 0;

  return (
    <div className="min-h-screen bg-slate-50/50 py-3 sm:py-5 text-slate-800">
      <div className="container mx-auto px-2 sm:px-4 space-y-5">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 overflow-x-auto whitespace-nowrap py-1">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          {firstCategory?.name && (
            <>
              <ChevronRight size={13} className="text-slate-400 shrink-0" />
              <Link
                to={categoryUrl}
                className="hover:text-blue-600 transition-colors"
              >
                {firstCategory.name}
              </Link>
            </>
          )}
          {firstSubCategory?.name && (
            <>
              <ChevronRight size={13} className="text-slate-400 shrink-0" />
              <span className="text-slate-600 font-medium">
                {firstSubCategory.name}
              </span>
            </>
          )}
          <ChevronRight size={13} className="text-slate-400 shrink-0" />
          <span className="text-slate-900 font-semibold truncate max-w-[280px]">
            {productDetailsData.name}
          </span>
        </nav>

        {/* Main Product Showcase Card - Spans Container Width */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* ================= LEFT PART (Image Gallery + Description + Specs) ================= */}
            <div className="space-y-6">
              {/* Product Main Image Box */}
              <div className="relative w-full h-[360px] sm:h-[420px] lg:h-[460px] bg-white border border-slate-200 rounded-lg p-6 flex items-center justify-center overflow-hidden">
                {discountPercent > 0 && (
                  <span className="absolute top-4 left-4 bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded shadow-xs z-10">
                    {discountPercent}% OFF
                  </span>
                )}

                {productDetailsData.image?.[selectedImage] ? (
                  <img
                    src={productDetailsData.image[selectedImage]}
                    alt={productDetailsData.name}
                    className="w-full h-full object-contain transition-transform duration-300 hover:scale-105 select-none"
                  />
                ) : (
                  <div className="text-slate-400 flex flex-col items-center gap-1">
                    <Package size={52} />
                    <span className="text-xs">No image available</span>
                  </div>
                )}
              </div>

              {/* Thumbnails Row */}
              {productDetailsData.image?.length > 1 && (
                <div className="flex gap-3 overflow-x-auto py-1 scrollbar-none">
                  {productDetailsData.image.map((imgUrl, index) => {
                    const isActive = selectedImage === index;
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`w-20 h-20 rounded-md border-2 p-1.5 shrink-0 bg-white cursor-pointer transition-all ${
                          isActive
                            ? "border-blue-600 ring-2 ring-blue-100 shadow-xs"
                            : "border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt=""
                          className="w-full h-full object-contain"
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              <Divider />

              {/* Product Description */}
              <div className="space-y-2.5">
                <h3 className="font-bold text-base sm:text-lg text-slate-900">
                  Product Description
                </h3>
                {productDetailsData.description ? (
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                    {productDetailsData.description}
                  </p>
                ) : (
                  <p className="text-sm text-slate-400 italic">
                    No description provided for this product.
                  </p>
                )}
              </div>

              {/* Specifications / More Details */}
              {hasMoreDetails && (
                <div className="space-y-3 pt-2">
                  <h3 className="font-bold text-base sm:text-lg text-slate-900">
                    Product Specifications
                  </h3>
                  <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100 text-sm">
                    {Object.entries(productDetailsData.more_details).map(
                      ([key, val], idx) => (
                        <div
                          key={idx}
                          className={`grid grid-cols-3 p-3.5 ${
                            idx % 2 === 0 ? "bg-slate-50/60" : "bg-white"
                          }`}
                        >
                          <span className="font-medium text-slate-600 capitalize">
                            {key}
                          </span>
                          <span className="col-span-2 text-slate-900">
                            {val}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ================= RIGHT PART (Product Info + Action + Benefits) ================= */}
            <div className="lg:sticky lg:top-24 space-y-5">
              {/* Badges: Stock & Unit */}
              <div className="flex items-center gap-2.5 flex-wrap">
                {productDetailsData.stock > 0 ? (
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-3 py-1 rounded-full">
                    {productDetailsData.stock} in stock
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-rose-700 bg-rose-100 border border-rose-200 px-3 py-1 rounded-full">
                    Out of Stock
                  </span>
                )}

                {productDetailsData.unit && (
                  <span className="text-xs font-medium text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                    Unit: {productDetailsData.unit}
                  </span>
                )}
              </div>

              {/* Product Title */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug tracking-tight">
                  {productDetailsData.name}
                </h1>
                
                {/* Rating Overview & Reviews Anchor */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      document.getElementById("customer-reviews-section")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-flex items-center gap-1.5 group cursor-pointer"
                  >
                    <StarRating
                      rating={reviewStats.averageRating || productDetailsData.averageRating || 0}
                      showScore={true}
                      size={17}
                    />
                    <span className="text-xs text-blue-600 font-semibold group-hover:underline">
                      ({reviewStats.totalReviews || productDetailsData.totalReviews || 0} reviews)
                    </span>
                  </button>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                    <ShieldCheck size={13} className="text-emerald-600" />
                    Verified Quality
                  </span>
                </div>
              </div>

              {/* Price Block */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-lg p-4 flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl sm:text-4xl font-extrabold text-blue-600">
                  {DisplayPriceInBDT(discountedPrice)}
                </span>

                {discountPercent > 0 && (
                  <>
                    <span className="text-lg text-slate-400 line-through font-medium">
                      {DisplayPriceInBDT(originalPrice)}
                    </span>
                    <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded">
                      Save {DisplayPriceInBDT(originalPrice - discountedPrice)}
                    </span>
                  </>
                )}
              </div>

              {/* Add To Cart Button */}
              <div className="w-full sm:w-60 pt-1">
                {productDetailsData.stock === 0 ? (
                  <button
                    disabled
                    className="w-full py-3 px-5 bg-slate-100 text-slate-400 font-bold text-sm rounded cursor-not-allowed border border-slate-200"
                  >
                    Out of Stock
                  </button>
                ) : (
                  <AddToCartButton
                    productData={productDetailsData}
                    iconSize={18}
                    className="h-10 px-4 text-sm font-semibold"
                  />
                )}
              </div>

              <Divider />

              {/* Why Shopping From Us Section */}
              <div className="space-y-4 pt-1">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                  Why Shop With PiMart?
                </h4>

                <div className="space-y-3.5 text-sm text-slate-700">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Truck size={18} />
                    </div>
                    <div>
                      <h5 className="font-semibold text-slate-900 text-sm">
                        Fast Delivery
                      </h5>
                      <p className="text-xs sm:text-sm text-slate-500 leading-normal">
                        Get your products delivered to your doorstep in no time!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <h5 className="font-semibold text-slate-900 text-sm">
                        Cash on Delivery
                      </h5>
                      <p className="text-xs sm:text-sm text-slate-500 leading-normal">
                        Pay cash or mobile payment upon delivery.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Tag size={18} />
                    </div>
                    <div>
                      <h5 className="font-semibold text-slate-900 text-sm">
                        Best Price Guarantee
                      </h5>
                      <p className="text-xs sm:text-sm text-slate-500 leading-normal">
                        Always the most competitive prices on authentic items.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <h5 className="font-semibold text-slate-900 text-sm">
                        100% Authentic
                      </h5>
                      <p className="text-xs sm:text-sm text-slate-500 leading-normal">
                        Directly sourced from trusted brands and genuine farms.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                      <RotateCcw size={18} />
                    </div>
                    <div>
                      <h5 className="font-semibold text-slate-900 text-sm">
                        Easy Return & Replacement
                      </h5>
                      <p className="text-xs sm:text-sm text-slate-500 leading-normal">
                        Instant replacement or refund if any issue with your order.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= CUSTOMER REVIEWS & RATINGS SECTION ================= */}
        <div
          id="customer-reviews-section"
          className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-7 space-y-6"
        >
          {/* Header & Write Review Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Customer Reviews
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                  {reviewStats.totalReviews} {reviewStats.totalReviews === 1 ? "Review" : "Reviews"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Authentic opinions and photo experiences from verified shoppers
              </p>
            </div>

            <button
              onClick={() => {
                if (!currentUser?._id) {
                  toast.error("Please login to write a review!");
                  return;
                }
                setIsReviewModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs sm:text-sm hover:bg-blue-700 shadow-md shadow-blue-200 transition-all cursor-pointer w-fit"
            >
              {myReview ? <Edit3 size={15} /> : <MessageSquare size={15} />}
              <span>{myReview ? "Edit Your Review" : "Write a Review"}</span>
            </button>
          </div>

          {/* Rating Summary & Breakdown Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-4 sm:p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 items-center">
            {/* Big Score Box (4 cols) */}
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-3 border-b md:border-b-0 md:border-r border-slate-200">
              <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                {Number(reviewStats.averageRating || 0).toFixed(1)}
              </span>
              <div className="py-2">
                <StarRating
                  rating={reviewStats.averageRating || 0}
                  size={22}
                />
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Based on {reviewStats.totalReviews} verified customer reviews
              </span>
              {reviewStats.totalReviews > 0 && (
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100/80 text-emerald-800 border border-emerald-200">
                  <Sparkles size={12} />
                  <span>
                    {Math.round(
                      (((reviewStats.breakdown[5] || 0) + (reviewStats.breakdown[4] || 0)) /
                        (reviewStats.totalReviews || 1)) *
                        100
                    )}
                    % of buyers recommend this product
                  </span>
                </div>
              )}
            </div>

            {/* Distribution Progress Bars (8 cols) */}
            <div className="md:col-span-8 space-y-2">
              {[5, 4, 3, 2, 1].map((starNum) => {
                const count = reviewStats.breakdown?.[starNum] || 0;
                const percent =
                  reviewStats.totalReviews > 0
                    ? Math.round((count / reviewStats.totalReviews) * 100)
                    : 0;

                const isFiltered = reviewFilter === starNum.toString();

                return (
                  <button
                    key={starNum}
                    type="button"
                    onClick={() =>
                      setReviewFilter((prev) =>
                        prev === starNum.toString() ? "all" : starNum.toString()
                      )
                    }
                    className={`w-full flex items-center gap-3 text-xs font-medium p-1.5 rounded-lg transition-colors cursor-pointer ${
                      isFiltered ? "bg-blue-50 ring-1 ring-blue-200" : "hover:bg-slate-100"
                    }`}
                  >
                    <span className="w-12 text-slate-700 font-bold shrink-0 flex items-center gap-1">
                      <span>{starNum}</span>
                      <Star size={13} className="fill-amber-400 text-amber-400" />
                    </span>

                    {/* Progress Track */}
                    <div className="flex-1 h-2.5 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <span className="w-10 text-right text-slate-500 font-semibold shrink-0">
                      {percent}%
                    </span>
                    <span className="w-8 text-right text-slate-400 text-[11px] shrink-0">
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Review Filter Tabs & Sort Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-bold text-slate-500 mr-1">Filter:</span>
              {["all", "5", "4", "3", "2", "1"].map((tab) => {
                const isActive = reviewFilter === tab;
                const label = tab === "all" ? "All" : `${tab} Star`;
                return (
                  <button
                    key={tab}
                    onClick={() => setReviewFilter(tab)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? "bg-slate-900 text-white shadow-2xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs font-semibold text-slate-500">Sort by:</span>
              <select
                value={reviewSort}
                onChange={(e) => setReviewSort(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>
          </div>

          {/* Reviews List */}
          {reviewsLoading ? (
            <div className="space-y-4 py-4 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-slate-100 rounded-xl" />
              ))}
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-4 divide-y divide-slate-100">
              {reviews.map((rev) => {
                const userObj = rev.userId || {};
                const userName = userObj.name || "PiMart Customer";
                const userInitial = userName.charAt(0).toUpperCase();
                const isMyReview = (userObj._id || userObj) === currentUser?._id;
                const isLiked = rev.likes?.some(
                  (id) => (id?._id || id) === currentUser?._id
                );

                return (
                  <div key={rev._id} className="pt-4 first:pt-0 space-y-3">
                    {/* User and Verification Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-xs shadow-2xs shrink-0">
                          {userInitial}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-slate-900">
                              {userName}
                            </span>
                            {rev.isVerifiedPurchase && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <ShieldCheck size={11} className="text-emerald-600" />
                                Verified Buyer
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {new Date(rev.createdAt).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Owner Action Buttons */}
                      {isMyReview && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setIsReviewModalOpen(true)}
                            title="Edit Review"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteReview(rev._id)}
                            title="Delete Review"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Star Rating & Headline */}
                    <div className="space-y-1">
                      <StarRating rating={rev.rating} size={15} />
                      {rev.title && (
                        <h5 className="font-bold text-xs sm:text-sm text-slate-900">
                          {rev.title}
                        </h5>
                      )}
                    </div>

                    {/* Comment */}
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                      {rev.comment}
                    </p>

                    {/* Review Attached Photos */}
                    {rev.images && rev.images.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {rev.images.map((imgUrl, imgIdx) => (
                          <button
                            key={imgIdx}
                            onClick={() => setPreviewPhoto(imgUrl)}
                            className="w-16 h-16 rounded-xl border border-slate-200 overflow-hidden hover:opacity-90 transition-opacity cursor-pointer shadow-2xs"
                          >
                            <img
                              src={imgUrl}
                              alt="Review attachment"
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Helpful Upvote Button */}
                    <div className="pt-1 flex items-center gap-3">
                      <button
                        onClick={() => handleToggleLikeReview(rev._id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                          isLiked
                            ? "bg-blue-50 text-blue-700 border-blue-200 font-bold"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <ThumbsUp size={12} className={isLiked ? "fill-blue-600" : ""} />
                        <span>Helpful ({rev.likes?.length || 0})</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty Reviews */
            <div className="text-center py-10 px-4 rounded-2xl bg-slate-50/50 border border-dashed border-slate-200">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
                <Star size={22} />
              </div>
              <h4 className="text-sm font-bold text-slate-900">No Reviews Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Be the first customer to share your experience with this product!
              </p>
              <button
                onClick={() => {
                  if (!currentUser?._id) {
                    toast.error("Please login to write a review!");
                    return;
                  }
                  setIsReviewModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-sm transition-all cursor-pointer"
              >
                <MessageSquare size={13} />
                <span>Write the First Review</span>
              </button>
            </div>
          )}
        </div>

        {/* Photo Lightbox Modal */}
        {previewPhoto && (
          <div
            onClick={() => setPreviewPhoto(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 cursor-pointer"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl max-h-[85vh] bg-white rounded-2xl overflow-hidden shadow-2xl p-2"
            >
              <img
                src={previewPhoto}
                alt="Enlarged review photo"
                className="w-full h-full max-h-[80vh] object-contain rounded-xl"
              />
              <button
                onClick={() => setPreviewPhoto(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center cursor-pointer hover:bg-black transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Review Modal */}
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          product={productDetailsData}
          existingReview={myReview}
          onSuccess={(savedReview, updatedStats) => {
            fetchReviews();
            if (updatedStats) {
              setReviewStats((prev) => ({
                ...prev,
                averageRating: updatedStats.averageRating,
                totalReviews: updatedStats.totalReviews,
              }));
              setProductDetailsData((prev) => ({
                ...prev,
                averageRating: updatedStats.averageRating,
                totalReviews: updatedStats.totalReviews,
              }));
            }
          }}
        />

        {/* ================= SIMILAR PRODUCTS SECTION ================= */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  Similar Products
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Customers who viewed this item also explored these products
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => scrollRelated("left")}
                  className="w-8 h-8 rounded border border-slate-200 hover:border-blue-500 hover:text-blue-600 flex items-center justify-center transition-colors cursor-pointer bg-white"
                  aria-label="Previous"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => scrollRelated("right")}
                  className="w-8 h-8 rounded border border-slate-200 hover:border-blue-500 hover:text-blue-600 flex items-center justify-center transition-colors cursor-pointer bg-white"
                  aria-label="Next"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div
              ref={relatedScrollRef}
              className="flex gap-4 overflow-x-auto pb-2 pt-1 scrollbar-none scroll-smooth"
            >
              {relatedProducts.map((prod) => (
                <div
                  key={prod._id}
                  className="min-w-[200px] sm:min-w-[250px] shrink-0"
                >
                  <ProductDisplayCard productData={prod} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsDisplayPage;
