import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../contexts/GlobalContext";
import { DisplayPriceInBDT } from "../utils/DisplayPriceInBDT";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxioxToastError";
import OrderProgressTracker from "../components/OrderProgressTracker";
import { getDeliveryStatusBadge } from "../utils/orderStatusBadge";
import {
  Package,
  Calendar,
  MapPin,
  Phone,
  CreditCard,
  Copy,
  Check,
  ShoppingBag,
  ExternalLink,
  AlertTriangle,
  RefreshCw,
  XCircle,
} from "lucide-react";

const PersonalOrder = () => {
  const orderedProduct = useSelector((state) => state?.order?.orderDataSet || []);
  const { fetchOrderedProducts } = useGlobalContext();
  const [copiedId, setCopiedId] = useState(null);
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (fetchOrderedProducts) {
      fetchOrderedProducts();
    }
  }, []);

  // Group products by orderId so all products in the same checkout appear in one order card
  const groupedOrders = useMemo(() => {
    if (!orderedProduct || orderedProduct.length === 0) return [];

    const groupsMap = new Map();

    orderedProduct.forEach((order) => {
      const orderKey = order?.orderId || order?._id;

      if (!groupsMap.has(orderKey)) {
        groupsMap.set(orderKey, {
          orderId: order?.orderId,
          _id: order?._id,
          createdAt: order?.createdAt,
          payment_status: order?.payment_status,
          paymentId: order?.paymentId,
          delivery_address: order?.delivery_address,
          delivery_status: order?.delivery_status || "Pending",
          statusHistory: order?.statusHistory || [],
          items: [],
          grandTotal: 0,
        });
      }

      const currentGroup = groupsMap.get(orderKey);
      currentGroup.items.push(order);
      currentGroup.grandTotal += Number(order?.totalAmt || 0);
    });

    return Array.from(groupsMap.values());
  }, [orderedProduct]);

  const handleCopyOrderId = (id) => {
    if (!id) return;
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Order ID copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCancelOrder = async () => {
    if (!cancelModalOrder) return;

    try {
      setCancelling(true);
      const response = await Axios({
        ...SummaryApi.cancelOrder,
        data: {
          orderId: cancelModalOrder.orderId,
          reason: cancelReason.trim() || "Cancelled by customer",
        },
      });

      if (response.data.success) {
        toast.success(response.data.message || "Order cancelled successfully!");
        setCancelModalOrder(null);
        setCancelReason("");
        if (fetchOrderedProducts) {
          fetchOrderedProducts();
        }
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setCancelling(false);
    }
  };

  const getPaymentStatusBadge = (status) => {
    const normalized = (status || "").toLowerCase();
    if (normalized === "paid" || normalized === "success") {
      return {
        text: "Paid",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        dotColor: "bg-emerald-500",
      };
    }
    if (normalized.includes("cash on delivery")) {
      return {
        text: "Cash on Delivery",
        className: "bg-sky-50 text-sky-700 border-sky-200",
        dotColor: "bg-sky-500",
      };
    }
    if (normalized === "pending") {
      return {
        text: "Pending",
        className: "bg-amber-50 text-amber-700 border-amber-200",
        dotColor: "bg-amber-500",
      };
    }
    if (normalized === "failed" || normalized === "cancelled") {
      return {
        text: normalized === "failed" ? "Payment Failed" : "Cancelled",
        className: "bg-rose-50 text-rose-700 border-rose-200",
        dotColor: "bg-rose-500",
      };
    }
    return {
      text: status || "Processing",
      className: "bg-gray-50 text-gray-700 border-gray-200",
      dotColor: "bg-gray-400",
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <section className="bg-white p-3 md:p-6 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-gray-200 gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="text-blue-600" size={26} />
            My Orders
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Track and manage your purchase history
          </p>
        </div>
        {groupedOrders?.length > 0 && (
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 w-fit shadow-xs">
            {groupedOrders.length} {groupedOrders.length === 1 ? "Order Placed" : "Orders Placed"} ({orderedProduct.length} {orderedProduct.length === 1 ? "item" : "items"})
          </span>
        )}
      </div>

      {/* Orders List or Empty State */}
      {groupedOrders && groupedOrders.length > 0 ? (
        <div className="space-y-6">
          {groupedOrders.map((orderGroup, index) => {
            const statusBadge = getPaymentStatusBadge(orderGroup?.payment_status);
            const deliveryBadge = getDeliveryStatusBadge(orderGroup?.delivery_status);
            const address = orderGroup?.delivery_address;
            const canCancel = (orderGroup?.delivery_status || "Pending").toLowerCase() === "pending";

            return (
              <div
                key={orderGroup?.orderId || orderGroup?._id || index}
                className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Decorative Top Gradient Accent */}
                <div className="h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-teal-400" />

                <div className="p-4 md:p-5 space-y-4">
                  {/* Order Top Bar: ID, Date, Delivery & Payment Status */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-gray-500">Order ID:</span>
                        <span className="text-xs font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                          {orderGroup?.orderId}
                        </span>
                        <button
                          onClick={() => handleCopyOrderId(orderGroup?.orderId)}
                          title="Copy Order ID"
                          className="text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          {copiedId === orderGroup?.orderId ? (
                            <Check size={14} className="text-green-600" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>

                      {orderGroup?.createdAt && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Calendar size={13} className="text-gray-400" />
                          <span>{formatDate(orderGroup?.createdAt)}</span>
                        </div>
                      )}
                    </div>

                    {/* Status Badges & Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${deliveryBadge.badgeClass}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${deliveryBadge.dot}`} />
                        <span>{deliveryBadge.label}</span>
                      </div>

                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge.className}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dotColor}`} />
                        <span>{statusBadge.text}</span>
                      </div>

                      {canCancel && (
                        <button
                          onClick={() => {
                            setCancelModalOrder(orderGroup);
                            setCancelReason("");
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-600 hover:text-white transition-all cursor-pointer shadow-2xs"
                        >
                          <XCircle size={13} />
                          <span>Cancel Order</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Visual Step-by-Step Delivery Progress Tracker */}
                  <OrderProgressTracker
                    deliveryStatus={orderGroup?.delivery_status}
                    statusHistory={orderGroup?.statusHistory}
                  />

                  {/* List of Products in this Order */}
                  <div className="space-y-3">
                    {orderGroup.items.map((item, itemIdx) => {
                      const productImage = Array.isArray(item?.product_details?.image)
                        ? item?.product_details?.image[0]
                        : item?.product_details?.image;

                      return (
                        <div
                          key={item?._id || itemIdx}
                          className="flex items-center gap-3 bg-gray-50/70 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-white flex items-center justify-center">
                            {productImage ? (
                              <img
                                src={productImage}
                                alt={item?.product_details?.name || "Product"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package size={22} className="text-gray-300" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                              {item?.product_details?.name || "Product"}
                            </h4>

                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">
                                Price:{" "}
                                <span className="font-medium text-gray-700">
                                  {DisplayPriceInBDT(item?.subTotalAmt || 0)}
                                </span>
                              </span>
                              <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 font-medium rounded-md border border-blue-100">
                                Qty: {item?.quantity || 1}
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-xs text-gray-500 block">Subtotal</span>
                            <span className="text-sm font-bold text-gray-900">
                              {DisplayPriceInBDT(item?.totalAmt || 0)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Order Footer: Payment & Delivery Information & Grand Total */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                    {/* Payment Info */}
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-medium text-gray-700 mb-1">
                        <CreditCard size={14} className="text-blue-500" />
                        <span>Payment Details</span>
                      </div>
                      <p className="text-gray-600">
                        Method: <span className="font-semibold text-gray-800">{orderGroup?.payment_status}</span>
                      </p>
                      {orderGroup?.paymentId ? (
                        <p className="text-gray-600 truncate" title={orderGroup.paymentId}>
                          Txn ID: <span className="font-mono text-[11px] text-gray-700">{orderGroup.paymentId}</span>
                        </p>
                      ) : (
                        <p className="text-gray-500 italic">No online transaction ID</p>
                      )}
                    </div>

                    {/* Delivery Address (Safe with fallbacks) */}
                    <div className="p-3 rounded-xl bg-blue-50/40 border border-blue-100/60 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-medium text-blue-900 mb-1">
                        <MapPin size={14} className="text-blue-600 shrink-0" />
                        <span>Delivered To</span>
                      </div>

                      {address && typeof address === "object" ? (
                        <div className="space-y-0.5 text-gray-700">
                          <p className="font-semibold text-gray-900 truncate">
                            {address?.homeName || "Home"}
                          </p>
                          <p className="text-gray-600 truncate">
                            {address?.roadName ? `${address.roadName}, ` : ""}
                            {address?.city || ""} {address?.zipCode ? `- ${address.zipCode}` : ""}
                          </p>
                          {address?.mobile && (
                            <p className="flex items-center gap-1 text-gray-600 pt-0.5">
                              <Phone size={11} className="text-gray-400" />
                              <span>{address.mobile}</span>
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-400 italic">Address details unavailable</p>
                      )}
                    </div>

                    {/* Grand Order Total */}
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex flex-col justify-center text-right">
                      <span className="text-xs text-gray-500 font-medium">Grand Order Total</span>
                      <span className="text-lg md:text-xl font-extrabold text-blue-700">
                        {DisplayPriceInBDT(orderGroup.grandTotal)}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        Inclusive of all taxes & charges
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-50/60 rounded-2xl border border-dashed border-gray-300 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shadow-sm">
            <ShoppingBag size={32} />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900">No Orders Yet</h2>
          <p className="text-sm text-gray-500 max-w-sm mt-1 mb-6">
            You haven&apos;t placed any orders yet. Discover our fresh collection and start shopping today!
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            Start Shopping
            <ExternalLink size={15} />
          </Link>
        </div>
      )}

      {/* Cancellation Modal */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">Cancel Order</h3>
                <p className="text-xs text-gray-500 font-mono">
                  {cancelModalOrder.orderId}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to cancel this order? The ordered items will be immediately returned to warehouse stock and you will not be charged.
            </p>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Reason for Cancellation (Optional)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Changed mind, ordered by mistake, etc."
                rows={3}
                className="w-full p-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setCancelModalOrder(null);
                  setCancelReason("");
                }}
                disabled={cancelling}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Nevermind
              </button>
              <button
                type="button"
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition-all shadow-md shadow-rose-200 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {cancelling ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <span>Yes, Cancel Order</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PersonalOrder;
