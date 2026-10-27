import { useState } from "react";
import PropTypes from "prop-types";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxioxToastError";
import toast from "react-hot-toast";
import StarRating from "./StarRating";
import uploadImage from "../utils/UploadImage";
import { X, Image as ImageIcon, Trash2, RefreshCw, Star, ShieldCheck } from "lucide-react";

const RATING_LABELS = {
  1: "Terrible - Not recommended",
  2: "Poor - Below expectations",
  3: "Average - Acceptable quality",
  4: "Good - Very satisfied",
  5: "Excellent! - Outstanding product",
};

const ReviewModal = ({
  isOpen,
  onClose,
  product,
  existingReview = null,
  onSuccess = () => {},
}) => {
  const [rating, setRating] = useState(existingReview?.rating || 5);
  const [title, setTitle] = useState(existingReview?.title || "");
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [images, setImages] = useState(existingReview?.images || []);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (images.length >= 3) {
      toast.error("You can upload a maximum of 3 review photos.");
      return;
    }

    try {
      setUploadingImage(true);
      const uploadResult = await uploadImage(file);
      if (uploadResult?.data?.url) {
        setImages((prev) => [...prev, uploadResult.data.url]);
        toast.success("Photo uploaded successfully!");
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || rating < 1) {
      toast.error("Please select a star rating.");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please share your review comments.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await Axios({
        ...SummaryApi.createOrUpdateReview,
        data: {
          productId: product?._id,
          rating,
          title: title.trim(),
          comment: comment.trim(),
          images,
        },
      });

      if (response.data.success) {
        toast.success(response.data.message || "Review submitted successfully!");
        onSuccess(response.data.data, response.data.productStats);
        onClose();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setSubmitting(false);
    }
  };

  const productImage = Array.isArray(product?.image) ? product?.image[0] : product?.image;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-gray-100 space-y-5 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-extrabold text-gray-900">
              {existingReview ? "Edit Your Review" : "Write a Product Review"}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Help other shoppers make smart choices
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Product Preview Card */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/80 border border-gray-100">
          <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
            {productImage ? (
              <img
                src={productImage}
                alt={product?.name || "Product"}
                className="w-full h-full object-cover"
              />
            ) : (
              <Star size={18} className="text-gray-300" />
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-gray-900 truncate">
              {product?.name || "Product Name"}
            </h4>
            <span className="text-[11px] text-gray-500">
              {product?.unit ? `Unit: ${product.unit}` : "PiMart Verified Catalog"}
            </span>
          </div>
        </div>

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Star Rating Picker */}
          <div className="space-y-1.5 p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 text-center">
            <label className="block text-xs font-bold text-gray-800">
              Overall Rating
            </label>
            <div className="flex justify-center py-1">
              <StarRating
                rating={rating}
                interactive={true}
                size={28}
                onRatingChange={(r) => setRating(r)}
              />
            </div>
            <p className="text-xs font-bold text-amber-800">
              {RATING_LABELS[rating] || "Select your rating"}
            </p>
          </div>

          {/* Headline / Title */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Headline (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Best quality, fast delivery!"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Written Review */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Your Review <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike about this product? How was the freshness and packaging?"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all leading-relaxed"
            />
          </div>

          {/* Photos Upload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-gray-700">
                Attach Photos (Optional, max 3)
              </label>
              <span className="text-[11px] text-gray-400">{images.length}/3</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative w-16 h-16 rounded-xl border border-gray-200 overflow-hidden group shadow-2xs"
                >
                  <img
                    src={imgUrl}
                    alt={`Review photo ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              {images.length < 3 && (
                <label className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 bg-gray-50 hover:bg-blue-50 flex flex-col items-center justify-center text-gray-400 hover:text-blue-600 transition-all cursor-pointer">
                  {uploadingImage ? (
                    <RefreshCw size={16} className="animate-spin text-blue-600" />
                  ) : (
                    <>
                      <ImageIcon size={18} />
                      <span className="text-[10px] font-bold mt-1">Add</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingImage}
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Verified purchase notice */}
          <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-2 text-[11px] text-emerald-800">
            <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
            <span>
              If you have purchased this item, your review will receive a <strong>Verified Buyer</strong> badge.
            </span>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-200 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <RefreshCw size={13} className="animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>{existingReview ? "Update Review" : "Submit Review"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ReviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.object,
  existingReview: PropTypes.object,
  onSuccess: PropTypes.func,
};

export default ReviewModal;
