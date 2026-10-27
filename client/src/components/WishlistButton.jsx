import { useState } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxioxToastError";
import { addToWishlist, removeFromWishlist } from "../store/wishlistSlice";

const WishlistButton = ({
  productId,
  productData = null,
  size = 18,
  className = "",
  showText = false,
}) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state?.user);
  const wishlistProductIds = useSelector(
    (state) => state?.wishlist?.wishlistProductIds || []
  );

  const [loading, setLoading] = useState(false);

  const prodId = productId || productData?._id;
  const isInWishlist = wishlistProductIds.includes(prodId);

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser?._id) {
      toast.error("Please login to add items to your Wishlist!");
      return;
    }

    if (!prodId) return;

    // Optimistic UI update
    if (isInWishlist) {
      dispatch(removeFromWishlist(prodId));
    } else {
      dispatch(
        addToWishlist({
          _id: `temp-${Date.now()}`,
          userId: currentUser._id,
          productId: productData || { _id: prodId },
          createdAt: new Date().toISOString(),
        })
      );
    }

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.toggleWishlist,
        data: { productId: prodId },
      });

      if (response.data.success) {
        if (response.data.isAdded) {
          toast.success("Added to your Wishlist! ❤️");
        } else {
          toast.success("Removed from Wishlist.");
        }
      }
    } catch (error) {
      // Rollback on error
      if (isInWishlist) {
        dispatch(
          addToWishlist({
            _id: `temp-${Date.now()}`,
            userId: currentUser._id,
            productId: productData || { _id: prodId },
          })
        );
      } else {
        dispatch(removeFromWishlist(prodId));
      }
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggleWishlist}
      disabled={loading}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      title={isInWishlist ? "Saved in Wishlist" : "Save for Later"}
      className={`group cursor-pointer transition-all duration-300 focus:outline-hidden ${className}`}
    >
      <div className="flex items-center gap-1.5">
        <div
          className={`p-1.5 rounded-full transition-transform active:scale-75 ${
            isInWishlist
              ? "bg-rose-50 text-rose-500 shadow-2xs"
              : "bg-white/90 backdrop-blur-xs text-gray-400 hover:text-rose-500 hover:bg-rose-50 shadow-2xs"
          }`}
        >
          <Heart
            size={size}
            className={`transition-all duration-300 ${
              isInWishlist
                ? "fill-rose-500 text-rose-500 scale-110 drop-shadow-2xs animate-in zoom-in-75 duration-200"
                : "group-hover:scale-110"
            }`}
          />
        </div>
        {showText && (
          <span
            className={`text-xs font-bold transition-colors ${
              isInWishlist ? "text-rose-600" : "text-gray-700 group-hover:text-rose-600"
            }`}
          >
            {isInWishlist ? "Saved to Wishlist" : "Save for Later"}
          </span>
        )}
      </div>
    </button>
  );
};

WishlistButton.propTypes = {
  productId: PropTypes.string,
  productData: PropTypes.object,
  size: PropTypes.number,
  className: PropTypes.string,
  showText: PropTypes.bool,
};

export default WishlistButton;
