import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { 
  FiLayers, 
  FiPlus, 
  FiSearch, 
  FiEdit3, 
  FiTrash2, 
  FiX, 
  FiImage,
  FiRefreshCw
} from "react-icons/fi";
import UploadCategoryModel from "../components/ViewPageComponent/UploadCategoryModel";
import EditCategoryComponent from "../components/ViewPageComponent/EditCategoryComponent";
import ConfirmationPermissionBox from "../components/Mini/ConfirmationPermissionBox";
import Loading from "../components/Mini/Loading";
import NoData from "../components/Mini/NoData";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxioxToastError";
import toast from "react-hot-toast";
import { setAllCategory } from "../store/productSlice";

const CategoryPage = () => {
  const dispatch = useDispatch();

  const [openUploadCategoryModel, setOpenUploadCategoryModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [openEditComponent, setOpenEditComponent] = useState(false);
  const [editCategoryData, setEditCategoryData] = useState({
    name: "",
    image: "",
  });

  const [openConfirmationBox, setOpenConfirmationBox] = useState(false);
  const [deleteCategoryById, setDeleteCategoryById] = useState({
    _id: "",
    name: "",
  });

  // Fetch all categories from server
  const fetchAllCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getAllCategories,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        const sorted = (responseData.data || []).sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setCategoryData(sorted);
        dispatch(setAllCategory(sorted));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  // Handle delete category
  const handleDeleteCategory = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.deleteCategory,
        data: { _id: deleteCategoryById._id },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message || "Category deleted successfully");
        setOpenConfirmationBox(false);
        fetchAllCategories();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  // Filter categories by search term
  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return categoryData;
    return categoryData.filter((cat) =>
      cat?.name?.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  }, [categoryData, searchTerm]);

  return (
    <section className="space-y-6 p-1">
      {/* 1. Page Header Banner */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-white border border-blue-100/90 shadow-xs rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Title & Info */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-200 shrink-0">
            <FiLayers size={24} className="sm:text-[26px]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                Categories
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                {categoryData.length} Total
              </span>
            </div>
            <p className="text-sm sm:text-base text-gray-500 mt-1 font-normal">
              Manage and organize your store&apos;s product categories
            </p>
          </div>
        </div>

        {/* Right: Actions (Search + Add) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Bar */}
          <div className="relative min-w-[220px] sm:w-64">
            <FiSearch
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-2xs"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <FiX size={16} />
              </button>
            )}
          </div>

          {/* Add Category Button */}
          <button
            type="button"
            onClick={() => setOpenUploadCategoryModel(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm hover:shadow-md shadow-blue-200 transition-all cursor-pointer shrink-0"
          >
            <FiPlus size={18} />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* 2. Loading State */}
      {loading && !categoryData.length && (
        <div className="py-20 flex justify-center items-center">
          <Loading />
        </div>
      )}

      {/* 3. Empty State (No Categories) */}
      {!loading && categoryData.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center shadow-xs">
          <NoData />
          <p className="text-gray-500 mt-4 text-sm sm:text-base">
            No categories found. Click &quot;Add Category&quot; above to create your first one.
          </p>
          <button
            type="button"
            onClick={() => setOpenUploadCategoryModel(true)}
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm cursor-pointer"
          >
            <FiPlus size={18} />
            <span>Create Category</span>
          </button>
        </div>
      )}

      {/* 4. Search Filter Empty State */}
      {!loading && categoryData.length > 0 && filteredCategories.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center shadow-xs space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
            <FiSearch size={22} />
          </div>
          <h3 className="text-lg font-bold text-gray-800">No categories found</h3>
          <p className="text-sm text-gray-500">
            No categories match your search &quot;{searchTerm}&quot;
          </p>
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors cursor-pointer"
          >
            <FiRefreshCw size={15} />
            <span>Clear Search</span>
          </button>
        </div>
      )}

      {/* 5. Categories Grid */}
      {filteredCategories.length > 0 && (
        <div>
          {searchTerm && (
            <p className="text-xs sm:text-sm text-gray-500 mb-3 px-1 font-medium">
              Showing {filteredCategories.length} of {categoryData.length} categories
            </p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-5">
            {filteredCategories.map((category) => (
              <div
                key={category._id}
                className="bg-white rounded-2xl border border-gray-200/80 hover:border-blue-300 hover:shadow-lg transition-all duration-300 p-3 sm:p-4 flex flex-col justify-between group overflow-hidden"
              >
                {/* Image Showcase Frame */}
                <div className="relative w-full h-36 sm:h-40 bg-gradient-to-b from-gray-50 to-blue-50/30 rounded-xl p-3 flex items-center justify-center overflow-hidden mb-3 border border-gray-100/90 group-hover:scale-[1.02] transition-transform duration-300">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      loading="lazy"
                      className="w-full h-full object-contain drop-shadow-2xs group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <FiImage size={32} />
                      <span className="text-xs mt-1">No Image</span>
                    </div>
                  )}
                </div>

                {/* Category Name */}
                <div className="text-center mb-3.5 px-1">
                  <h3
                    title={category.name}
                    className="font-bold text-sm sm:text-base text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors"
                  >
                    {category.name}
                  </h3>
                </div>

                {/* Tactile Action Buttons */}
                <div className="flex items-center gap-2 pt-2.5 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setEditCategoryData(category);
                      setOpenEditComponent(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs sm:text-sm font-semibold transition-all border border-blue-200/60 cursor-pointer shadow-2xs active:scale-95"
                  >
                    <FiEdit3 size={15} />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDeleteCategoryById(category);
                      setOpenConfirmationBox(true);
                    }}
                    title="Delete Category"
                    className="flex items-center justify-center p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs sm:text-sm font-semibold transition-all border border-red-200/60 cursor-pointer shadow-2xs active:scale-95"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Upload Category Modal */}
      {openUploadCategoryModel && (
        <UploadCategoryModel
          fetchAllCategory={fetchAllCategories}
          close={() => setOpenUploadCategoryModel(false)}
        />
      )}

      {/* 7. Edit Category Modal */}
      {openEditComponent && (
        <EditCategoryComponent
          data={editCategoryData}
          fetchAllCategory={fetchAllCategories}
          close={() => setOpenEditComponent(false)}
        />
      )}

      {/* 8. Delete Confirmation Modal */}
      {openConfirmationBox && (
        <ConfirmationPermissionBox
          title="Delete Category"
          message={`Are you sure you want to delete "${deleteCategoryById?.name || "this category"}"? Products under this category might be affected.`}
          confirm={handleDeleteCategory}
          cancel={() => setOpenConfirmationBox(false)}
        />
      )}
    </section>
  );
};

export default CategoryPage;