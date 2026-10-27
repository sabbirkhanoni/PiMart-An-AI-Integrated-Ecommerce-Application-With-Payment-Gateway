import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import AxiosToastError from "../utils/AxioxToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { DisplayPriceInBDT } from "../utils/DisplayPriceInBDT";
import { calculatePriceWithDiscount } from "../utils/calculatePriceWithDiscount.js";
import AddToCartButton from "../components/DesignModel/AddToCartButton.jsx";
import ProductDisplayCard from "../components/DesignModel/ProductDisplayCard";
import { URLvalidation } from "../utils/URLValidation";
import Divider from "../components/Divider";
import {
  ChevronRight,
  ChevronLeft,
  Truck,
  CreditCard,
  Tag,
  ShieldCheck,
  RotateCcw,
  Package,
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
