import PropTypes from "prop-types";
import { X, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";

const ActiveFilterChips = ({ filters, onRemoveFilter, onClearAll }) => {
  const allCategory = useSelector((state) => state?.product?.allCategory || []);

  const chips = [];

  // In Stock
  if (filters.inStock) {
    chips.push({
      key: "inStock",
      label: "In Stock Only",
      onRemove: () => onRemoveFilter({ inStock: false }),
    });
  }

  // Price
  if (filters.minPrice !== "" || filters.maxPrice !== "") {
    const min = filters.minPrice !== "" ? `৳${filters.minPrice}` : "৳0";
    const max = filters.maxPrice !== "" ? `৳${filters.maxPrice}` : "Any";
    chips.push({
      key: "price",
      label: `Price: ${min} - ${max}`,
      onRemove: () => onRemoveFilter({ minPrice: "", maxPrice: "" }),
    });
  }

  // Categories
  if (filters.categoryId) {
    const catIds = Array.isArray(filters.categoryId) ? filters.categoryId : [filters.categoryId];
    catIds.forEach((id) => {
      const catObj = allCategory.find((c) => c._id === id);
      chips.push({
        key: `cat_${id}`,
        label: catObj?.name || "Category",
        onRemove: () => {
          const next = catIds.filter((cid) => cid !== id);
          onRemoveFilter({ categoryId: next.length > 0 ? next : "" });
        },
      });
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 py-2">
      <span className="text-xs font-semibold text-gray-400">Active:</span>

      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs"
        >
          <span>{chip.label}</span>
          <button
            type="button"
            onClick={chip.onRemove}
            className="text-blue-500 hover:text-blue-900 rounded-full hover:bg-blue-100 p-0.5 transition-colors cursor-pointer"
            title="Remove filter"
          >
            <X size={12} />
          </button>
        </span>
      ))}

      {chips.length > 1 && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 px-1.5 py-1 cursor-pointer"
        >
          <Trash2 size={12} />
          <span>Clear All</span>
        </button>
      )}
    </div>
  );
};

ActiveFilterChips.propTypes = {
  filters: PropTypes.object.isRequired,
  onRemoveFilter: PropTypes.func.isRequired,
  onClearAll: PropTypes.func.isRequired,
};

export default ActiveFilterChips;
