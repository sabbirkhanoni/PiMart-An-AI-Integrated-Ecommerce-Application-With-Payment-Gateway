import OrderModel from '../models/order.model.js';
import UserModel from '../models/user.model.js';
import ProductModel from '../models/product.model.js';
import CategoryModel from '../models/category.model.js';

// Get high-level business analytics overview for Admin
export const getAdminAnalyticsOverview = async (req, res) => {
  try {
    const now = new Date();

    // Start of Today (00:00:00)
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Start of Yesterday
    const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const endOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59, 999);

    // Start of This Month
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Start & End of Last Month
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    // 1. Overall Revenue & Orders
    const allTimeStats = await OrderModel.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmt" },
          totalItemsSold: { $sum: "$quantity" },
          uniqueOrders: { $addToSet: "$orderId" }
        }
      }
    ]);

    const totalRevenue = allTimeStats[0]?.totalRevenue || 0;
    const totalItemsSold = allTimeStats[0]?.totalItemsSold || 0;
    const totalOrders = allTimeStats[0]?.uniqueOrders?.length || 0;
    const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // 2. Today's Stats
    const todayStats = await OrderModel.aggregate([
      { $match: { createdAt: { $gte: startOfToday } } },
      {
        $group: {
          _id: null,
          todayRevenue: { $sum: "$totalAmt" },
          todayItemsSold: { $sum: "$quantity" },
          todayOrders: { $addToSet: "$orderId" }
        }
      }
    ]);

    const todayRevenue = todayStats[0]?.todayRevenue || 0;
    const todayOrdersCount = todayStats[0]?.todayOrders?.length || 0;

    // Yesterday's Revenue
    const yesterdayStats = await OrderModel.aggregate([
      { $match: { createdAt: { $gte: startOfYesterday, $lte: endOfYesterday } } },
      { $group: { _id: null, revenue: { $sum: "$totalAmt" } } }
    ]);
    const yesterdayRevenue = yesterdayStats[0]?.revenue || 0;

    // 3. This Month's Stats & MoM Comparison
    const thisMonthStats = await OrderModel.aggregate([
      { $match: { createdAt: { $gte: startOfThisMonth } } },
      {
        $group: {
          _id: null,
          thisMonthRevenue: { $sum: "$totalAmt" },
          thisMonthOrders: { $addToSet: "$orderId" }
        }
      }
    ]);

    const thisMonthRevenue = thisMonthStats[0]?.thisMonthRevenue || 0;
    const thisMonthOrdersCount = thisMonthStats[0]?.thisMonthOrders?.length || 0;

    const lastMonthStats = await OrderModel.aggregate([
      { $match: { createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
      { $group: { _id: null, revenue: { $sum: "$totalAmt" } } }
    ]);
    const lastMonthRevenue = lastMonthStats[0]?.revenue || 0;
    const momGrowthPercent = lastMonthRevenue > 0
      ? Number((((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1))
      : 0;

    // 4. Profit & Loss Engine (Gross Profit, COGS, Discounts)
    const profitPipeline = (matchStage = {}) => [
      ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product"
        }
      },
      {
        $addFields: {
          prod: { $arrayElemAt: ["$product", 0] }
        }
      },
      {
        $project: {
          totalAmt: 1,
          quantity: 1,
          subTotalAmt: 1,
          costPriceEffective: {
            $cond: {
              if: { $gt: ["$prod.costPrice", 0] },
              then: "$prod.costPrice",
              else: {
                $multiply: [
                  { $ifNull: ["$prod.price", "$subTotalAmt"] },
                  0.7
                ]
              }
            }
          },
          originalPriceEffective: {
            $ifNull: ["$prod.price", "$subTotalAmt"]
          }
        }
      },
      {
        $project: {
          totalAmt: 1,
          cogs: { $multiply: ["$costPriceEffective", "$quantity"] },
          discountGiven: {
            $max: [
              0,
              {
                $multiply: [
                  { $subtract: ["$originalPriceEffective", "$subTotalAmt"] },
                  "$quantity"
                ]
              }
            ]
          }
        }
      },
      {
        $project: {
          totalAmt: 1,
          cogs: 1,
          discountGiven: 1,
          itemProfit: { $subtract: ["$totalAmt", "$cogs"] }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmt" },
          totalCOGS: { $sum: "$cogs" },
          totalGrossProfit: { $sum: "$itemProfit" },
          totalDiscountGiven: { $sum: "$discountGiven" }
        }
      }
    ];

    const allTimeProfitAgg = await OrderModel.aggregate(profitPipeline());
    const todayProfitAgg = await OrderModel.aggregate(profitPipeline({ createdAt: { $gte: startOfToday } }));
    const thisMonthProfitAgg = await OrderModel.aggregate(profitPipeline({ createdAt: { $gte: startOfThisMonth } }));

    const totalGrossProfit = Math.round(allTimeProfitAgg[0]?.totalGrossProfit || 0);
    const totalCOGS = Math.round(allTimeProfitAgg[0]?.totalCOGS || 0);
    const totalDiscountGiven = Math.round(allTimeProfitAgg[0]?.totalDiscountGiven || 0);
    const todayGrossProfit = Math.round(todayProfitAgg[0]?.totalGrossProfit || 0);
    const thisMonthGrossProfit = Math.round(thisMonthProfitAgg[0]?.totalGrossProfit || 0);
    const netProfitMargin = totalRevenue > 0
      ? Number(((totalGrossProfit / totalRevenue) * 100).toFixed(1))
      : 0;

    const profitAndLoss = {
      totalGrossProfit,
      todayGrossProfit,
      thisMonthGrossProfit,
      totalCOGS,
      totalDiscountGiven,
      netProfitMargin,
      isNetProfit: totalGrossProfit >= 0
    };

    // 5. Customers & Retention / Repeat Buyers
    const totalCustomers = await UserModel.countDocuments({ role: "USER" });
    const newCustomersThisMonth = await UserModel.countDocuments({
      role: "USER",
      createdAt: { $gte: startOfThisMonth }
    });

    const customerOrderFreq = await OrderModel.aggregate([
      {
        $group: {
          _id: "$userId",
          orderIds: { $addToSet: "$orderId" },
          totalSpent: { $sum: "$totalAmt" }
        }
      },
      {
        $project: {
          ordersCount: { $size: "$orderIds" },
          totalSpent: 1
        }
      }
    ]);

    const totalBuyersCount = customerOrderFreq.length;
    const repeatBuyersCount = customerOrderFreq.filter(c => c.ordersCount > 1).length;
    const repeatCustomerRate = totalBuyersCount > 0
      ? Math.round((repeatBuyersCount / totalBuyersCount) * 100)
      : 0;

    // Top 5 VIP Customers
    const topVipCustomersRaw = [...customerOrderFreq]
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    const vipUserIds = topVipCustomersRaw.map(v => v._id).filter(Boolean);
    const vipUsers = await UserModel.find({ _id: { $in: vipUserIds } }).select("name email mobile avatar");

    const topVipCustomers = topVipCustomersRaw.map(vip => {
      const userObj = vipUsers.find(u => String(u._id) === String(vip._id));
      return {
        userId: vip._id,
        name: userObj?.name || "Customer",
        email: userObj?.email || "N/A",
        mobile: userObj?.mobile || "N/A",
        ordersCount: vip.ordersCount,
        totalSpent: Math.round(vip.totalSpent)
      };
    });

    // 6. Inventory Valuation & Health
    const totalProducts = await ProductModel.countDocuments();
    const totalCategories = await CategoryModel.countDocuments();
    const lowStockCount = await ProductModel.countDocuments({ stock: { $gt: 0, $lte: 5 } });
    const outOfStockCount = await ProductModel.countDocuments({ stock: { $lte: 0 } });

    const inventoryValuation = await ProductModel.aggregate([
      {
        $project: {
          itemVal: {
            $multiply: [
              { $ifNull: ["$stock", 0] },
              { $ifNull: ["$price", 0] }
            ]
          },
          stock: 1
        }
      },
      {
        $group: {
          _id: null,
          totalStockValue: { $sum: "$itemVal" },
          totalUnitsInWarehouse: { $sum: "$stock" }
        }
      }
    ]);
    const totalStockValue = Math.round(inventoryValuation[0]?.totalStockValue || 0);
    const totalUnitsInWarehouse = inventoryValuation[0]?.totalUnitsInWarehouse || 0;

    const lowStockAlerts = await ProductModel.find({ stock: { $lte: 5 } })
      .select("name image stock price unit")
      .sort({ stock: 1 })
      .limit(6);

    // 7. Category Revenue & Sales Contribution
    const categorySales = await OrderModel.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      { $unwind: "$product.category" },
      {
        $lookup: {
          from: "categories",
          localField: "product.category",
          foreignField: "_id",
          as: "categoryDoc"
        }
      },
      { $unwind: "$categoryDoc" },
      {
        $group: {
          _id: "$categoryDoc._id",
          name: { $first: "$categoryDoc.name" },
          revenue: { $sum: "$totalAmt" },
          unitsSold: { $sum: "$quantity" }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 6 }
    ]);

    // 8. Monthly Sales & Profit Trend (Last 12 Months)
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    const monthlyAgg = await OrderModel.aggregate([
      { $match: { createdAt: { $gte: twelveMonthsAgo } } },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product"
        }
      },
      {
        $addFields: {
          prod: { $arrayElemAt: ["$product", 0] }
        }
      },
      {
        $project: {
          totalAmt: 1,
          orderId: 1,
          createdAt: 1,
          cogs: {
            $multiply: [
              {
                $cond: {
                  if: { $gt: ["$prod.costPrice", 0] },
                  then: "$prod.costPrice",
                  else: { $multiply: [{ $ifNull: ["$prod.price", 0] }, 0.7] }
                }
              },
              "$quantity"
            ]
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          revenue: { $sum: "$totalAmt" },
          cogs: { $sum: "$cogs" },
          orderSet: { $addToSet: "$orderId" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlySales = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const matched = monthlyAgg.find(item => item._id.year === y && item._id.month === m);
      const rev = matched ? Math.round(matched.revenue) : 0;
      const cogs = matched ? Math.round(matched.cogs) : 0;
      const profit = rev - cogs;

      monthlySales.push({
        label: `${monthNames[m - 1]} '${String(y).slice(-2)}`,
        year: y,
        month: m,
        revenue: rev,
        profit: profit,
        orders: matched ? matched.orderSet.length : 0
      });
    }

    // 9. Daily Sales Trend (Last 14 Days)
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    fourteenDaysAgo.setHours(0, 0, 0, 0);

    const dailyAgg = await OrderModel.aggregate([
      { $match: { createdAt: { $gte: fourteenDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          revenue: { $sum: "$totalAmt" },
          orders: { $addToSet: "$orderId" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const dailySales = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split("T")[0];
      const matched = dailyAgg.find(item => item._id === dateStr);
      dailySales.push({
        date: dateStr,
        label: `${d.getDate()} ${monthNames[d.getMonth()]}`,
        revenue: matched ? Math.round(matched.revenue) : 0,
        orders: matched ? matched.orders.length : 0
      });
    }

    // 10. Payment Breakdown & Status Funnel
    const paymentMethodsAgg = await OrderModel.aggregate([
      {
        $group: {
          _id: "$payment_status",
          revenue: { $sum: "$totalAmt" },
          count: { $sum: 1 }
        }
      }
    ]);

    // 11. Most Profitable Products
    const mostProfitableProducts = await OrderModel.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product"
        }
      },
      { $addFields: { prod: { $arrayElemAt: ["$product", 0] } } },
      {
        $project: {
          name: "$product_details.name",
          image: "$product_details.image",
          quantity: 1,
          totalAmt: 1,
          cogs: {
            $multiply: [
              {
                $cond: {
                  if: { $gt: ["$prod.costPrice", 0] },
                  then: "$prod.costPrice",
                  else: { $multiply: [{ $ifNull: ["$prod.price", 0] }, 0.7] }
                }
              },
              "$quantity"
            ]
          }
        }
      },
      {
        $project: {
          name: 1,
          image: 1,
          quantity: 1,
          totalAmt: 1,
          profit: { $subtract: ["$totalAmt", "$cogs"] }
        }
      },
      {
        $group: {
          _id: "$name",
          name: { $first: "$name" },
          image: { $first: "$image" },
          totalSold: { $sum: "$quantity" },
          totalRevenue: { $sum: "$totalAmt" },
          netProfit: { $sum: "$profit" }
        }
      },
      { $sort: { netProfit: -1 } },
      { $limit: 5 }
    ]);

    // 12. Top Selling Products (by Volume)
    const topProducts = await OrderModel.aggregate([
      {
        $group: {
          _id: "$productId",
          name: { $first: "$product_details.name" },
          image: { $first: "$product_details.image" },
          totalSold: { $sum: "$quantity" },
          totalRevenue: { $sum: "$totalAmt" }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 6 }
    ]);

    // 13. Recent Orders (Latest 10 items)
    const recentOrders = await OrderModel.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("userId", "name email mobile")
      .populate("delivery_address");

    return res.status(200).json({
      success: true,
      error: false,
      message: "Admin Analytics Overview fetched successfully",
      data: {
        summary: {
          totalRevenue,
          todayRevenue,
          yesterdayRevenue,
          thisMonthRevenue,
          lastMonthRevenue,
          momGrowthPercent,
          totalOrders,
          todayOrdersCount,
          thisMonthOrdersCount,
          averageOrderValue,
          totalItemsSold,
          totalCustomers,
          newCustomersThisMonth,
          totalBuyersCount,
          repeatBuyersCount,
          repeatCustomerRate,
          totalProducts,
          totalCategories,
          lowStockCount,
          outOfStockCount,
          totalStockValue,
          totalUnitsInWarehouse
        },
        profitAndLoss,
        mostProfitableProducts,
        topVipCustomers,
        categorySales,
        monthlySales,
        dailySales,
        paymentMethods: paymentMethodsAgg,
        topProducts,
        lowStockAlerts,
        recentOrders
      }
    });

  } catch (error) {
    console.error("Error in getAdminAnalyticsOverview:", error);
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || "Failed to fetch analytics"
    });
  }
};

// Get all orders for Admin with filters, pagination and search
export const getAllOrdersForAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", status = "" } = req.query;
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 20;
    const skip = (pageNum - 1) * limitNum;

    const filter = {};

    if (status) {
      filter.payment_status = status;
    }

    if (search) {
      filter.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { "product_details.name": { $regex: search, $options: "i" } }
      ];
    }

    const totalOrdersCount = await OrderModel.countDocuments(filter);

    const orders = await OrderModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate("userId", "name email mobile")
      .populate("delivery_address");

    return res.status(200).json({
      success: true,
      error: false,
      message: "All orders retrieved successfully",
      data: orders,
      pagination: {
        total: totalOrdersCount,
        page: pageNum,
        totalPages: Math.ceil(totalOrdersCount / limitNum),
        limit: limitNum
      }
    });

  } catch (error) {
    console.error("Error in getAllOrdersForAdmin:", error);
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || "Failed to fetch orders"
    });
  }
};

// Update order status (payment status / fulfillment)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, payment_status } = req.body;

    if (!orderId || !payment_status) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "orderId and payment_status are required"
      });
    }

    const updated = await OrderModel.updateMany(
      { orderId: orderId },
      { $set: { payment_status: payment_status } }
    );

    return res.status(200).json({
      success: true,
      error: false,
      message: `Order ${orderId} updated to ${payment_status}`,
      data: updated
    });
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || "Failed to update order status"
    });
  }
};
