import { useState, useEffect, useCallback } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxioxToastError";
import toast from "react-hot-toast";
import { DisplayPriceInBDT } from "../utils/DisplayPriceInBDT";
import { getDeliveryStatusBadge, getPaymentStatusBadge } from "../utils/orderStatusBadge";
import {
  Package,
  Search,
  RefreshCw,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  AlertCircle,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  Copy,
  Check,
  Printer,
  ChevronLeft,
  ChevronRight,
  Filter,
  Layers,
  ArrowRight
} from "lucide-react";

const STATUS_OPTIONS = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const DELIVERY_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    All: 0,
    Pending: 0,
    Processing: 0,
    Shipped: 0,
    Delivered: 0,
    Cancelled: 0
  });

  // Filters & Pagination
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  // Modals state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [statusModalOrder, setStatusModalOrder] = useState(null);
  const [targetStatus, setTargetStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        delivery_status: activeTab,
        payment_status: paymentFilter,
        search: searchQuery.trim()
      });

      const response = await Axios({
        ...SummaryApi.getAllOrdersForAdmin,
        url: `${SummaryApi.getAllOrdersForAdmin.url}?${params.toString()}`
      });

      if (response.data.success) {
        setOrders(response.data.data || []);
        if (response.data.counts) {
          setCounts(response.data.counts);
        }
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.totalPages || 1);
          setTotalOrders(response.data.pagination.total || 0);
        }
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, activeTab, paymentFilter, searchQuery]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchOrders();
  };

  const handleTabChange = (status) => {
    setActiveTab(status);
    setCurrentPage(1);
  };

  const handleCopyOrderId = (id) => {
    if (!id) return;
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Order ID copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openStatusChangeModal = (order, newStatus) => {
    setStatusModalOrder(order);
    setTargetStatus(newStatus);
    setStatusNote("");
  };

  const closeStatusChangeModal = () => {
    setStatusModalOrder(null);
    setTargetStatus("");
    setStatusNote("");
  };

  const handleConfirmStatusChange = async () => {
    if (!statusModalOrder || !targetStatus) return;

    try {
      setUpdatingStatus(true);
      const response = await Axios({
        ...SummaryApi.updateOrderStatus,
        data: {
          orderId: statusModalOrder.orderId,
          delivery_status: targetStatus,
          note: statusNote.trim() || `Status updated to ${targetStatus} by Admin`
        }
      });

      if (response.data.success) {
        toast.success(response.data.message || "Order status updated successfully!");
        closeStatusChangeModal();
        fetchOrders();
        // Also update selectedOrder if details modal is open
        if (selectedOrder && selectedOrder.orderId === statusModalOrder.orderId) {
          setSelectedOrder((prev) => ({
            ...prev,
            delivery_status: targetStatus
          }));
        }
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handlePrintSlip = () => {
    window.print();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="p-3 md:p-6 bg-gray-50/50 min-h-screen space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-200">
              <Package size={22} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
                Order Management & Dispatch
              </h1>
              <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                Process customer orders, update delivery milestones & generate invoices
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold text-xs md:text-sm hover:bg-gray-50 hover:border-gray-300 transition-all shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin text-blue-600" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Counter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { key: "All", label: "All Orders", count: counts.All, color: "blue", icon: Layers },
          { key: "Pending", label: "Pending", count: counts.Pending, color: "amber", icon: Clock },
          { key: "Processing", label: "Processing", count: counts.Processing, color: "indigo", icon: RefreshCw },
          { key: "Shipped", label: "Shipped", count: counts.Shipped, color: "purple", icon: Truck },
          { key: "Delivered", label: "Delivered", count: counts.Delivered, color: "emerald", icon: CheckCircle2 },
          { key: "Cancelled", label: "Cancelled", count: counts.Cancelled, color: "rose", icon: XCircle }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => handleTabChange(item.key)}
              className={`text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-white border-blue-500 shadow-md ring-2 ring-blue-100"
                  : "bg-white border-gray-200/90 hover:border-gray-300 hover:shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500">{item.label}</span>
                <span className={`p-1.5 rounded-lg bg-${item.color}-50 text-${item.color}-600`}>
                  <Icon size={14} />
                </span>
              </div>
              <div className="text-xl font-extrabold text-gray-900 tracking-tight">
                {item.count}
              </div>
            </button>
          );
        })}
      </div>

      {/* Search, Filter & Tabs Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-gray-100">
          {STATUS_OPTIONS.map((status) => {
            const count = counts[status] !== undefined ? counts[status] : 0;
            const isActive = activeTab === status;
            return (
              <button
                key={status}
                onClick={() => handleTabChange(status)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>{status}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input & Payment Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID, customer name, email, phone, or product..."
              className="w-full pl-10 pr-24 py-2 text-xs md:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-all cursor-pointer"
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5">
              <Filter size={14} className="text-gray-500" />
              <span className="text-xs font-semibold text-gray-600">Payment:</span>
              <select
                value={paymentFilter}
                onChange={(e) => {
                  setPaymentFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-xs font-bold text-gray-800 focus:outline-hidden cursor-pointer"
              >
                <option value="All">All Types</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
                <option value="Paid">Paid (Online)</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            {(searchQuery || paymentFilter !== "All" || activeTab !== "All") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setPaymentFilter("All");
                  setActiveTab("All");
                  setCurrentPage(1);
                }}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 px-2 py-1.5 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          /* Loading Skeleton */
          <div className="p-6 space-y-4 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl" />
            ))}
          </div>
        ) : orders.length > 0 ? (
          /* Orders Data Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50/80 text-gray-500 font-bold border-b border-gray-200 uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Order ID & Date</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Items</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Delivery Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {orders.map((order) => {
                  const deliveryBadge = getDeliveryStatusBadge(order.delivery_status);
                  const paymentBadge = getPaymentStatusBadge(order.payment_status);
                  const firstItem = order.items?.[0];
                  const firstImage = Array.isArray(firstItem?.product_details?.image)
                    ? firstItem?.product_details?.image[0]
                    : firstItem?.product_details?.image;

                  return (
                    <tr
                      key={order.orderId}
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      {/* Order ID & Date */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                            {order.orderId}
                          </span>
                          <button
                            onClick={() => handleCopyOrderId(order.orderId)}
                            title="Copy Order ID"
                            className="text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                          >
                            {copiedId === order.orderId ? (
                              <Check size={13} className="text-green-600" />
                            ) : (
                              <Copy size={13} />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-1">
                          <Calendar size={11} className="text-gray-400" />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                      </td>

                      {/* Customer Details */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-xs shrink-0">
                            {order.customer?.name ? order.customer.name[0].toUpperCase() : "U"}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 truncate">
                              {order.customer?.name || "Customer"}
                            </p>
                            <p className="text-[11px] text-gray-500 truncate">
                              {order.customer?.email || order.customer?.mobile || "No contact info"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-lg border border-gray-200 bg-white overflow-hidden shrink-0 flex items-center justify-center">
                            {firstImage ? (
                              <img
                                src={firstImage}
                                alt="Item thumbnail"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package size={16} className="text-gray-400" />
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-gray-800 line-clamp-1">
                              {firstItem?.product_details?.name || "Item"}
                            </span>
                            <span className="text-[11px] text-gray-500">
                              {order.totalItems} {order.totalItems === 1 ? "unit" : "units"} (
                              {order.items?.length || 1} SKU)
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-gray-900 text-sm">
                          {DisplayPriceInBDT(order.totalAmount || 0)}
                        </span>
                      </td>

                      {/* Payment Status */}
                      <td className="py-3.5 px-4">
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${paymentBadge.badgeClass}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${paymentBadge.dot}`} />
                          <span>{paymentBadge.label}</span>
                        </div>
                      </td>

                      {/* Delivery Status & Dropdown Changer */}
                      <td className="py-3.5 px-4">
                        <div className="relative inline-block text-left">
                          <select
                            value={order.delivery_status || "Pending"}
                            onChange={(e) => openStatusChangeModal(order, e.target.value)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-xl border appearance-none pr-7 cursor-pointer transition-all ${deliveryBadge.bg} ${deliveryBadge.text} ${deliveryBadge.border}`}
                          >
                            {DELIVERY_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current opacity-70">
                            <ChevronRight size={12} className="rotate-90" />
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsDetailModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-all text-xs font-bold cursor-pointer shadow-2xs"
                        >
                          <Eye size={13} />
                          <span>Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State */
          <div className="py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Package size={28} />
            </div>
            <h3 className="text-base font-bold text-gray-900">No Orders Found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
              There are no orders matching your current filters or search query.
            </p>
          </div>
        )}

        {/* Pagination Bar */}
        {orders.length > 0 && (
          <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <div>
              Showing <span className="font-bold text-gray-800">{orders.length}</span> of{" "}
              <span className="font-bold text-gray-800">{totalOrders}</span> orders (Page{" "}
              <span className="font-bold text-gray-800">{currentPage}</span> of{" "}
              <span className="font-bold text-gray-800">{totalPages}</span>)
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title="Previous Page"
              >
                <ChevronLeft size={15} />
              </button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, idx) => {
                  const pNum = idx + 1;
                  // Only show current, first, last, and immediate siblings
                  if (
                    pNum === 1 ||
                    pNum === totalPages ||
                    (pNum >= currentPage - 1 && pNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pNum}
                        onClick={() => setCurrentPage(pNum)}
                        className={`w-8 h-8 rounded-lg font-bold text-xs cursor-pointer transition-all ${
                          currentPage === pNum
                            ? "bg-blue-600 text-white shadow-xs"
                            : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {pNum}
                      </button>
                    );
                  }
                  if (pNum === currentPage - 2 || pNum === currentPage + 2) {
                    return (
                      <span key={pNum} className="px-1 text-gray-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title="Next Page"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Delivery Status Change */}
      {statusModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  targetStatus === "Cancelled"
                    ? "bg-rose-100 text-rose-600"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {targetStatus === "Cancelled" ? <AlertCircle size={24} /> : <Truck size={24} />}
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">
                  Update Order Status
                </h3>
                <p className="text-xs text-gray-500 font-mono">
                  {statusModalOrder.orderId}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center justify-between text-xs">
              <div>
                <span className="text-gray-500 block text-[11px]">Current Status</span>
                <span className="font-bold text-gray-800">
                  {statusModalOrder.delivery_status || "Pending"}
                </span>
              </div>
              <ArrowRight size={16} className="text-gray-400" />
              <div>
                <span className="text-gray-500 block text-[11px]">New Status</span>
                <span className="font-extrabold text-blue-600">{targetStatus}</span>
              </div>
            </div>

            {targetStatus === "Cancelled" && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>
                  <strong>Important:</strong> Changing status to Cancelled will automatically restore
                  all ordered product quantities back into warehouse stock.
                </span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Admin Note / Tracking Info (Optional)
              </label>
              <textarea
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="e.g. Handed over to courier Steadfast (Consignment #12345)"
                rows={3}
                className="w-full p-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={closeStatusChangeModal}
                disabled={updatingStatus}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmStatusChange}
                disabled={updatingStatus}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-200 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {updatingStatus ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Confirm Status Update</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Order Details & Packing Slip Modal */}
      {isDetailModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 md:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-5 md:p-7 shadow-2xl border border-gray-100 space-y-6 animate-in zoom-in-95 duration-200 print:shadow-none print:border-none print:p-0">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base md:text-lg font-extrabold text-gray-900 bg-gray-100 px-2.5 py-0.5 rounded-lg">
                    {selectedOrder.orderId}
                  </span>
                  <div
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${
                      getDeliveryStatusBadge(selectedOrder.delivery_status).badgeClass
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        getDeliveryStatusBadge(selectedOrder.delivery_status).dot
                      }`}
                    />
                    <span>{selectedOrder.delivery_status || "Pending"}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Placed on {formatDate(selectedOrder.createdAt)}
                </p>
              </div>

              <div className="flex items-center gap-2 print:hidden">
                <button
                  onClick={handlePrintSlip}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer"
                >
                  <Printer size={14} />
                  <span>Print Slip</span>
                </button>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Customer & Delivery Address Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer Info */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-gray-900 border-b border-gray-200 pb-1.5">
                  <User size={15} className="text-blue-600" />
                  <span>Customer Information</span>
                </div>
                <p className="font-bold text-gray-800 text-sm">
                  {selectedOrder.customer?.name || "Customer Name Unavailable"}
                </p>
                <p className="flex items-center gap-1.5 text-gray-600">
                  <Mail size={12} className="text-gray-400" />
                  <span>{selectedOrder.customer?.email || "No email"}</span>
                </p>
                <p className="flex items-center gap-1.5 text-gray-600">
                  <Phone size={12} className="text-gray-400" />
                  <span>{selectedOrder.customer?.mobile || "No phone"}</span>
                </p>
              </div>

              {/* Delivery Address */}
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-900 border-b border-blue-200/60 pb-1.5">
                  <MapPin size={15} className="text-blue-600" />
                  <span>Delivery Address</span>
                </div>
                {selectedOrder.delivery_address ? (
                  <div className="space-y-1 text-gray-700">
                    <p className="font-bold text-gray-900">
                      {selectedOrder.delivery_address.homeName || "Home Address"}
                    </p>
                    <p className="text-gray-600">
                      {selectedOrder.delivery_address.roadName
                        ? `${selectedOrder.delivery_address.roadName}, `
                        : ""}
                      {selectedOrder.delivery_address.city || ""}{" "}
                      {selectedOrder.delivery_address.zipCode
                        ? `- ${selectedOrder.delivery_address.zipCode}`
                        : ""}
                    </p>
                    {selectedOrder.delivery_address.mobile && (
                      <p className="flex items-center gap-1 text-gray-600 pt-0.5">
                        <Phone size={11} className="text-gray-400" />
                        <span>{selectedOrder.delivery_address.mobile}</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">No delivery address specified.</p>
                )}
              </div>
            </div>

            {/* Items Ordered List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Ordered Items ({selectedOrder.items?.length || 0})
              </h4>
              <div className="space-y-2 border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100">
                {selectedOrder.items?.map((item, idx) => {
                  const image = Array.isArray(item.product_details?.image)
                    ? item.product_details?.image[0]
                    : item.product_details?.image;

                  return (
                    <div key={item._id || idx} className="p-3 bg-white flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 shrink-0 flex items-center justify-center">
                        {image ? (
                          <img
                            src={image}
                            alt={item.product_details?.name || "Item"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package size={18} className="text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-gray-900 line-clamp-1">
                          {item.product_details?.name || "Product"}
                        </h5>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Unit: {DisplayPriceInBDT(item.subTotalAmt || 0)} × {item.quantity || 1}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-extrabold text-gray-900">
                          {DisplayPriceInBDT(item.totalAmt || 0)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total Calculation & Payment Status */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs space-y-1">
                <p className="text-gray-600">
                  Payment Method:{" "}
                  <span className="font-bold text-gray-900">
                    {selectedOrder.payment_status}
                  </span>
                </p>
                {selectedOrder.paymentId && (
                  <p className="text-gray-500 font-mono text-[11px]">
                    Transaction ID: {selectedOrder.paymentId}
                  </p>
                )}
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500 block">Total Order Value</span>
                <span className="text-xl font-extrabold text-blue-700">
                  {DisplayPriceInBDT(selectedOrder.totalAmount || 0)}
                </span>
              </div>
            </div>

            {/* Status History Timeline */}
            {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Status Timeline & Audit Log
                </h4>
                <div className="space-y-2 border-l-2 border-blue-200 pl-4 ml-2">
                  {selectedOrder.statusHistory.map((history, hIdx) => (
                    <div key={hIdx} className="relative text-xs space-y-0.5">
                      <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-gray-900">{history.status}</span>
                        <span className="text-[10px] text-gray-400">
                          {formatDate(history.timestamp)}
                        </span>
                      </div>
                      {history.note && (
                        <p className="text-gray-600 text-[11px] bg-gray-50 p-2 rounded-lg border border-gray-100">
                          {history.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
