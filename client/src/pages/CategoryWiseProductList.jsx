import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxioxToastError";
import Loading from "../components/Mini/Loading";
import ProductDisplayCard from "../components/DesignModel/ProductDisplayCard";
import { useSelector } from "react-redux";
import { URLvalidation } from "../utils/URLValidation";
import NoData from "../components/Mini/NoData";
import { ChevronRight, PackageCheck } from "lucide-react";
import ProductSortDropdown from "../components/ProductSortDropdown";

const CategoryWiseProductList = () => {
  const [productListData, setProductListData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [, setTotalPages] = useState(1);
  const [displaySubCategoryList, setDisplaySubCategoryList] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [inStockOnly, setInStockOnly] = useState(false);

  const allCategory = useSelector((state) => state.product.allCategory || []);
  const allSubCategory = useSelector((state) => state.product.allSubCategory || []);

  const params = useParams();

  const categoryId = params?.category?.split("-").slice(-1)[0];
  const subCategoryId = params?.subCategory?.split("-").slice(-1)[0];

  const currentCategory = allCategory.find((c) => c._id === categoryId);
  const currentSubCategory = allSubCategory.find((s) => s._id === subCategoryId);

  const subCategoryName =
    currentSubCategory?.name ||
    params?.subCategory?.split("-").slice(0, -1).join(" ") ||
    "Products";

  const fetchProductByCategoryAndSubCategoryData = async () => {
    if (!categoryId || !subCategoryId) return;
    try {
      setLoading(true);

      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategoryParams,
        data: {
          categoryId: [categoryId],
          subCategoryId: [subCategoryId],
          page: page || 1,
          limit: 20,
          sortBy,
          inStock: inStockOnly,
        },
      });
      const { data: responseData } = response;

      if (responseData.success) {
        if (page === 1) {
          setProductListData(responseData.data || []);
        } else {
          setProductListData((prevData) => [...prevData, ...(responseData.data || [])]);
        }
        setTotalPages(responseData.totalCount || 0);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setPage(1);
    fetchProductByCategoryAndSubCategoryData();
  }, [categoryId, subCategoryId, sortBy, inStockOnly]);

  useEffect(() => {
    if (allSubCategory && allSubCategory.length > 0 && categoryId) {
      const subCategory = allSubCategory.filter((subCat) => {
        return subCat?.category?.some((cat) => (cat?._id || cat) == categoryId);
      });
      setDisplaySubCategoryList(subCategory);
    }
  }, [categoryId, allSubCategory]);

  return (
    <section className="min-h-screen bg-gray-50/50 py-3 md:py-4">
      <div className="container mx-auto px-2 md:px-4">
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3 px-1 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <ChevronRight size={13} className="text-gray-400 shrink-0" />
          <span className="text-gray-700 font-medium truncate max-w-[150px]">
            {currentCategory?.name || "Category"}
          </span>
          <ChevronRight size={13} className="text-gray-400 shrink-0" />
          <span className="text-blue-600 font-semibold truncate max-w-[150px]">
            {subCategoryName}
          </span>
        </div>

        {/* Main Grid: Subcategory Navigation Sidebar + Product Grid */}
        <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr] md:grid-cols-[160px_1fr] lg:grid-cols-[200px_1fr] gap-2.5 sm:gap-4 items-start">
          {/* SubCategory List (Left Sidebar) */}
          <div className="sticky top-20 bg-white rounded-2xl border border-gray-200/80 p-2 shadow-xs max-h-[calc(100vh-96px)] overflow-y-auto space-y-2">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-1 hidden md:block">
              Subcategories
            </p>

            {displaySubCategoryList.length > 0 ? (
              displaySubCategoryList.map((subCatItem, index) => {
                const isActive = subCatItem._id === subCategoryId;
                const url = `/${params.category}/${URLvalidation(subCatItem.name)}-${
                  subCatItem._id
                }`;

                return (
                  <Link
                    to={url}
                    key={subCatItem._id || index}
                    className={`group flex flex-col items-center justify-center p-2 rounded-xl border transition-all text-center cursor-pointer ${
                      isActive
                        ? "bg-blue-50/90 border-blue-500 text-blue-700 shadow-xs font-semibold"
                        : "bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center p-1 rounded-lg bg-gray-50/70 mb-1 group-hover:scale-105 transition-transform overflow-hidden">
                      <img
                        src={subCatItem.image}
                        alt={subCatItem.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <p className="text-[11px] sm:text-xs line-clamp-2 leading-tight">
                      {subCatItem.name}
                    </p>
                  </Link>
                );
              })
            ) : (
              <div className="text-center py-6 text-gray-400 text-xs">
                No subcategories
              </div>
            )}
          </div>

          {/* Product List (Right Column) */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-3 md:p-5 shadow-xs min-h-[75vh] flex flex-col">
            {/* Header info & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 capitalize">
                  {subCategoryName}
                </h1>
                {productListData.length > 0 && (
                  <span className="text-xs text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
                    {productListData.length} {productListData.length === 1 ? "Product" : "Products"}
                  </span>
                )}
              </div>

              {/* Toolbar: In-Stock Toggle & Sort Dropdown */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setInStockOnly((prev) => !prev)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    inStockOnly
                      ? "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <PackageCheck size={14} className={inStockOnly ? "text-emerald-600" : "text-gray-400"} />
                  <span>In Stock</span>
                </button>

                <ProductSortDropdown currentSort={sortBy} onSortChange={setSortBy} />
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {productListData.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 place-items-center">
                  {productListData.map((product, index) => (
                    <ProductDisplayCard
                      productData={product}
                      key={product._id || index}
                    />
                  ))}
                </div>
              ) : (
                !loading && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <NoData />
                    <p className="text-sm text-gray-400 mt-2">
                      No products available in this subcategory yet.
                    </p>
                  </div>
                )
              )}
            </div>

            {loading && (
              <div className="py-6 flex justify-center">
                <Loading />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryWiseProductList;
