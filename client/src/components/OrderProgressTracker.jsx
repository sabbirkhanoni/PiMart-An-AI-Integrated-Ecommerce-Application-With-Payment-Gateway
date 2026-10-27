import PropTypes from "prop-types";
import { Package, Clock, Truck, CheckCircle2, XCircle } from "lucide-react";

const STEPS = [
  { key: "Pending", label: "Order Placed", icon: Package, desc: "Order received" },
  { key: "Processing", label: "Processing", icon: Clock, desc: "Packing & preparation" },
  { key: "Shipped", label: "Shipped", icon: Truck, desc: "On the way" },
  { key: "Delivered", label: "Delivered", icon: CheckCircle2, desc: "Package delivered" },
];

const STATUS_INDEX_MAP = {
  Pending: 0,
  Processing: 1,
  Shipped: 2,
  Delivered: 3,
};

const OrderProgressTracker = ({ deliveryStatus = "Pending", statusHistory = [] }) => {
  const isCancelled = (deliveryStatus || "").toLowerCase() === "cancelled";

  if (isCancelled) {
    const cancelledEntry = statusHistory?.find(
      (h) => (h.status || "").toLowerCase() === "cancelled"
    );

    return (
      <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
            <XCircle size={18} className="text-rose-600" />
          </div>
          <div>
            <p className="font-bold text-rose-900 text-sm">Order Cancelled</p>
            <p className="text-[11px] text-rose-600 mt-0.5">
              {cancelledEntry?.note || "This order was cancelled and inventory was returned."}
            </p>
          </div>
        </div>
        {cancelledEntry?.timestamp && (
          <span className="text-[10px] text-rose-500 font-mono shrink-0">
            {new Date(cancelledEntry.timestamp).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>
    );
  }

  const currentIdx = STATUS_INDEX_MAP[deliveryStatus] !== undefined ? STATUS_INDEX_MAP[deliveryStatus] : 0;
  const progressPercent = (currentIdx / (STEPS.length - 1)) * 100;

  return (
    <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100/90 space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-gray-700">Delivery Status</span>
        <span className="font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
          Stage {currentIdx + 1} of 4: {STEPS[currentIdx]?.label}
        </span>
      </div>

      <div className="relative pt-2 pb-1">
        {/* Progress Background Line */}
        <div className="absolute top-6 left-6 right-6 h-1 bg-gray-200 -translate-y-1/2 z-0" />

        {/* Active Progress Fill Line */}
        <div
          className="absolute top-6 left-6 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `calc(${progressPercent}% * (100% - 48px) / 100)` }}
        />

        {/* Steps Grid */}
        <div className="relative z-10 flex items-start justify-between">
          {STEPS.map((step, idx) => {
            const isCompleted = idx <= currentIdx;
            const isCurrent = idx === currentIdx;
            const Icon = step.icon;

            const historyEntry = statusHistory?.find(
              (h) => (h.status || "").toLowerCase() === step.key.toLowerCase()
            );

            return (
              <div
                key={step.key}
                className="flex flex-col items-center text-center flex-1 max-w-[100px]"
              >
                {/* Step Circle */}
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-2xs ${
                    isCurrent
                      ? "bg-blue-600 text-white ring-4 ring-blue-100 scale-110"
                      : isCompleted
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-400 border border-gray-200"
                  }`}
                >
                  <Icon size={16} />
                </div>

                {/* Step Label */}
                <p
                  className={`text-[11px] font-bold mt-2 leading-tight ${
                    isCurrent
                      ? "text-blue-700"
                      : isCompleted
                      ? "text-gray-900"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </p>

                {/* Step Timestamp if present */}
                {historyEntry?.timestamp ? (
                  <span className="text-[9px] text-gray-400 mt-0.5 font-mono">
                    {new Date(historyEntry.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                ) : (
                  <span className="text-[9px] text-gray-400 mt-0.5 hidden sm:inline">
                    {step.desc}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

OrderProgressTracker.propTypes = {
  deliveryStatus: PropTypes.string,
  statusHistory: PropTypes.arrayOf(
    PropTypes.shape({
      status: PropTypes.string,
      timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      note: PropTypes.string,
    })
  ),
};

export default OrderProgressTracker;
