export const getDeliveryStatusBadge = (status) => {
  const normalized = (status || "").toLowerCase();

  switch (normalized) {
    case "pending":
      return {
        label: "Pending",
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        dot: "bg-amber-500",
        badgeClass: "bg-amber-50 text-amber-700 border-amber-200"
      };
    case "processing":
      return {
        label: "Processing",
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        dot: "bg-blue-500",
        badgeClass: "bg-blue-50 text-blue-700 border-blue-200"
      };
    case "shipped":
      return {
        label: "Shipped",
        bg: "bg-purple-50",
        text: "text-purple-700",
        border: "border-purple-200",
        dot: "bg-purple-500",
        badgeClass: "bg-purple-50 text-purple-700 border-purple-200"
      };
    case "delivered":
      return {
        label: "Delivered",
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        dot: "bg-emerald-500",
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200"
      };
    case "cancelled":
      return {
        label: "Cancelled",
        bg: "bg-rose-50",
        text: "text-rose-700",
        border: "border-rose-200",
        dot: "bg-rose-500",
        badgeClass: "bg-rose-50 text-rose-700 border-rose-200"
      };
    default:
      return {
        label: status || "Pending",
        bg: "bg-gray-50",
        text: "text-gray-700",
        border: "border-gray-200",
        dot: "bg-gray-400",
        badgeClass: "bg-gray-50 text-gray-700 border-gray-200"
      };
  }
};

export const getPaymentStatusBadge = (status) => {
  const normalized = (status || "").toLowerCase();

  if (normalized === "paid" || normalized === "success") {
    return {
      label: "Paid",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500"
    };
  }
  if (normalized.includes("cash on delivery") || normalized === "cod") {
    return {
      label: "Cash on Delivery",
      badgeClass: "bg-sky-50 text-sky-700 border-sky-200",
      dot: "bg-sky-500"
    };
  }
  if (normalized === "pending") {
    return {
      label: "Pending Payment",
      badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500"
    };
  }
  if (normalized === "failed" || normalized === "cancelled") {
    return {
      label: normalized === "failed" ? "Payment Failed" : "Cancelled",
      badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
      dot: "bg-rose-500"
    };
  }
  return {
    label: status || "Unpaid",
    badgeClass: "bg-gray-50 text-gray-700 border-gray-200",
    dot: "bg-gray-400"
  };
};
