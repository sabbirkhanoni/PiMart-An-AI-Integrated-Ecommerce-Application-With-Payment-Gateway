import { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxioxToastError";
import { DisplayPriceInBDT } from "../utils/DisplayPriceInBDT";
import toast from "react-hot-toast";
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Users,
  Package,
  RefreshCw,
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Download,
  Award,
  Sparkles,
  PieChart,
  UserCheck,
  DollarSign,
  Coins,
} from "lucide-react";

const CACHE_KEY = "PIMART_ADMIN_ANALYTICS_CACHE";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes fresh cache

const DEFAULT_ANALYTICS_DATA = {
  summary: {
    totalRevenue: 0,
    todayRevenue: 0,
    yesterdayRevenue: 0,
    thisMonthRevenue: 0,
    lastMonthRevenue: 0,
    momGrowthPercent: 0,
    totalOrders: 0,
    todayOrdersCount: 0,
    thisMonthOrdersCount: 0,
    averageOrderValue: 0,
    totalItemsSold: 0,
    totalCustomers: 0,
    newCustomersThisMonth: 0,
    totalBuyersCount: 0,
    repeatBuyersCount: 0,
    repeatCustomerRate: 0,
    totalProducts: 0,
    totalCategories: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    totalStockValue: 0,
    totalUnitsInWarehouse: 0,
  },
  profitAndLoss: {
    totalGrossProfit: 0,
    todayGrossProfit: 0,
    thisMonthGrossProfit: 0,
    totalCOGS: 0,
    totalDiscountGiven: 0,
    netProfitMargin: 0,
    isNetProfit: true,
  },
  mostProfitableProducts: [],
  topVipCustomers: [],
  categorySales: [],
  monthlySales: [],
  dailySales: [],
  paymentMethods: [],
  topProducts: [],
  lowStockAlerts: [],
  recentOrders: [],
};

const getCachedAnalytics = () => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.data && typeof parsed.timestamp === "number") {
      const isFresh = Date.now() - parsed.timestamp < CACHE_TTL_MS;
      return { data: parsed.data, isFresh };
    }
  } catch {
    // Ignore storage parse error
  }
  return null;
};

const setCachedAnalytics = (analyticsData) => {
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        data: analyticsData,
        timestamp: Date.now(),
      })
    );
  } catch {
    // Ignore storage quota error
  }
};

// Rich Realistic Skeleton UI mirroring the actual Dashboard structure
const AnalyticsDashboardSkeleton = () => {
  return (
    <div className="space-y-6 p-1 pb-10">
      {/* 1. Header Banner Skeleton */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl text-white shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden animate-pulse">
        <div className="space-y-3 relative z-10">
          <div className="h-6 w-48 bg-white/10 rounded-full"></div>
          <div className="h-9 sm:h-10 w-72 sm:w-96 bg-white/20 rounded-xl"></div>
          <div className="h-4 w-60 sm:w-80 bg-white/10 rounded-lg"></div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <div className="h-10 w-32 bg-white/10 rounded-xl"></div>
          <div className="h-10 w-28 bg-white/10 rounded-xl"></div>
          <div className="h-10 w-32 bg-white/20 rounded-xl"></div>
        </div>
      </div>

      {/* 2. Top-Level Executive KPI Cards (Row 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs space-y-3 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-28 bg-gray-200 rounded"></div>
              <div className="w-10 h-10 rounded-xl bg-gray-100"></div>
            </div>
            <div className="h-8 w-36 bg-gray-200 rounded-lg"></div>
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <div className="h-4 w-28 bg-gray-100 rounded"></div>
              <div className="h-4 w-16 bg-gray-100 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Profit & Loss Overview Banner Skeleton */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 rounded-3xl p-6 sm:p-7 border border-emerald-900/40 shadow-lg space-y-6 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10"></div>
            <div className="space-y-1.5">
              <div className="h-6 w-56 bg-white/20 rounded"></div>
              <div className="h-3 w-40 bg-white/10 rounded"></div>
            </div>
          </div>
          <div className="h-7 w-32 bg-white/10 rounded-xl"></div>
        </div>

        {/* 4 Financial Sub-Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white/10 rounded-2xl p-4.5 border border-white/10 space-y-2.5"
            >
              <div className="h-3 w-24 bg-white/20 rounded"></div>
              <div className="h-7 w-32 bg-white/30 rounded"></div>
              <div className="h-3 w-40 bg-white/15 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Operational Health (Row 3: Inventory Capital & Monthly Pace) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs space-y-2.5 animate-pulse">
          <div className="h-4 w-44 bg-emerald-100/70 rounded"></div>
          <div className="h-7 w-36 bg-gray-200 rounded"></div>
          <div className="h-3 w-64 bg-gray-100 rounded"></div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-xs space-y-2.5 animate-pulse">
          <div className="h-4 w-44 bg-blue-100/70 rounded"></div>
          <div className="h-7 w-36 bg-gray-200 rounded"></div>
          <div className="h-3 w-64 bg-gray-100 rounded"></div>
        </div>
      </div>

      {/* 5. Sales & Profit Interactive Trendline Chart Skeleton */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs space-y-6 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div className="space-y-1.5">
            <div className="h-6 w-64 bg-gray-200 rounded"></div>
            <div className="h-3 w-48 bg-gray-100 rounded"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-36 bg-gray-100 rounded-xl"></div>
            <div className="h-9 w-44 bg-gray-100 rounded-xl"></div>
          </div>
        </div>

        {/* Mock Pillars */}
        <div className="pt-2">
          <div className="grid grid-flow-col auto-cols-fr gap-2 sm:gap-3 items-end h-64 sm:h-72 px-2 pt-6 pb-2 border-b border-gray-200">
            {[45, 75, 35, 90, 60, 40, 80, 55, 70, 65, 85, 95].map((height, idx) => (
              <div key={idx} className="h-full flex flex-col items-center justify-end">
                <div
                  style={{ height: `${height}%` }}
                  className="w-full max-w-[42px] bg-gradient-to-t from-gray-200 to-gray-100 rounded-t-lg mx-auto"
                ></div>
              </div>
            ))}
          </div>
          <div className="grid grid-flow-col auto-cols-fr gap-2 sm:gap-3 px-2 pt-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div key={i} className="h-3 w-8 bg-gray-100 rounded mx-auto"></div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Strategic Breakdown: Category Share & VIP Customers Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs space-y-4 animate-pulse">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="h-5 w-48 bg-gray-200 rounded"></div>
            <div className="h-4 w-20 bg-gray-100 rounded"></div>
          </div>
          <div className="space-y-4 pt-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-4 w-32 bg-gray-100 rounded"></div>
                </div>
                <div className="h-2.5 w-full bg-gray-100 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs space-y-4 animate-pulse">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="h-5 w-44 bg-gray-200 rounded"></div>
            <div className="h-5 w-24 bg-emerald-50 rounded-full"></div>
          </div>
          <div className="space-y-3 pt-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-gray-50/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  <div className="space-y-1">
                    <div className="h-4 w-28 bg-gray-200 rounded"></div>
                    <div className="h-3 w-36 bg-gray-100 rounded"></div>
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <div className="h-4 w-20 bg-gray-200 rounded ml-auto"></div>
                  <div className="h-2.5 w-16 bg-gray-100 rounded ml-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AnalyticsDashboardPage = () => {
  const cachedEntry = useMemo(() => getCachedAnalytics(), []);
  const [data, setData] = useState(cachedEntry?.data || DEFAULT_ANALYTICS_DATA);
  const [loading, setLoading] = useState(!cachedEntry?.data);
  const [refreshing, setRefreshing] = useState(false);

  const [chartView, setChartView] = useState("monthly"); // "monthly" | "daily"
  const [metricView, setMetricView] = useState("revenue"); // "revenue" | "profit" | "orders"
  const [productTab, setProductTab] = useState("volume"); // "volume" | "profit"
  const [orderSearch, setOrderSearch] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Fetch Analytics Overview (Supports background revalidation & cache updating)
  const fetchAnalytics = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setRefreshing(true);
      } else if (!data?.monthlySales?.length) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const response = await Axios({
        ...SummaryApi.getAdminAnalyticsOverview,
      });

      const { data: responseData } = response;
      if (responseData.success && responseData.data) {
        setData(responseData.data);
        setCachedAnalytics(responseData.data);
        if (isManualRefresh) {
          toast.success("Analytics refreshed with live data");
        }
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [data?.monthlySales?.length]);

  useEffect(() => {
    // If cache is missing or stale, fetch latest data
    if (!cachedEntry?.isFresh) {
      fetchAnalytics();
    }
  }, [cachedEntry, fetchAnalytics]);

  // Handle Order Status Update
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      const response = await Axios({
        ...SummaryApi.updateOrderStatus,
        data: {
          orderId,
          payment_status: newStatus,
        },
      });

      if (response.data.success) {
        toast.success(`Order ${orderId} updated to ${newStatus}`);
        fetchAnalytics(true);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Export Orders CSV
  const handleExportCSV = () => {
    const orders = data?.recentOrders || [];
    if (orders.length === 0) {
      toast.error("No orders available to export");
      return;
    }

    const headers = [
      "Order ID",
      "Customer Name",
      "Email",
      "Mobile",
      "Product Item",
      "Quantity",
      "Amount (BDT)",
      "Payment Status",
      "Order Date",
    ];

    const rows = orders.map((o) => [
      `"${o.orderId || o._id}"`,
      `"${o.userId?.name || "Guest Customer"}"`,
      `"${o.userId?.email || "N/A"}"`,
      `"${o.userId?.mobile || "N/A"}"`,
      `"${o.product_details?.name || "Product"}"`,
      o.quantity || 1,
      o.totalAmt || 0,
      `"${o.payment_status || "Pending"}"`,
      `"${o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-GB") : "N/A"}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `PiMart_Store_Orders_Report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Orders report exported to CSV successfully");
  };

  const summary = data?.summary || {};
  const pnl = data?.profitAndLoss || {};

  // Active chart dataset
  const chartData = useMemo(() => {
    return chartView === "monthly" ? data?.monthlySales || [] : data?.dailySales || [];
  }, [chartView, data]);

  // Max value for chart scaling
  const maxChartValue = useMemo(() => {
    if (!chartData || chartData.length === 0) return 100;
    const values = chartData.map((item) => {
      if (metricView === "revenue") return item.revenue || 0;
      if (metricView === "profit") return Math.max(0, item.profit || 0);
      return item.orders || 0;
    });
    const max = Math.max(...values, 10);
    return max;
  }, [chartData, metricView]);

  // Filtered recent orders
  const filteredOrders = useMemo(() => {
    const list = data?.recentOrders || [];
    if (!orderSearch.trim()) return list;
    const q = orderSearch.trim().toLowerCase();
    return list.filter(
      (order) =>
        order?.orderId?.toLowerCase().includes(q) ||
        order?.userId?.name?.toLowerCase().includes(q) ||
        order?.userId?.email?.toLowerCase().includes(q) ||
        order?.product_details?.name?.toLowerCase().includes(q)
    );
  }, [data?.recentOrders, orderSearch]);

  if (loading && !data?.monthlySales?.length) {
    return <AnalyticsDashboardSkeleton />;
  }

  return (
    <div className="space-y-6 p-1 pb-10">
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl text-white shadow-xl shadow-blue-900/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-200 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Executive Store Intelligence & Profit Engine
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Business Performance, Revenue & Profit
          </h1>
          <p className="text-blue-100/80 text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
            Monitor real-time gross revenue, net profit margins, cost of goods sold (COGS), and inventory valuation.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-sm active:scale-95"
            title="Download CSV for Excel / Bookkeeping"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export Report</span>
          </button>

          <button
            type="button"
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            <span>{refreshing ? "Syncing..." : "Sync Live"}</span>
          </button>

          <Link
            to="/dashboard/upload-product"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-900 font-bold text-sm hover:bg-blue-50 transition-all shadow-md active:scale-95"
          >
            <Plus size={17} />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* 2. Top-Level Executive KPI Cards (Row 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Revenue & MoM Growth */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Total Gross Revenue
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
            {DisplayPriceInBDT(summary.totalRevenue || 0)}
          </div>
          <div className="flex items-center justify-between gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100 flex-wrap">
            <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-md">
              Today: {DisplayPriceInBDT(summary.todayRevenue || 0)}
            </span>
            {summary.momGrowthPercent !== 0 && (
              <span
                className={`font-bold flex items-center gap-0.5 ${
                  summary.momGrowthPercent >= 0 ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {summary.momGrowthPercent >= 0 ? (
                  <TrendingUp size={13} />
                ) : (
                  <TrendingDown size={13} />
                )}
                {summary.momGrowthPercent >= 0 ? `+${summary.momGrowthPercent}%` : `${summary.momGrowthPercent}%`} MoM
              </span>
            )}
          </div>
        </div>

        {/* Total Orders & Velocity */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Total Orders
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
              <ShoppingBag size={20} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
            {summary.totalOrders || 0}
            <span className="text-sm font-semibold text-gray-500 ml-1.5">orders</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100 flex-wrap">
            <span className="text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-md">
              Today: {summary.todayOrdersCount || 0}
            </span>
            <span>Month: {summary.thisMonthOrdersCount || 0}</span>
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Avg Order Value (AOV)
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-xs">
              <CreditCard size={20} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
            {DisplayPriceInBDT(summary.averageOrderValue || 0)}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
            <span className="text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-md">
              {summary.totalItemsSold || 0} units sold
            </span>
            <span>Total Units</span>
          </div>
        </div>

        {/* Customer Base & Repeat Loyalty */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Repeat Buyer Rate
            </span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-xs">
              <UserCheck size={20} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
            {summary.repeatCustomerRate || 0}%
            <span className="text-xs font-semibold text-gray-400 ml-1.5">loyalty</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
            <span className="text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded-md">
              {summary.repeatBuyersCount || 0} loyal buyers
            </span>
            <span>of {summary.totalBuyersCount || 0}</span>
          </div>
        </div>
      </div>

      {/* 3. DEDICATED PROFIT & LOSS ENGINE (FINANCIAL HEALTH) */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30">
              <Coins size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Financial Profit & Loss Overview
                </h2>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    pnl.isNetProfit
                      ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
                      : "bg-red-400/20 text-red-300 border border-red-400/30"
                  }`}
                >
                  {pnl.isNetProfit ? "PROFITABLE STORE" : "LOSS DETECTED"}
                </span>
              </div>
              <p className="text-emerald-100/70 text-xs sm:text-sm">
                Net Profit = Gross Revenue - Cost of Goods Sold (COGS)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/10 text-emerald-200 border border-white/10">
              Profit Margin: {pnl.netProfitMargin || 0}%
            </span>
          </div>
        </div>

        {/* 4 Financial Sub-Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Net Gross Profit */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4.5 border border-white/10">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block mb-1">
              Total Net Profit
            </span>
            <div
              className={`text-2xl sm:text-3xl font-extrabold ${
                pnl.totalGrossProfit >= 0 ? "text-emerald-300" : "text-rose-400"
              }`}
            >
              {DisplayPriceInBDT(pnl.totalGrossProfit || 0)}
            </div>
            <p className="text-[11px] text-white/70 mt-1">
              Today: {DisplayPriceInBDT(pnl.todayGrossProfit || 0)} • Month: {DisplayPriceInBDT(pnl.thisMonthGrossProfit || 0)}
            </p>
          </div>

          {/* Profit Margin */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4.5 border border-white/10">
            <span className="text-xs font-bold text-teal-300 uppercase tracking-wider block mb-1">
              Net Profit Margin
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {pnl.netProfitMargin || 0}%
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full mt-2 overflow-hidden">
              <div
                style={{ width: `${Math.min(pnl.netProfitMargin || 0, 100)}%` }}
                className="h-full bg-emerald-400 rounded-full"
              ></div>
            </div>
          </div>

          {/* Cost of Goods Sold (COGS) */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4.5 border border-white/10">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-1">
              Cost of Goods Sold (COGS)
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {DisplayPriceInBDT(pnl.totalCOGS || 0)}
            </div>
            <p className="text-[11px] text-white/70 mt-1">
              Wholesale sourcing cost of all sold products
            </p>
          </div>

          {/* Discounts Given */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4.5 border border-white/10">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block mb-1">
              Total Discounts Given
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {DisplayPriceInBDT(pnl.totalDiscountGiven || 0)}
            </div>
            <p className="text-[11px] text-white/70 mt-1">
              Total promo savings passed to customers
            </p>
          </div>
        </div>
      </div>

      {/* 4. Operational Health (Row 3: Inventory Capital & Monthly Pace) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {/* Inventory Capital Valuation */}
        <div className="bg-gradient-to-br from-emerald-50/70 to-white rounded-2xl p-5 border border-emerald-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
              <Package size={14} /> Inventory Capital Valuation
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-gray-900">
              {DisplayPriceInBDT(summary.totalStockValue || 0)}
            </div>
            <p className="text-xs text-gray-500">
              Total warehouse asset value across {summary.totalUnitsInWarehouse || 0} units ({summary.totalProducts || 0} catalog products)
            </p>
          </div>
        </div>

        {/* Month-over-Month Health & Pace */}
        <div className="bg-gradient-to-br from-blue-50/70 to-white rounded-2xl p-5 border border-blue-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
              <Sparkles size={14} /> Monthly Pace & Growth
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-gray-900">
              {DisplayPriceInBDT(summary.thisMonthRevenue || 0)}
            </div>
            <p className="text-xs text-gray-500">
              Last month: {DisplayPriceInBDT(summary.lastMonthRevenue || 0)} ({summary.momGrowthPercent >= 0 ? `+${summary.momGrowthPercent}%` : `${summary.momGrowthPercent}%`} growth) • Yesterday: {DisplayPriceInBDT(summary.yesterdayRevenue || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* 5. Sales & Profit Interactive Trendline Chart */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Performance Curve (Revenue, Profit & Orders)
              </h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                Visual Analytics
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Compare sales velocity, monthly net profits, and transaction volume
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Range Toggle: 12-Month vs 14-Day */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setChartView("monthly")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  chartView === "monthly"
                    ? "bg-white text-gray-900 shadow-2xs font-bold"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                12 Months
              </button>
              <button
                type="button"
                onClick={() => setChartView("daily")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  chartView === "daily"
                    ? "bg-white text-gray-900 shadow-2xs font-bold"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Last 14 Days
              </button>
            </div>

            {/* Metric Toggle: Revenue vs Profit vs Orders */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMetricView("revenue")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  metricView === "revenue"
                    ? "bg-blue-600 text-white shadow-2xs font-bold"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Revenue (৳)
              </button>
              <button
                type="button"
                onClick={() => setMetricView("profit")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  metricView === "profit"
                    ? "bg-emerald-600 text-white shadow-2xs font-bold"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Net Profit (৳)
              </button>
              <button
                type="button"
                onClick={() => setMetricView("orders")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  metricView === "orders"
                    ? "bg-indigo-600 text-white shadow-2xs font-bold"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Orders
              </button>
            </div>
          </div>
        </div>

        {/* Visual Bar Graph */}
        <div className="pt-2">
          {chartData.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm">
              No sales recorded for this period yet.
            </div>
          ) : (
            <div className="space-y-2">
              {/* Bars container */}
              <div className="grid grid-flow-col auto-cols-fr gap-2 sm:gap-3 items-end h-64 sm:h-72 px-2 pt-6 pb-2 border-b border-gray-200">
                {chartData.map((item, idx) => {
                  const val =
                    metricView === "revenue"
                      ? item.revenue || 0
                      : metricView === "profit"
                      ? Math.max(0, item.profit || 0)
                      : item.orders || 0;

                  const heightPercent = Math.max(
                    Math.round((val / maxChartValue) * 100),
                    val > 0 ? 8 : 2
                  );
                  const isCurrent = idx === chartData.length - 1;

                  return (
                    <div
                      key={idx}
                      className="h-full flex flex-col items-center justify-end group relative"
                    >
                      {/* Hover Tooltip */}
                      <div className="absolute -top-12 z-20 hidden group-hover:flex flex-col items-center pointer-events-none">
                        <div className="bg-gray-900 text-white text-xs py-1 px-2.5 rounded-lg shadow-lg whitespace-nowrap">
                          <span className="font-bold">{item.label}</span>:{" "}
                          {metricView === "revenue"
                            ? DisplayPriceInBDT(item.revenue)
                            : metricView === "profit"
                            ? DisplayPriceInBDT(item.profit || 0)
                            : `${item.orders} orders`}
                        </div>
                        <div className="w-2 h-2 bg-gray-900 rotate-45 -mt-1"></div>
                      </div>

                      {/* Bar Pillar */}
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full max-w-[42px] rounded-t-lg transition-all duration-500 group-hover:opacity-90 ${
                          metricView === "profit"
                            ? isCurrent
                              ? "bg-gradient-to-t from-emerald-600 to-teal-500 shadow-sm shadow-emerald-300"
                              : val > 0
                              ? "bg-gradient-to-t from-emerald-300 to-emerald-500 group-hover:from-emerald-400 group-hover:to-emerald-600"
                              : "bg-gray-100"
                            : isCurrent
                            ? "bg-gradient-to-t from-blue-600 to-indigo-500 shadow-sm shadow-blue-300"
                            : val > 0
                            ? "bg-gradient-to-t from-blue-200 to-blue-400 group-hover:from-blue-300 group-hover:to-blue-500"
                            : "bg-gray-100"
                        }`}
                      ></div>
                    </div>
                  );
                })}
              </div>

              {/* Labels below bars */}
              <div className="grid grid-flow-col auto-cols-fr gap-2 sm:gap-3 px-2 text-center">
                {chartData.map((item, idx) => {
                  const isCurrent = idx === chartData.length - 1;
                  return (
                    <span
                      key={idx}
                      className={`text-[10px] sm:text-xs truncate ${
                        isCurrent
                          ? "font-bold text-blue-600"
                          : "text-gray-500 font-medium"
                      }`}
                      title={item.label}
                    >
                      {item.label}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 6. Deep Strategic Breakdown: Category Share & VIP Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Category Revenue Contribution */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <PieChart size={18} className="text-indigo-600" />
                <h3 className="font-bold text-gray-900 text-base">
                  Category Market Share & Revenue
                </h3>
              </div>
              <span className="text-xs text-gray-500">Product segments</span>
            </div>

            <div className="space-y-4">
              {data?.categorySales?.length === 0 ? (
                <p className="text-sm text-gray-400 py-6 text-center">
                  No category sales recorded yet.
                </p>
              ) : (
                data.categorySales.map((cat, idx) => {
                  const percent =
                    summary.totalRevenue > 0
                      ? Math.min(Math.round(((cat.revenue || 0) / summary.totalRevenue) * 100), 100)
                      : 0;

                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="font-semibold text-gray-800">
                          {cat.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">
                            {DisplayPriceInBDT(cat.revenue || 0)}
                          </span>
                          <span className="text-gray-500 font-normal">
                            ({cat.unitsSold} units, {percent}%)
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${percent}%` }}
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500"
                        ></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Identifies high-performing catalog segments</span>
            <Link to="/dashboard/category" className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
              <span>Manage Categories</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>

        {/* Top VIP Spenders (Customer Loyalty & LTV) */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Award size={18} className="text-amber-500" />
                <h3 className="font-bold text-gray-900 text-base">
                  Top VIP Customers (Customer LTV)
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                High Spenders
              </span>
            </div>

            <div className="space-y-3">
              {data?.topVipCustomers?.length === 0 ? (
                <div className="py-8 text-center space-y-1">
                  <Users size={24} className="text-gray-300 mx-auto" />
                  <p className="text-sm font-semibold text-gray-700">No VIP buyers recorded yet.</p>
                  <p className="text-xs text-gray-400">Customer lifetime value will appear here once purchases occur.</p>
                </div>
              ) : (
                data.topVipCustomers.map((vip, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center shrink-0">
                        #{idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-gray-900">
                          {vip.name}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {vip.email || vip.mobile} • {vip.ordersCount} orders
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-sm text-gray-900">
                        {DisplayPriceInBDT(vip.totalSpent || 0)}
                      </div>
                      <span className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider">
                        Lifetime Value
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Repeat Buyer Loyalty: {summary.repeatCustomerRate || 0}%</span>
            <span className="text-gray-400">Total Customer Accounts: {summary.totalCustomers || 0}</span>
          </div>
        </div>
      </div>

      {/* 7. Product Performance Leaderboard (Volume vs Profit) */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900 text-base sm:text-lg">
              Product Performance Leaderboard
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
              Analyze products by units sold or net profit earned
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setProductTab("volume")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  productTab === "volume"
                    ? "bg-white text-gray-900 shadow-2xs font-bold"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Top Units Sold
              </button>
              <button
                type="button"
                onClick={() => setProductTab("profit")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  productTab === "profit"
                    ? "bg-emerald-600 text-white shadow-2xs font-bold"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Highest Net Profit
              </button>
            </div>

            <Link
              to="/dashboard/product"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Catalog</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {((productTab === "volume" ? data?.topProducts : data?.mostProfitableProducts) || []).length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">
              No product sales data recorded yet.
            </p>
          ) : (
            ((productTab === "volume" ? data?.topProducts : data?.mostProfitableProducts) || []).map((prod, idx) => (
              <div
                key={idx}
                className="py-3 sm:py-3.5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center text-xs font-extrabold text-gray-400">
                    #{idx + 1}
                  </span>
                  <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-200 p-1 flex items-center justify-center shrink-0">
                    {prod.image?.[0] ? (
                      <img
                        src={prod.image[0]}
                        alt={prod.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Package size={18} className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 line-clamp-1">
                      {prod.name || "Product"}
                    </h4>
                    <span className="text-xs text-gray-500">
                      Total Revenue: {DisplayPriceInBDT(prod.totalRevenue || 0)}
                    </span>
                  </div>
                </div>

                <div className="text-right flex items-center gap-3">
                  {productTab === "profit" && (
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-emerald-700 block">
                        +{DisplayPriceInBDT(prod.netProfit || 0)}
                      </span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                        Net Profit
                      </span>
                    </div>
                  )}
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                    {prod.totalSold || 0} Sold
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 8. Live Recent Orders Table & Status Management */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900 text-base sm:text-lg">
              Live Customer Orders Feed
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
              Track customer checkouts, addresses, amounts, and manage order fulfillment
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Quick Search */}
            <div className="relative w-full sm:w-64">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by order ID or customer..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>

            {/* CSV Export Button */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold cursor-pointer transition-colors shrink-0"
              title="Export Orders Table to CSV"
            >
              <Download size={14} />
              <span className="hidden sm:inline">CSV</span>
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50/50">
                <th className="py-3 px-3">Order ID</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Product Item</th>
                <th className="py-3 px-3">Total Amount</th>
                <th className="py-3 px-3">Payment / Status</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    No matching orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isUpdating = updatingOrderId === order.orderId;
                  const isPaid =
                    order.payment_status?.toLowerCase()?.includes("paid") ||
                    order.payment_status?.toLowerCase()?.includes("complete");

                  return (
                    <tr
                      key={order._id}
                      className="hover:bg-blue-50/30 transition-colors"
                    >
                      {/* Order ID */}
                      <td className="py-3.5 px-3 font-mono font-bold text-blue-600 text-xs">
                        {order.orderId || order._id}
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-gray-900">
                          {order.userId?.name || "Guest Customer"}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          {order.userId?.email || order.userId?.mobile || "N/A"}
                        </div>
                      </td>

                      {/* Product Item */}
                      <td className="py-3.5 px-3">
                        <div className="font-medium text-gray-800 line-clamp-1 max-w-[200px]">
                          {order.product_details?.name || "Product Item"}
                        </div>
                        <span className="text-[11px] text-gray-400">
                          Qty: {order.quantity || 1}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-3 font-bold text-gray-900">
                        {DisplayPriceInBDT(order.totalAmt || 0)}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                            isPaid
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {isPaid ? (
                            <CheckCircle2 size={12} />
                          ) : (
                            <Clock size={12} />
                          )}
                          <span>{order.payment_status || "Pending"}</span>
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-3 text-gray-500 text-xs">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "N/A"}
                      </td>

                      {/* Update Status Dropdown */}
                      <td className="py-3.5 px-3 text-right">
                        <select
                          disabled={isUpdating}
                          value={order.payment_status || ""}
                          onChange={(e) =>
                            handleUpdateOrderStatus(order.orderId, e.target.value)
                          }
                          className="text-xs font-semibold px-2 py-1 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
                        >
                          <option value="Cash on Delivery">Cash on Delivery</option>
                          <option value="PAID">PAID</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboardPage;
