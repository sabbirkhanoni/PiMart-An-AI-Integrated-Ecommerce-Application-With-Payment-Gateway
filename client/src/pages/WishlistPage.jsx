import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../contexts/GlobalContext";
import { removeFromWishlist } from "../store/wishlistSlice";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxioxToastError";
import toast from "react-hot-toast";
import { DisplayPriceInBDT } from "../utils/DisplayPriceInBDT";
import { calculatePriceWithDiscount } from "../utils/calculatePriceWithDiscount";
import { URLvalidation } from "../utils/URLValidation";
import AddToCartButton from "../components/DesignModel/AddToCartButton";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ExternalLink,
  Package,
  ArrowRight,
} from "lucide-react";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { fetchWishlistItems } = useGlobalContext();
  const wishlistItems = useSelector(
    (state) => state?.wishlist?.wishlistItems || []
  );

  useEffect(() => {
    if (fetchWishlistItems) {
      fetchWishlistItems();
    }
  }, []);

  const handleRemoveFromWishlist = async (productId) => {
    // Optimistic removal
    dispatch(removeFromWishlist(productId));

    try {
      const response = await Axios({
        ...SummaryApi.toggleWishlist,
        data: { productId },
      });

      if (response.data.success) {
        toast.success("Removed from your Wishlist.");
      }
    } catch (error) {
      AxiosToastError(error);
      if (fetchWishlistItems) {
        fetchWishlistItems();
      }
    }
  };

  return (
    <div className="bg-white p-3 md:p-6 min-h-screen space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-xs">
              <Heart size={20} className="fill-rose-500" />
            </div>
            <span>My Wishlist</span>
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Products you have saved to purchase later
          </p>
        </div>

        {wishlistItems.length > 0 && (
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 w-fit shadow-xs">
            {wishlistItems.length} {wishlistItems.length === 1 ? "Saved Item" : "Saved Items"}
          </span>
        )}
      </div>

      {/* Wishlist Items Grid or Empty State */}
      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlistItems.map((item) => {
            const product = item?.productId;
            if (!product) return null;

            const prodId = product._id;
            const productImage = Array.isArray(product.image)
              ? product.image[0]
              : product.image;

            const originalPrice = Number(product.price) || 0;
            const discount = Number(product.discount) || 0;
            const discountedPrice = calculatePriceWithDiscount(originalPrice, discount);

            const productUrl = `/product/${URLvalidation(product.name)}-${URLvalidation(
              prodId
            )}`;

            return (
              <div
                key={item._id || prodId}
                className="group relative bg-white rounded-2xl border border-gray-200 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Remove button (top right) */}
                <button
                  type="button"
                  onClick={() => handleRemoveFromWishlist(prodId)}
                  title="Remove from Wishlist"
                  className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-gray-400 hover:text-rose-600 hover:bg-rose-50 border border-gray-200 flex items-center justify-center transition-all cursor-pointer shadow-xs"
                >
                  <Trash2 size={14} />
                </button>

                {/* Discount Badge */}
                {discount > 0 && (
                  <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-md text-[10px] font-bold bg-green-600 text-white shadow-xs">
                    {discount}% OFF
                  </span>
                )}

                {/* Product Image Link */}
                <Link
                  to={productUrl}
                  className="relative block h-44 p-4 bg-gray-50/50 flex items-center justify-center overflow-hidden"
                >
                  {productImage ? (
                    <img
                      src={productImage}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 select-none"
                    />
                  ) : (
                    <Package size={36} className="text-gray-300" />
                  )}
                </Link>

                {/* Product Details Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Stock & Unit */}
                    <div className="flex items-center gap-2 text-[11px] mb-1">
                      {product.stock > 0 ? (
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                          In Stock
                        </span>
                      ) : (
                        <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded">
                          Out of Stock
                        </span>
                      )}
                      {product.unit && (
                        <span className="text-gray-500 font-medium">{product.unit}</span>
                      )}
                    </div>

                    {/* Product Name */}
                    <Link
                      to={productUrl}
                      className="block text-xs font-bold text-gray-900 hover:text-blue-600 line-clamp-2 transition-colors"
                      title={product.name}
                    >
                      {product.name}
                    </Link>
                  </div>

                  {/* Price & Action */}
                  <div className="space-y-3 pt-2 border-t border-gray-100">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-extrabold text-gray-900">
                        {DisplayPriceInBDT(discountedPrice)}
                      </span>
                      {discount > 0 && (
                        <span className="text-xs text-gray-400 line-through">
                          {DisplayPriceInBDT(originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <div className="w-full">
                      {product.stock > 0 ? (
                        <AddToCartButton
                          productData={product}
                          iconSize={15}
                          className="w-full h-9 text-xs font-bold justify-center"
                        />
                      ) : (
                        <button
                          disabled
                          className="w-full py-2 bg-gray-100 text-gray-400 rounded-lg text-xs font-semibold cursor-not-allowed text-center"
                        >
                          Out of Stock
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-50/60 rounded-3xl border border-dashed border-gray-300 text-center">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-4 shadow-sm">
            <Heart size={32} className="fill-rose-100" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            Your Wishlist is Empty
          </h2>
          <p className="text-xs md:text-sm text-gray-500 max-w-sm mt-1 mb-6">
            Explore our fresh daily grocery & organic collections and tap the heart icon to save items you love!
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 text-white font-bold text-xs md:text-sm hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <span>Explore Products</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
