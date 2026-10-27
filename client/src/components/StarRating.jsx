import { useState } from "react";
import PropTypes from "prop-types";
import { Star } from "lucide-react";

const StarRating = ({
  rating = 0,
  maxStars = 5,
  size = 16,
  interactive = false,
  onRatingChange = () => {},
  showScore = false,
  totalReviews = null,
  className = "",
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5">
        {[...Array(maxStars)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = displayRating >= starValue;
          const isHalfFilled = !isFilled && displayRating >= starValue - 0.5;

          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRatingChange(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              className={`${
                interactive
                  ? "cursor-pointer transition-transform hover:scale-125 focus:outline-hidden"
                  : "cursor-default"
              } p-0.5`}
              title={interactive ? `Rate ${starValue} star${starValue > 1 ? "s" : ""}` : `${rating} stars`}
            >
              <div className="relative">
                {/* Background empty star */}
                <Star
                  size={size}
                  className={`${
                    isFilled
                      ? "fill-amber-400 text-amber-400 drop-shadow-2xs"
                      : isHalfFilled
                      ? "text-amber-400"
                      : "text-gray-300"
                  } transition-colors`}
                />

                {/* Half star overlay if applicable */}
                {isHalfFilled && (
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: "50%" }}
                  >
                    <Star
                      size={size}
                      className="fill-amber-400 text-amber-400"
                    />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Numerical score */}
      {showScore && (
        <span className="font-extrabold text-gray-800 text-xs tracking-tight">
          {Number(rating).toFixed(1)}
        </span>
      )}

      {/* Total count in brackets */}
      {totalReviews !== null && (
        <span className="text-[11px] text-gray-400 font-medium">
          ({totalReviews})
        </span>
      )}
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number,
  maxStars: PropTypes.number,
  size: PropTypes.number,
  interactive: PropTypes.bool,
  onRatingChange: PropTypes.func,
  showScore: PropTypes.bool,
  totalReviews: PropTypes.number,
  className: PropTypes.string,
};

export default StarRating;
