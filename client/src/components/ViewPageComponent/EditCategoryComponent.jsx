import { useState } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { 
  FiEdit3, 
  FiUploadCloud, 
  FiX, 
  FiTrash2, 
  FiRefreshCw, 
  FiCheck 
} from "react-icons/fi";
import UploadImage from "../../utils/UploadImage";
import SummaryApi from "../../common/SummaryApi";
import Axios from "../../utils/Axios";
import toast from "react-hot-toast";
import AxiosToastError from "../../utils/AxioxToastError";

const EditCategoryComponent = ({ data: categoryData, close, fetchAllCategory }) => {
  const [data, setData] = useState({
    _id: categoryData._id,
    name: categoryData.name || "",
    image: categoryData.image || "",
  });

  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setImageUploading(true);
      const response = await UploadImage(file);

      if (response?.data?.url) {
        setData((prev) => ({
          ...prev,
          image: response.data.url,
        }));
        toast.success("Image updated successfully");
      } else {
        toast.error("Failed to upload image. Please try again.");
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setData((prev) => ({
      ...prev,
      image: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    if (!data.image) {
      toast.error("Please provide a category image");
      return;
    }

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.updateCategory,
        data: data,
      });

      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message || "Category updated successfully");
        close();
        fetchAllCategory();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-50/80 to-white border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-200 shrink-0">
              <FiEdit3 size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                Edit Category
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-normal">
                Update category name and display image
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          {/* Category Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="editCategoryName"
              className="block text-sm font-semibold text-gray-700"
            >
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="editCategoryName"
              name="name"
              placeholder="Enter category name..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-gray-800 text-sm transition-all shadow-2xs"
              value={data.name}
              onChange={handleOnChange}
              required
            />
          </div>

          {/* Category Image */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Category Image <span className="text-red-500">*</span>
            </label>

            {data.image ? (
              /* Image Uploaded State */
              <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 bg-blue-50/40 rounded-xl border border-blue-200/60">
                <div className="w-24 h-24 bg-white rounded-xl border border-gray-200 p-2 flex items-center justify-center shrink-0 shadow-2xs">
                  <img
                    alt="Category Preview"
                    src={data.image}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 flex flex-col items-center sm:items-start gap-2">
                  <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                    <FiCheck size={14} /> Current image
                  </span>
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="replaceEditCategoryImage"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold cursor-pointer shadow-2xs transition-colors"
                    >
                      <FiRefreshCw size={13} />
                      <span>Change Image</span>
                      <input
                        onChange={handleUploadCategoryImage}
                        type="file"
                        accept="image/*"
                        id="replaceEditCategoryImage"
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold cursor-pointer transition-colors border border-red-200/60"
                    >
                      <FiTrash2 size={13} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Upload Dropzone State */
              <label
                htmlFor="editCategoryImage"
                className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
                  imageUploading
                    ? "border-blue-400 bg-blue-50/50 pointer-events-none"
                    : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/30 bg-gray-50/50"
                }`}
              >
                <input
                  onChange={handleUploadCategoryImage}
                  type="file"
                  accept="image/*"
                  name="image"
                  id="editCategoryImage"
                  className="hidden"
                  disabled={imageUploading}
                />
                {imageUploading ? (
                  <div className="flex flex-col items-center py-2 space-y-2">
                    <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-semibold text-blue-600">
                      Uploading image...
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                      <FiUploadCloud size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Click to upload new category image
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        PNG, JPG, WEBP recommended (Max 5MB)
                      </p>
                    </div>
                  </div>
                )}
              </label>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={close}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || imageUploading || !data.name.trim() || !data.image}
              className={`px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-sm transition-all cursor-pointer flex items-center gap-2 ${
                data.name.trim() && data.image && !loading && !imageUploading
                  ? "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                  : "bg-gray-400 cursor-not-allowed opacity-75"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <span>Update Category</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

EditCategoryComponent.propTypes = {
  data: PropTypes.object.isRequired,
  close: PropTypes.func.isRequired,
  fetchAllCategory: PropTypes.func.isRequired,
};

export default EditCategoryComponent;