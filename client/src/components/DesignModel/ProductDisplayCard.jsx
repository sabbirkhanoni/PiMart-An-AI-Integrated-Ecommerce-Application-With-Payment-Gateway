import PropTypes from "prop-types";
import { DisplayPriceInBDT } from "../../utils/DisplayPriceInBDT";
import { URLvalidation } from "../../utils/URLValidation";
import { Link } from "react-router-dom";
import { calculatePriceWithDiscount } from "../../utils/calculatePriceWithDiscount";
import AddToCartButton from "./AddToCartButton";
import WishlistButton from "../WishlistButton";
import { Star } from "lucide-react";

const ProductDisplayCard = ({
  productData,
  className = "w-[185px] sm:w-[205px] md:w-[220px] shrink-0",
}) => {
  const URL = `/product/${URLvalidation(productData?.name)}-${URLvalidation(
    productData?._id
  )}`;

  return (
    <Link to={URL} className={`group block ${className}`}>
      <div className="relative bg-white border border-gray-200/90 hover:border-blue-300 rounded-2xl p-3 flex flex-col justify-between w-full h-[370px] shadow-2xs hover:shadow-lg transition-all duration-300 overflow-hidden">
        {/* Wishlist Floating Button */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <WishlistButton productData={productData} size={15} />
        </div>

        {/* Product Image Area */}
        <div className="relative w-full h-36 bg-gray-50/70 rounded-xl flex items-center justify-center p-2 overflow-hidden group-hover:bg-blue-50/20 transition-colors">
          <img
            src={productData?.image?.[0]}
            alt={productData?.name}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {productData?.discount > 0 && (
            <span className="absolute bottom-2 left-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
              {productData?.discount}% OFF
            </span>
          )}
        </div>

        {/* Product Meta: Unit & Stock */}
        <div className="flex items-center justify-between text-xs mt-2 px-0.5">
          <span className="text-gray-500 font-medium text-[11px] truncate max-w-[90px]">
            {productData?.unit || "1 unit"}
          </span>
          {productData?.stock > 0 ? (
            <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
              {productData?.stock} left
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
              Out of stock
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3
          className="font-semibold text-xs sm:text-sm text-gray-800 line-clamp-2 mt-1 min-h-[2.4rem] leading-snug group-hover:text-blue-600 transition-colors"
          title={productData?.name}
        >
          {productData?.name}
        </h3>

        {/* Rating preview */}
        <div className="flex items-center gap-1.5 mt-1">
          <div className="flex items-center gap-1 text-amber-600 text-[11px] font-bold bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200/60">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <span>
              {productData?.averageRating
                ? Number(productData.averageRating).toFixed(1)
                : "5.0"}
            </span>
          </div>
          <span className="text-[10px] text-gray-400">
            ({productData?.totalReviews || 0})
          </span>
        </div>

        {/* Price & Action Button (Fixed Bottom) */}
        <div className="mt-auto pt-2 border-t border-gray-100/90 space-y-2">
          <div className="flex items-baseline justify-between gap-1">
            {productData?.discount > 0 ? (
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="font-extrabold text-sm sm:text-base text-gray-900">
                  {DisplayPriceInBDT(
                    calculatePriceWithDiscount(
                      productData?.price,
                      productData?.discount
                    )
                  )}
                </span>
                <span className="text-[11px] text-gray-400 line-through">
                  {DisplayPriceInBDT(productData?.price)}
                </span>
              </div>
            ) : (
              <span className="font-extrabold text-sm sm:text-base text-gray-900">
                {DisplayPriceInBDT(productData?.price)}
              </span>
            )}
          </div>

          <div className="w-full">
            {productData?.stock > 0 ? (
              <AddToCartButton
                productData={productData}
                iconSize={15}
                className="w-full h-8 px-2 text-xs font-semibold rounded-xl"
              />
            ) : (
              <div className="w-full h-8 flex items-center justify-center text-xs font-semibold text-red-500 bg-red-50 rounded-xl border border-red-100">
                Out of Stock
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

ProductDisplayCard.propTypes = {
  productData: PropTypes.object,
  className: PropTypes.string,
};

export default ProductDisplayCard;
