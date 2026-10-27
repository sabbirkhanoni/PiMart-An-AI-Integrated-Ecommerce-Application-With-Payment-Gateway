import { useState } from 'react';
import { useSelector } from 'react-redux';
import { MdOutlineCloudUpload } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import {
  FiUploadCloud,
  FiTrash2,
  FiEye,
  FiPlus,
  FiRotateCcw,
  FiCheck,
  FiFileText,
  FiDollarSign,
  FiImage,
  FiLayers,
  FiSliders,
} from 'react-icons/fi';
import UploadImage from '../utils/UploadImage';
import MiniLoading from '../components/Mini/MiniLoading.jsx';
import ImageZoom from '../components/Mini/ImageZoom';
import AddNewFeildsComponent from '../components/Mini/AddNewFeildsComponent';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxioxToastError';
import SuccessNotification from '../utils/SuccessNotification';
import { DisplayPriceInBDT } from '../utils/DisplayPriceInBDT';
import { calculatePriceWithDiscount } from '../utils/calculatePriceWithDiscount';

const UploadProductPage = () => {
  const initialFormState = {
    name: '',
    image: [],
    category: [],
    subCategory: [],
    unit: '',
    stock: '',
    price: '',
    costPrice: '',
    discount: '',
    description: '',
    more_details: {},
  };

  const [addProductData, setAddProductData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [forImageLoading, setForImageLoading] = useState(false);
  const [imageZoom, setImageZoom] = useState('');
  const [selectMultipleCategory, setSelectMultipleCategory] = useState('');
  const [selectMultipleSubCategory, setSelectMultipleSubCategory] = useState('');
  const [openAddMoreFeilds, setOpenAddMoreFeilds] = useState(false);
  const [commingAddFeildsName, setCommingAddFeildsName] = useState('');

  // Fetching categories and subcategories from Redux store
  const fetchAllCategories = useSelector((state) => state.product.allCategory) || [];
  const fetchAllSubCategories = useSelector((state) => state.product.allSubCategory) || [];

  const handleChangeOfFormData = (e) => {
    const { name, value } = e.target;
    setAddProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadProductImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setForImageLoading(true);
      const response = await UploadImage(file);
      const imageUrlData = response?.data?.url;

      if (imageUrlData) {
        setAddProductData((prev) => ({
          ...prev,
          image: [...prev.image, imageUrlData],
        }));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setForImageLoading(false);
    }
  };

  const handleDeleteImageFromFormData = (index) => {
    setAddProductData((prev) => {
      const updatedImages = [...prev.image];
      updatedImages.splice(index, 1);
      return {
        ...prev,
        image: updatedImages,
      };
    });
  };

  const handleSelectMultipleCategory = (e) => {
    const selectedCategoryValue = e.target.value;
    if (!selectedCategoryValue) return;

    const selectedCategory = fetchAllCategories.find(
      (cat) => cat._id === selectedCategoryValue
    );

    if (
      selectedCategory &&
      !addProductData.category.some((c) => c?._id === selectedCategory._id)
    ) {
      setAddProductData((prev) => ({
        ...prev,
        category: [...prev.category, selectedCategory],
      }));
    }

    setSelectMultipleCategory('');
  };

  const handleDeleteCategoryFromFormData = (index) => {
    setAddProductData((prev) => {
      const updatedCategories = [...prev.category];
      updatedCategories.splice(index, 1);
      return {
        ...prev,
        category: updatedCategories,
      };
    });
  };

  const handleSelectMultipleSubCategory = (e) => {
    const selectedSubCategoryValue = e.target.value;
    if (!selectedSubCategoryValue) return;

    const selectedSubCategory = fetchAllSubCategories.find(
      (cat) => cat._id === selectedSubCategoryValue
    );

    if (
      selectedSubCategory &&
      !addProductData.subCategory.some((c) => c?._id === selectedSubCategory._id)
    ) {
      setAddProductData((prev) => ({
        ...prev,
        subCategory: [...prev.subCategory, selectedSubCategory],
      }));
    }

    setSelectMultipleSubCategory('');
  };

  const handleDeleteSubCategoryFromFormData = (index) => {
    setAddProductData((prev) => {
      const updatedSubCategories = [...prev.subCategory];
      updatedSubCategories.splice(index, 1);
      return {
        ...prev,
        subCategory: updatedSubCategories,
      };
    });
  };

  const handleAddFeildsSubmit = () => {
    if (!commingAddFeildsName.trim()) return;

    setAddProductData((prev) => ({
      ...prev,
      more_details: {
        ...prev.more_details,
        [commingAddFeildsName.trim()]: '',
      },
    }));
    setOpenAddMoreFeilds(false);
    setCommingAddFeildsName('');
  };

  const handleOnChangeForAddNewFeildsDetails = (e, key) => {
    const value = e.target.value;
    setAddProductData((prev) => ({
      ...prev,
      more_details: {
        ...prev.more_details,
        [key]: value,
      },
    }));
  };

  const handleDeleteMoreDetailsField = (keyToDelete) => {
    setAddProductData((prev) => {
      const updatedMoreDetails = { ...prev.more_details };
      delete updatedMoreDetails[keyToDelete];
      return {
        ...prev,
        more_details: updatedMoreDetails,
      };
    });
  };

  const handleResetForm = () => {
    if (window.confirm('Are you sure you want to reset all form fields?')) {
      setAddProductData(initialFormState);
    }
  };

  const handleFormSubmitForPublishProduct = async (e) => {
    e.preventDefault();

    if (addProductData.image.length === 0) {
      alert('Please upload at least one product image in the purple Media card.');
      return;
    }

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.addProduct,
        data: addProductData,
      });

      const { data: responseData } = response;
      if (responseData.success) {
        SuccessNotification('Product Added Successfully', responseData.message, 'success');
        setAddProductData(initialFormState);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const numPrice = Number(addProductData.price) || 0;
  const numCost = Number(addProductData.costPrice) || 0;
  const numDiscount = Number(addProductData.discount) || 0;
  const discountedPrice = numDiscount > 0
    ? calculatePriceWithDiscount(numPrice, numDiscount)
    : numPrice;
  const profitPerUnit = numCost > 0 ? discountedPrice - numCost : 0;
  const profitMarginPerUnit = discountedPrice > 0 && numCost > 0
    ? Number(((profitPerUnit / discountedPrice) * 100).toFixed(1))
    : 0;

  return (
    <section className="space-y-6 p-1">
      {/* 1. Page Header Card */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-white border border-blue-100/90 shadow-xs rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-200 shrink-0">
            <FiUploadCloud size={26} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                Upload New Product
              </h1>
              <span className="hidden sm:inline-block px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                Catalog Entry
              </span>
            </div>
            <p className="text-sm sm:text-base text-gray-500 mt-1 font-normal">
              Fill in the colored sections below to publish a new product to your store
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleResetForm}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors cursor-pointer shadow-2xs"
          >
            <FiRotateCcw size={16} />
            <span>Reset</span>
          </button>

          <button
            type="submit"
            form="upload-product-form"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <FiCheck size={18} />
                <span>Publish Product</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Main Form Content (Balanced Typography 2-Column Grid) */}
      <form
        id="upload-product-form"
        onSubmit={handleFormSubmitForPublishProduct}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
      >
        {/* === LEFT COLUMN (7 COLS): Basic Info & Pricing & Specs === */}
        <div className="lg:col-span-7 space-y-6">
          {/* SECTION 1: General Details Card (BLUE THEME) */}
          <div className="bg-white border-2 border-blue-100/90 rounded-2xl p-6 shadow-xs relative overflow-hidden transition-all hover:border-blue-200">
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-blue-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  <FiFileText size={17} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-blue-950">
                    1. Basic Product Information
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 font-normal">Name and detailed description</p>
                </div>
              </div>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                Primary Details
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="text-sm sm:text-base font-semibold text-gray-800 block mb-1.5">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="e.g. Fresh Organic Bananas"
                  value={addProductData.name}
                  onChange={handleChangeOfFormData}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-base text-gray-800 font-normal transition-all shadow-2xs placeholder:text-gray-400 placeholder:text-sm"
                />
              </div>

              <div>
                <label htmlFor="description" className="text-sm sm:text-base font-semibold text-gray-800 block mb-1.5">
                  Product Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Provide a detailed, attractive description of this product..."
                  value={addProductData.description}
                  onChange={handleChangeOfFormData}
                  required
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-base text-gray-800 font-normal transition-all shadow-2xs resize-none placeholder:text-gray-400 placeholder:text-sm"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Pricing & Inventory Card (EMERALD / GREEN THEME) */}
          <div className="bg-white border-2 border-emerald-100/90 rounded-2xl p-6 shadow-xs relative overflow-hidden transition-all hover:border-emerald-200">
            <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-emerald-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <FiDollarSign size={17} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-emerald-950">
                    2. Pricing & Stock
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 font-normal">Unit, inventory & pricing economics</p>
                </div>
              </div>

              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Financials & Stock
              </span>
            </div>

            <div className="space-y-4">
              {/* Row 1: Measurement & Stock Quantity (2 Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="unit" className="text-sm font-semibold text-gray-800 block mb-1.5">
                    Unit / Measurement <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="unit"
                    type="text"
                    name="unit"
                    placeholder="e.g. 1 kg / 500 ml / 1 pc"
                    value={addProductData.unit}
                    onChange={handleChangeOfFormData}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm text-gray-800 font-normal transition-all shadow-2xs placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label htmlFor="stock" className="text-sm font-semibold text-gray-800 block mb-1.5">
                    Stock Quantity <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="stock"
                    type="number"
                    name="stock"
                    placeholder="0"
                    value={addProductData.stock}
                    onChange={handleChangeOfFormData}
                    required
                    min={0}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm text-gray-800 font-normal transition-all shadow-2xs placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Row 2: Cost Price, Selling Price & Discount (3 Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="costPrice" className="text-sm font-semibold text-gray-800 block mb-1.5">
                    Cost / Buying (৳)
                  </label>
                  <input
                    id="costPrice"
                    type="number"
                    name="costPrice"
                    placeholder="0"
                    value={addProductData.costPrice}
                    onChange={handleChangeOfFormData}
                    min={0}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50/20 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm text-gray-800 font-normal transition-all shadow-2xs placeholder:text-gray-400"
                    title="Wholesale buying cost from supplier (used to calculate Profit & Loss)"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">Wholesale / Supplier rate</p>
                </div>

                <div>
                  <label htmlFor="price" className="text-sm font-semibold text-gray-800 block mb-1.5">
                    Selling Price (৳) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="price"
                    type="number"
                    name="price"
                    placeholder="0"
                    value={addProductData.price}
                    onChange={handleChangeOfFormData}
                    required
                    min={0}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm text-gray-800 font-normal transition-all shadow-2xs placeholder:text-gray-400"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">Regular MRP price</p>
                </div>

                <div>
                  <label htmlFor="discount" className="text-sm font-semibold text-gray-800 block mb-1.5">
                    Discount (%)
                  </label>
                  <input
                    id="discount"
                    type="number"
                    name="discount"
                    placeholder="0"
                    value={addProductData.discount}
                    onChange={handleChangeOfFormData}
                    min={0}
                    max={100}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm text-gray-800 font-normal transition-all shadow-2xs placeholder:text-gray-400"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">Optional markdown</p>
                </div>
              </div>

              {/* Financial Live Insight Bar */}
              {(numPrice > 0 || numCost > 0) && (
                <div className="pt-3 border-t border-emerald-50 flex items-center justify-between flex-wrap gap-2.5 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 flex-wrap">
                    {numDiscount > 0 ? (
                      <span className="font-bold text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg">
                        Customer Pays: <span className="underline">{DisplayPriceInBDT(discountedPrice)}</span>
                        <span className="text-blue-600 font-normal ml-1">(-{numDiscount}%)</span>
                      </span>
                    ) : (
                      <span className="font-bold text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">
                        Customer Pays: {DisplayPriceInBDT(numPrice)}
                      </span>
                    )}

                    {numCost > 0 && discountedPrice > 0 && (
                      <span
                        className={`font-bold px-3 py-1 rounded-lg border ${
                          profitPerUnit >= 0
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : "bg-rose-50 text-rose-800 border-rose-300"
                        }`}
                      >
                        {profitPerUnit >= 0 ? "Est. Profit / Unit" : "Est. Loss / Unit"}:{" "}
                        {DisplayPriceInBDT(profitPerUnit)} ({profitMarginPerUnit}%)
                      </span>
                    )}
                  </div>

                  {Number(addProductData.stock) > 0 && numPrice > 0 && (
                    <span className="text-xs font-semibold text-gray-500">
                      Stock Valuation:{" "}
                      <span className="font-bold text-gray-800">
                        {DisplayPriceInBDT(discountedPrice * Number(addProductData.stock))}
                      </span>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* SECTION 3: Custom Specifications Card (AMBER / ORANGE THEME) */}
          <div className="bg-white border-2 border-amber-100/90 rounded-2xl p-6 shadow-xs relative overflow-hidden transition-all hover:border-amber-200">
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-amber-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <FiSliders size={17} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-amber-950">
                    3. Custom Specifications
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 font-normal">Brand, warranty, color, etc. (Optional)</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpenAddMoreFeilds(true)}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
              >
                <FiPlus size={15} />
                <span>Add Custom Field</span>
              </button>
            </div>

            {Object.keys(addProductData?.more_details || {}).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {Object.keys(addProductData.more_details).map((key, index) => (
                  <div key={key + index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label htmlFor={key} className="text-sm font-medium text-gray-700 capitalize">
                        {key}
                      </label>
                      <button
                        type="button"
                        onClick={() => handleDeleteMoreDetailsField(key)}
                        className="text-gray-400 hover:text-rose-600 transition-colors cursor-pointer p-1"
                        title={`Remove ${key}`}
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                    <input
                      id={key}
                      type="text"
                      placeholder={`Enter ${key}`}
                      value={addProductData.more_details[key]}
                      onChange={(e) => handleOnChangeForAddNewFeildsDetails(e, key)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white focus:border-amber-500 outline-none text-sm text-gray-800 font-normal shadow-2xs"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic py-1 font-normal">
                No custom specifications added. Click &quot;Add Custom Field&quot; if you want to specify Brand, Warranty, Weight, etc.
              </p>
            )}
          </div>
        </div>

        {/* === RIGHT COLUMN (5 COLS): Images & Categories === */}
        <div className="lg:col-span-5 space-y-6">
          {/* SECTION 4: Product Images Card (PURPLE / VIOLET THEME) */}
          <div className="bg-white border-2 border-purple-100/90 rounded-2xl p-6 shadow-xs relative overflow-hidden transition-all hover:border-purple-200">
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-purple-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <FiImage size={17} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-purple-950">
                    Product Photos
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 font-normal">Upload clear product images</p>
                </div>
              </div>

              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                {addProductData.image.length} uploaded
              </span>
            </div>

            {/* Upload Dropzone */}
            <label className="border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/30 hover:bg-purple-50/70 rounded-2xl py-6 px-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group">
              <input
                type="file"
                name="productImage"
                id="productImage"
                accept="image/*"
                className="hidden"
                onChange={handleUploadProductImage}
              />
              {forImageLoading ? (
                <div className="flex flex-col items-center gap-2 py-2">
                  <MiniLoading />
                  <span className="text-sm text-purple-700 font-medium">Uploading to cloud...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform shadow-2xs">
                    <MdOutlineCloudUpload size={28} />
                  </div>
                  <span className="text-base font-bold text-gray-800">
                    Click to upload product photo
                  </span>
                  <span className="text-xs text-purple-600/80 mt-0.5 font-normal">
                    Supports PNG, JPG, JPEG, WEBP
                  </span>
                </div>
              )}
            </label>

            {/* Thumbnails Grid */}
            {addProductData.image.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-3">
                {addProductData.image.map((img, index) => (
                  <div
                    key={img + index}
                    className="relative h-22 rounded-xl overflow-hidden border border-purple-100 bg-white p-1.5 shadow-2xs group flex items-center justify-center"
                  >
                    <img
                      src={img}
                      alt={`Product image ${index + 1}`}
                      className="max-w-full max-h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setImageZoom(img)}
                        className="p-1.5 rounded-lg bg-white text-gray-700 hover:text-purple-600 transition-colors cursor-pointer shadow-xs"
                        title="Zoom Image"
                      >
                        <FiEye size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteImageFromFormData(index)}
                        className="p-1.5 rounded-lg bg-white text-gray-700 hover:text-rose-600 transition-colors cursor-pointer shadow-xs"
                        title="Delete Image"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 5: Category & Classification Card (INDIGO THEME) */}
          <div className="bg-white border-2 border-indigo-100/90 rounded-2xl p-6 shadow-xs relative overflow-hidden transition-all hover:border-indigo-200">
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-indigo-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <FiLayers size={17} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-indigo-950">
                    Category & Placement
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 font-normal">Organize in store categories</p>
                </div>
              </div>

              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Organization
              </span>
            </div>

            {/* Category Dropdown */}
            <div className="space-y-4">
              <div>
                <label htmlFor="category-select" className="text-sm sm:text-base font-semibold text-gray-800 block mb-1.5">
                  Primary Category <span className="text-rose-500">*</span>
                </label>
                <select
                  id="category-select"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-indigo-500 outline-none text-base text-gray-800 font-normal shadow-2xs cursor-pointer"
                  value={selectMultipleCategory}
                  onChange={handleSelectMultipleCategory}
                >
                  <option value="">Choose a category...</option>
                  {fetchAllCategories.map((cat, index) => (
                    <option key={cat?._id + index + 'category'} value={cat?._id}>
                      {cat?.name}
                    </option>
                  ))}
                </select>

                <div className="flex flex-wrap gap-1.5 mt-2 min-h-[30px]">
                  {addProductData.category.map((cat, index) => (
                    <span
                      key={cat?._id + index + 'productcategorydata'}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs sm:text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs"
                    >
                      {cat?.name}
                      <button
                        type="button"
                        onClick={() => handleDeleteCategoryFromFormData(index)}
                        className="text-blue-500 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <IoClose size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Sub-Category Dropdown */}
              <div>
                <label htmlFor="subcategory-select" className="text-sm sm:text-base font-semibold text-gray-800 block mb-1.5">
                  Sub-Category
                </label>
                <select
                  id="subcategory-select"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-indigo-500 outline-none text-base text-gray-800 font-normal shadow-2xs cursor-pointer"
                  value={selectMultipleSubCategory}
                  onChange={handleSelectMultipleSubCategory}
                >
                  <option value="">Choose a sub-category...</option>
                  {fetchAllSubCategories.map((cat, index) => (
                    <option key={cat?._id + index + 'subCategory'} value={cat?._id}>
                      {cat?.name}
                    </option>
                  ))}
                </select>

                <div className="flex flex-wrap gap-1.5 mt-2 min-h-[30px]">
                  {addProductData.subCategory.map((cat, index) => (
                    <span
                      key={cat?._id + index + 'productsubcategorydata'}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs sm:text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs"
                    >
                      {cat?.name}
                      <button
                        type="button"
                        onClick={() => handleDeleteSubCategoryFromFormData(index)}
                        className="text-indigo-500 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <IoClose size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Card */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 border border-blue-100 rounded-2xl p-5 flex items-center justify-between gap-3 shadow-xs">
            <button
              type="button"
              onClick={handleResetForm}
              className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-semibold text-sm transition-colors cursor-pointer text-center shadow-2xs"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer disabled:opacity-50 text-center"
            >
              {loading ? 'Publishing...' : 'Publish Product'}
            </button>
          </div>
        </div>
      </form>

      {/* Image Zoom Lightbox */}
      {imageZoom && <ImageZoom url={imageZoom} close={() => setImageZoom('')} />}

      {/* Add Custom Fields Modal */}
      {openAddMoreFeilds && (
        <AddNewFeildsComponent
          close={() => setOpenAddMoreFeilds(false)}
          value={commingAddFeildsName}
          onChange={(e) => setCommingAddFeildsName(e.target.value)}
          submit={handleAddFeildsSubmit}
        />
      )}
    </section>
  );
};

export default UploadProductPage;