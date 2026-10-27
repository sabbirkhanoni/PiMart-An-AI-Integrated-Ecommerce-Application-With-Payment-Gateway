import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, ArrowDownUp, Sparkles, TrendingUp, TrendingDown, Star, Flame } from "lucide-react";

export const sortOptionsList = [
  { value: "newest", label: "Newest Arrivals", icon: Sparkles },
  { value: "price_asc", label: "Price: Low to High", icon: TrendingDown },
  { value: "price_desc", label: "Price: High to Low", icon: TrendingUp },
  { value: "discount_desc", label: "Highest Discount", icon: Flame },
  { value: "rating_desc", label: "Top Customer Rated", icon: Star },
];

const ProductSortDropdown = ({ currentSort = "newest", onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption =
    sortOptionsList.find((opt) => opt.value === currentSort) || sortOptionsList[0];
  const IconComponent = selectedOption.icon;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 hover:border-blue-400 rounded-xl text-xs md:text-sm font-semibold text-gray-700 shadow-2xs transition-all cursor-pointer"
      >
        <ArrowDownUp size={15} className="text-blue-600" />
        <span className="text-gray-500 font-normal hidden sm:inline">Sort:</span>
        <span className="font-bold text-gray-900">{selectedOption.label}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-40 animate-in fade-in-50 zoom-in-95">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">
            Sort Products By
          </div>
          {sortOptionsList.map((opt) => {
            const ItemIcon = opt.icon;
            const isSelected = opt.value === currentSort;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onSortChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-blue-50 text-blue-700 font-bold"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <ItemIcon size={14} className={isSelected ? "text-blue-600" : "text-gray-400"} />
                <span className="truncate">{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

ProductSortDropdown.propTypes = {
  currentSort: PropTypes.string,
  onSortChange: PropTypes.func.isRequired,
};

export default ProductSortDropdown;
