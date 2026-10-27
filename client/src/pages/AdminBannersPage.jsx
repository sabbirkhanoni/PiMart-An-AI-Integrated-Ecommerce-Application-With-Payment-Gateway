import { useState, useEffect } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxioxToastError";
import toast from "react-hot-toast";
import {
  Image as ImageIcon,
  Plus,
  Sliders,
  CheckCircle2,
  XCircle,
  Trash2,
  ExternalLink,
  UploadCloud,
  X,
  Layers,
  Sparkles,
} from "lucide-react";
import Loading from "../components/Mini/Loading";
import UploadImage from "../utils/UploadImage";

const AdminBannersPage = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    desktopImage: "",
    mobileImage: "",
    linkUrl: "/",
    tag: "Exclusive Offer",
    priority: "1",
    isActive: true,
  });

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getAllBannersAdmin,
      });
      if (response.data.success) {
        setBanners(response.data.data || []);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleUploadDesktop = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingDesktop(true);
      const res = await UploadImage(file);
      if (res?.data?.url) {
        setFormData((prev) => ({
          ...prev,
          desktopImage: res.data.url,
          // Auto set mobile if not set
          mobileImage: prev.mobileImage || res.data.url,
        }));
        toast.success("Desktop banner image uploaded successfully!");
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setUploadingDesktop(false);
    }
  };

  const handleUploadMobile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingMobile(true);
      const res = await UploadImage(file);
      if (res?.data?.url) {
        setFormData((prev) => ({ ...prev, mobileImage: res.data.url }));
        toast.success("Mobile banner image uploaded successfully!");
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setUploadingMobile(false);
    }
  };

  const handleToggleActive = async (banner) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateBanner,
        data: {
          _id: banner._id,
          isActive: !banner.isActive,
        },
      });
      if (response.data.success) {
        toast.success(`Banner ${banner.isActive ? "deactivated" : "activated"}`);
        fetchBanners();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleDeleteBanner = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete banner "${title}"?`)) return;
    try {
      const response = await Axios({
        ...SummaryApi.deleteBanner,
        data: { _id: id },
      });
      if (response.data.success) {
        toast.success(`Banner "${title}" deleted.`);
        fetchBanners();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.desktopImage) {
      toast.error("Please provide a title and upload at least a desktop banner image.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await Axios({
        ...SummaryApi.createBanner,
        data: {
          ...formData,
          priority: Number(formData.priority) || 0,
        },
      });

      if (response.data.success) {
        toast.success("Promotional banner published successfully!");
        setIsModalOpen(false);
        setFormData({
          title: "",
          subtitle: "",
          desktopImage: "",
          mobileImage: "",
          linkUrl: "/",
          tag: "Exclusive Offer",
          priority: "1",
          isActive: true,
        });
        fetchBanners();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-3 md:p-6 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
              <ImageIcon size={20} />
            </div>
            <span>Home Banner & Slider Management</span>
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Manage dynamic homepage promotional carousel sliders and featured marketing banners
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs md:text-sm font-bold transition-all shadow-sm shadow-indigo-200 hover:shadow-md cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add New Banner</span>
        </button>
      </div>

      {/* Banners List */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loading />
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 p-12 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-2xs">
            <ImageIcon size={28} />
          </div>
          <h3 className="font-bold text-gray-900 text-base">No Custom Banners Yet</h3>
          <p className="text-xs text-gray-500 mt-1 mb-5">
            The homepage currently displays the default static banner. Add custom promotional banners to create an interactive hero slider!
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            Add First Banner
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {banners.map((banner) => (
            <div
              key={banner._id}
              className={`rounded-2xl border overflow-hidden transition-all flex flex-col justify-between ${
                banner.isActive
                  ? "bg-white border-gray-200 shadow-xs hover:shadow-md"
                  : "bg-gray-50/70 border-gray-200 opacity-70"
              }`}
            >
              {/* Banner Image Preview */}
              <div className="relative aspect-21/9 bg-gray-100 overflow-hidden group">
                <img
                  src={banner.desktopImage}
                  alt={banner.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />

                {/* Priority & Tag Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-black/75 text-white backdrop-blur-xs">
                    Priority #{banner.priority}
                  </span>
                  {banner.tag && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white shadow-xs">
                      {banner.tag}
                    </span>
                  )}
                </div>

                {/* Active Status Badge */}
                <div className="absolute top-2.5 right-2.5">
                  {banner.isActive ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-xs flex items-center gap-1">
                      <CheckCircle2 size={11} /> Live
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-600 text-white shadow-xs flex items-center gap-1">
                      <XCircle size={11} /> Inactive
                    </span>
                  )}
                </div>
              </div>

              {/* Banner Content Details */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-gray-900 text-base">{banner.title}</h3>
                  {banner.subtitle && (
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{banner.subtitle}</p>
                  )}
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span className="truncate max-w-[200px]">Link: {banner.linkUrl || "/"}</span>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(banner)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        banner.isActive
                          ? "text-amber-700 bg-amber-50 hover:bg-amber-100"
                          : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                      }`}
                    >
                      {banner.isActive ? "Turn Off" : "Make Live"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteBanner(banner._id, banner.title)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete banner"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Banner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-5 md:p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <ImageIcon size={18} />
                </div>
                <h3 className="font-extrabold text-gray-900 text-lg">Add New Promotional Banner</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Banner Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mega Ramadan Grocery Bazaar"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Subtitle / Slogan
                </label>
                <input
                  type="text"
                  placeholder="e.g. Get up to 40% OFF on all daily essentials"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Offer Badge / Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Exclusive Offer"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Display Priority (Order)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="1"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Target Link Destination
                </label>
                <input
                  type="text"
                  placeholder="e.g. /search?q=rice or /category-name"
                  value={formData.linkUrl}
                  onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Desktop Banner Image Upload */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Desktop Banner Image * (16:7 or 21:9 ratio recommended)
                </label>
                {formData.desktopImage ? (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 aspect-21/9 mb-2">
                    <img
                      src={formData.desktopImage}
                      alt="Desktop Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, desktopImage: "" })}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-500 hover:bg-indigo-50/30 cursor-pointer transition-all">
                    <UploadCloud size={24} className="text-indigo-600 mb-1" />
                    <span className="text-xs font-semibold text-gray-700">
                      {uploadingDesktop ? "Uploading..." : "Click to upload Desktop Banner Image"}
                    </span>
                    <span className="text-[10px] text-gray-400">PNG, JPG, WEBP up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingDesktop}
                      onChange={handleUploadDesktop}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Mobile Banner Image Upload (Optional) */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Mobile Banner Image (Optional - will fallback to desktop image)
                </label>
                {formData.mobileImage && formData.mobileImage !== formData.desktopImage ? (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 aspect-16/9 mb-2">
                    <img
                      src={formData.mobileImage}
                      alt="Mobile Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, mobileImage: "" })}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-gray-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/20 cursor-pointer transition-all">
                    <UploadCloud size={20} className="text-gray-400 mb-1" />
                    <span className="text-xs font-medium text-gray-600">
                      {uploadingMobile ? "Uploading..." : "Upload optional mobile-optimized image"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingMobile}
                      onChange={handleUploadMobile}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !formData.desktopImage}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  {submitting ? "Publishing..." : "Publish Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBannersPage;
