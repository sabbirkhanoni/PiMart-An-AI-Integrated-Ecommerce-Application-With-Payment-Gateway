import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import {
  SlidersHorizontal,
  RotateCcw,
  Check,
  Tag,
  DollarSign,
  PackageCheck,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

const quickPriceRanges = [
  { label: "All Prices", min: "", max: "" },
  { label: "Under ৳100", min: 0, max: 100 },
  { label: "৳100 - ৳500", min: 100, max: 500 },
  { label: "৳500 - ৳1,000", min: 500, max: 1000 },
  { label: "Over ৳1,000", min: 1000, max: "" },
];

const ProductFilterSidebar = ({
  filters,
  onFilterChange,
  onResetFilters,
  priceBounds = { minPrice: 0, maxPrice: 2000 },
  showCategories = true,
  onCloseMobile,
}) => {
  const allCategory = useSelector((state) => state?.product?.allCategory || []);

  const [localMin, setLocalMin] = useState(filters.minPrice ?? "");
  const [localMax, setLocalMax] = useState(filters.maxPrice ?? "");

  useEffect(() => {
    setLocalMin(filters.minPrice ?? "");
    setLocalMax(filters.maxPrice ?? "");
  }, [filters.minPrice, filters.maxPrice]);

  const handleApplyPrice = (e) => {
    e?.preventDefault();
    onFilterChange({
      minPrice: localMin !== "" ? Number(localMin) : "",
      maxPrice: localMax !== "" ? Number(localMax) : "",
    });
  };

  const handleQuickPrice = (min, max) => {
    setLocalMin(min);
    setLocalMax(max);
    onFilterChange({
      minPrice: min,
      maxPrice: max,
    });
  };

  const handleCategoryToggle = (catId) => {
    const current = filters.categoryId ? (Array.isArray(filters.categoryId) ? filters.categoryId : [filters.categoryId]) : [];
    const exists = current.includes(catId);
    let next;
    if (exists) {
      next = current.filter((id) => id !== catId);
    } else {
      next = [...current, catId];
    }
    onFilterChange({ categoryId: next.length > 0 ? next : "" });
  };

  const isQuickPriceActive = (min, max) => {
    const currentMin = filters.minPrice ?? "";
    const currentMax = filters.maxPrice ?? "";
    return currentMin === min && currentMax === max;
  };

  return (
    <aside className="bg-white rounded-2xl border border-gray-100 shadow-xs p-4 md:p-5 space-y-6">
      {/* Title & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <SlidersHorizontal size={18} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm md:text-base">Filters</h3>
            <p className="text-[11px] text-gray-500">Refine catalog results</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-blue-600 px-2 py-1 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
            title="Reset all filters"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>

          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="md:hidden p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Availability / In-Stock Toggle */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
          Availability
        </label>
        <label className="flex items-center justify-between p-2.5 rounded-xl border border-gray-200/80 hover:border-blue-300 hover:bg-blue-50/20 cursor-pointer transition-all">
          <div className="flex items-center gap-2.5">
            <PackageCheck size={18} className="text-emerald-600" />
            <div>
              <span className="text-sm font-semibold text-gray-800 block">In Stock Only</span>
              <span className="text-[11px] text-gray-500">Hide out-of-stock items</span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={!!filters.inStock}
            onChange={(e) => onFilterChange({ inStock: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
          />
        </label>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Price Range (BDT)
          </label>
          <span className="text-[11px] font-medium text-gray-500">
            ৳{priceBounds.minPrice} - ৳{priceBounds.maxPrice}
          </span>
        </div>

        {/* Quick price chips */}
        <div className="flex flex-wrap gap-1.5">
          {quickPriceRanges.map((range, idx) => {
            const active = isQuickPriceActive(range.min, range.max);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickPrice(range.min, range.max)}
                className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                  active
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>

        {/* Custom Min / Max Inputs */}
        <form onSubmit={handleApplyPrice} className="space-y-2 pt-1">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-medium text-gray-500 block mb-1">Min (৳)</label>
              <input
                type="number"
                placeholder="0"
                min="0"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-gray-500 block mb-1">Max (৳)</label>
              <input
                type="number"
                placeholder={priceBounds.maxPrice || "2000"}
                min="0"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            Apply Price
          </button>
        </form>
      </div>

      {/* Category Filter (if enabled) */}
      {showCategories && allCategory.length > 0 && (
        <div className="space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
            Category
          </label>
          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
            {allCategory.map((cat) => {
              const current = filters.categoryId
                ? Array.isArray(filters.categoryId)
                  ? filters.categoryId
                  : [filters.categoryId]
                : [];
              const isChecked = current.includes(cat._id);

              return (
                <label
                  key={cat._id}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 cursor-pointer text-xs transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCategoryToggle(cat._id)}
                    className="w-3.5 h-3.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className={`truncate ${isChecked ? "font-bold text-blue-600" : "text-gray-700"}`}>
                    {cat.name}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
};

ProductFilterSidebar.propTypes = {
  filters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired,
  priceBounds: PropTypes.object,
  showCategories: PropTypes.bool,
  onCloseMobile: PropTypes.func,
};

export default ProductFilterSidebar;
