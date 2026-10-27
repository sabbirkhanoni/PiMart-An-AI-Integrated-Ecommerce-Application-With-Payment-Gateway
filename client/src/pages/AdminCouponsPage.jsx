import { useState, useEffect } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxioxToastError";
import toast from "react-hot-toast";
import {
  Ticket,
  Plus,
  Percent,
  Calendar,
  CheckCircle2,
  XCircle,
  Copy,
  Trash2,
  Clock,
  Sparkles,
  ShoppingBag,
  TrendingDown,
  X,
} from "lucide-react";
import Loading from "../components/Mini/Loading";

const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "0",
    maxDiscountAmount: "0",
    usageLimit: "100",
    validUntil: "",
    isActive: true,
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getAllCouponsAdmin,
      });
      if (response.data.success) {
        setCoupons(response.data.data || []);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Copied "${code}" to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleToggleStatus = async (coupon) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateCoupon,
        data: {
          _id: coupon._id,
          isActive: !coupon.isActive,
        },
      });
      if (response.data.success) {
        toast.success(`Coupon ${coupon.isActive ? "deactivated" : "activated"}`);
        fetchCoupons();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleDeleteCoupon = async (id, code) => {
    if (!window.confirm(`Are you sure you want to delete coupon "${code}"?`)) return;
    try {
      const response = await Axios({
        ...SummaryApi.deleteCoupon,
        data: { _id: id },
      });
      if (response.data.success) {
        toast.success(`Coupon "${code}" deleted.`);
        fetchCoupons();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discountValue || !formData.validUntil) {
      toast.error("Please fill in code, discount value, and expiration date.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await Axios({
        ...SummaryApi.createCoupon,
        data: {
          ...formData,
          discountValue: Number(formData.discountValue),
          minOrderAmount: Number(formData.minOrderAmount) || 0,
          maxDiscountAmount: Number(formData.maxDiscountAmount) || 0,
          usageLimit: Number(formData.usageLimit) || 100,
        },
      });

      if (response.data.success) {
        toast.success("Coupon created successfully!");
        setIsModalOpen(false);
        setFormData({
          code: "",
          description: "",
          discountType: "percentage",
          discountValue: "",
          minOrderAmount: "0",
          maxDiscountAmount: "0",
          usageLimit: "100",
          validUntil: "",
          isActive: true,
        });
        fetchCoupons();
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
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-xs">
              <Ticket size={20} />
            </div>
            <span>Coupons & Promo Codes</span>
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Create and manage promotional discount vouchers for customer checkout
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs md:text-sm font-bold transition-all shadow-sm shadow-purple-200 hover:shadow-md cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* Coupons List */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loading />
        </div>
      ) : coupons.length === 0 ? (
        <div className="bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 p-12 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3 shadow-2xs">
            <Ticket size={28} />
          </div>
          <h3 className="font-bold text-gray-900 text-base">No Coupons Created Yet</h3>
          <p className="text-xs text-gray-500 mt-1 mb-5">
            Create your first promo code to delight customers with discounts during checkout.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            Create Coupon
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {coupons.map((coupon) => {
            const isExpired = new Date(coupon.validUntil) < new Date();
            const usagePercent =
              coupon.usageLimit > 0
                ? Math.min(100, Math.round((coupon.usedCount / coupon.usageLimit) * 100))
                : 0;

            return (
              <div
                key={coupon._id}
                className={`rounded-2xl border transition-all p-4 relative flex flex-col justify-between ${
                  !coupon.isActive || isExpired
                    ? "bg-gray-50/70 border-gray-200 opacity-75"
                    : "bg-white border-purple-100 shadow-xs hover:shadow-md"
                }`}
              >
                <div>
                  {/* Top: Code & Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-extrabold tracking-wider px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg shadow-2xs">
                        {coupon.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(coupon.code)}
                        className="text-gray-400 hover:text-purple-600 p-1 rounded-md transition-colors cursor-pointer"
                        title="Copy code"
                      >
                        <Copy size={15} />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isExpired ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Expired
                        </span>
                      ) : coupon.isActive ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 size={11} /> Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200 flex items-center gap-1">
                          <XCircle size={11} /> Inactive
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Discount Value Display */}
                  <div className="mb-2">
                    <p className="text-xl font-extrabold text-gray-900 flex items-center gap-1.5">
                      {coupon.discountType === "percentage" ? (
                        <>
                          <Percent size={18} className="text-purple-600" />
                          <span>{coupon.discountValue}% OFF</span>
                        </>
                      ) : (
                        <>
                          <TrendingDown size={18} className="text-emerald-600" />
                          <span>৳{coupon.discountValue} FLAT OFF</span>
                        </>
                      )}
                    </p>
                    {coupon.description && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {coupon.description}
                      </p>
                    )}
                  </div>

                  {/* Conditions Details */}
                  <div className="space-y-1.5 text-xs text-gray-500 py-2 border-y border-gray-100 my-2">
                    <div className="flex items-center justify-between">
                      <span>Min Order:</span>
                      <span className="font-semibold text-gray-700">
                        ৳{coupon.minOrderAmount}
                      </span>
                    </div>

                    {coupon.discountType === "percentage" && coupon.maxDiscountAmount > 0 && (
                      <div className="flex items-center justify-between">
                        <span>Max Discount:</span>
                        <span className="font-semibold text-gray-700">
                          ৳{coupon.maxDiscountAmount}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} className="text-gray-400" />
                        <span>Expires:</span>
                      </span>
                      <span className="font-semibold text-gray-700">
                        {new Date(coupon.validUntil).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Usage Progress */}
                  <div className="pt-1 pb-3">
                    <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                      <span>Usage: {coupon.usedCount} used</span>
                      <span>Limit: {coupon.usageLimit}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-purple-600 h-1.5 rounded-full transition-all"
                        style={{ width: `${usagePercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(coupon)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      coupon.isActive
                        ? "text-amber-700 bg-amber-50 hover:bg-amber-100"
                        : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                    }`}
                  >
                    {coupon.isActive ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteCoupon(coupon._id, coupon.code)}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete coupon"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-5 md:p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Ticket size={18} />
                </div>
                <h3 className="font-extrabold text-gray-900 text-lg">Create New Coupon</h3>
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
                  Coupon Code *
                </label>
                <input
                  type="text"
                  placeholder="e.g. SAVE20, EID2026, WELCOME100"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-mono font-bold uppercase focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. 20% discount on groceries"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat BDT (৳)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder={formData.discountType === "percentage" ? "e.g. 15" : "e.g. 100"}
                    required
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Min Order (৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                {formData.discountType === "percentage" && (
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Max Discount (৳)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0 (no limit)"
                      value={formData.maxDiscountAmount}
                      onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="100"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Expires On *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
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
                  disabled={submitting}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  {submitting ? "Saving..." : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCouponsPage;
