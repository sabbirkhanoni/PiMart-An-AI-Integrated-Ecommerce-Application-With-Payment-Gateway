import { useState, useEffect } from "react";
import ProductSkeletonCardLoading from "../components/Mini/ProductSkeletonCardLoading";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxioxToastError";
import ProductDisplayCard from "../components/DesignModel/ProductDisplayCard";
import InfinteScroll from "react-infinite-scroll-component";
import { useLocation } from "react-router-dom";
import NoDataImage from "../assets/no-data.png";
import ProductFilterSidebar from "../components/ProductFilterSidebar";
import ProductSortDropdown from "../components/ProductSortDropdown";
import ActiveFilterChips from "../components/ActiveFilterChips";
import { SlidersHorizontal, Search as SearchIcon, X } from "lucide-react";

const initialFilters = {
  minPrice: "",
  maxPrice: "",
  inStock: false,
  categoryId: "",
};

const SearchPage = () => {
  const [searchedData, setSearchedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingCardArray = new Array(8).fill(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [priceBounds, setPriceBounds] = useState({ minPrice: 0, maxPrice: 2000 });

  const [filters, setFilters] = useState(initialFilters);
  const [sortBy, setSortBy] = useState("newest");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const params = useLocation();
  const searchParams = new URLSearchParams(params.search).get("q") || params?.search?.slice(3) || "";

  // Count active filters (excluding default)
  const activeFilterCount =
    (filters.inStock ? 1 : 0) +
    (filters.minPrice !== "" || filters.maxPrice !== "" ? 1 : 0) +
    (filters.categoryId ? (Array.isArray(filters.categoryId) ? filters.categoryId.length : 1) : 0);

  const fetchSearchedData = async (isNewQuery = false, targetPage = page) => {
    try {
      setLoading(true);

      const response = await Axios({
        ...SummaryApi.searchProduct,
        data: {
          page: targetPage,
          limit: 12,
          search: searchParams || "",
          sortBy,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          inStock: filters.inStock,
          categoryId: filters.categoryId,
        },
      });

      const { data: responseData } = response;
      if (responseData.success) {
        if (targetPage === 1 || isNewQuery) {
          setSearchedData(responseData.data || []);
        } else {
          setSearchedData((prev) => [...prev, ...(responseData.data || [])]);
        }
        setTotalPages(responseData.totalNoPages || 1);
        setTotalCount(responseData.totalCount || 0);

        if (responseData.priceBounds) {
          setPriceBounds(responseData.priceBounds);
        }
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchMoreData = () => {
    if (totalPages > page && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchSearchedData(false, nextPage);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    setSortBy("newest");
    setPage(1);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setPage(1);
  };

  // Re-fetch when search query, sort, or filters change
  useEffect(() => {
    window.scrollTo(0, 0);
    setPage(1);
    fetchSearchedData(true, 1);
  }, [searchParams, sortBy, filters]);

  return (
    <section className="bg-gray-50/50 min-h-screen py-4 md:py-6">
      <div className="container mx-auto px-3 md:px-4">
        {/* Top Control Header */}
        <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-2xs mb-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <SearchIcon size={17} />
                </div>
                <h1 className="text-lg md:text-xl font-extrabold text-gray-900 truncate">
                  {searchParams ? `Search: "${searchParams}"` : "All Products"}
                </h1>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Found <span className="font-bold text-gray-800">{totalCount}</span> items matching your search
              </p>
            </div>

            {/* Action Bar: Mobile Filter Button & Sort Dropdown */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-2xs hover:border-blue-400 cursor-pointer"
              >
                <SlidersHorizontal size={14} className="text-blue-600" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <ProductSortDropdown currentSort={sortBy} onSortChange={handleSortChange} />
            </div>
          </div>

          {/* Active Filter Chips */}
          <ActiveFilterChips
            filters={filters}
            onRemoveFilter={handleFilterChange}
            onClearAll={handleResetFilters}
          />
        </div>

        {/* Main Content Layout: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block sticky top-24">
            <ProductFilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              priceBounds={priceBounds}
              showCategories={true}
            />
          </div>

          {/* Mobile Filter Drawer Modal */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="fixed inset-0 bg-black/40 backdrop-blur-xs"
                onClick={() => setMobileFilterOpen(false)}
              />
              <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl p-4 overflow-y-auto z-10 animate-in slide-in-from-right duration-200">
                <ProductFilterSidebar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onResetFilters={handleResetFilters}
                  priceBounds={priceBounds}
                  showCategories={true}
                  onCloseMobile={() => setMobileFilterOpen(false)}
                />
              </div>
            </div>
          )}

          {/* Product Results */}
          <div className="space-y-4">
            <InfinteScroll
              dataLength={searchedData.length}
              hasMore={page < totalPages}
              next={handleFetchMoreData}
              loader={
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 py-4">
                  {loadingCardArray.slice(0, 4).map((_, index) => (
                    <ProductSkeletonCardLoading key={`scroll-loading-${index}`} />
                  ))}
                </div>
              }
            >
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {searchedData.length > 0 &&
                  searchedData.map((product, index) => (
                    <ProductDisplayCard
                      key={product._id + "searchProduct" + index}
                      productData={product}
                      className="w-full"
                    />
                  ))}
              </div>
            </InfinteScroll>

            {/* Empty State */}
            {!loading && searchedData.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-10 flex flex-col items-center justify-center text-center max-w-md mx-auto">
                <img
                  src={NoDataImage}
                  alt="no data"
                  className="w-40 h-40 object-contain mb-3 opacity-90"
                />
                <h3 className="font-bold text-gray-900 text-base">No Products Found</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-xs">
                  We couldn&apos;t find any products matching your selected search or filter criteria.
                </p>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}

            {/* Initial Loading Skeletons */}
            {loading && searchedData.length === 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {loadingCardArray.map((_, index) => (
                  <ProductSkeletonCardLoading key={`initial-load-${index}`} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchPage;