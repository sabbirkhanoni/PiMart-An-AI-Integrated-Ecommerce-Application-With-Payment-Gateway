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

// Get all orders for Admin with grouping, filters, pagination and search
export const getAllOrdersForAdmin = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      search = "", 
      delivery_status = "All", 
      payment_status = "All" 
    } = req.query;

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 12);
    const skip = (pageNum - 1) * limitNum;

    // Base grouping pipeline
    const basePipeline = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "customer"
        }
      },
      { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "addresses",
          localField: "delivery_address",
          foreignField: "_id",
          as: "address"
        }
      },
      { $unwind: { path: "$address", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$orderId",
          orderId: { $first: "$orderId" },
          userId: { $first: "$userId" },
          customer: {
            $first: {
              _id: "$customer._id",
              name: "$customer.name",
              email: "$customer.email",
              mobile: "$customer.mobile"
            }
          },
          delivery_address: { $first: "$address" },
          paymentId: { $first: "$paymentId" },
          payment_status: { $first: "$payment_status" },
          delivery_status: { $first: { $ifNull: ["$delivery_status", "Pending"] } },
          statusHistory: { $first: "$statusHistory" },
          invoice_receipt: { $first: "$invoice_receipt" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          totalAmount: { $sum: "$totalAmt" },
          totalItems: { $sum: "$quantity" },
          items: {
            $push: {
              _id: "$_id",
              productId: "$productId",
              product_details: "$product_details",
              quantity: "$quantity",
              subTotalAmt: "$subTotalAmt",
              totalAmt: "$totalAmt"
            }
          }
        }
      }
    ];

    // Status Counts Aggregation (for tab badges across all orders)
    const countsAggregation = await OrderModel.aggregate([
      {
        $group: {
          _id: "$orderId",
          delivery_status: { $first: { $ifNull: ["$delivery_status", "Pending"] } }
        }
      },
      {
        $group: {
          _id: "$delivery_status",
          count: { $sum: 1 }
        }
      }
    ]);

    const counts = {
      All: 0,
      Pending: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0
    };

    countsAggregation.forEach((item) => {
      if (counts[item._id] !== undefined) {
        counts[item._id] = item.count;
      }
      counts.All += item.count;
    });

    // Build filter matching stage
    const matchStage = {};

    if (delivery_status && delivery_status !== "All") {
      matchStage.delivery_status = delivery_status;
    }

    if (payment_status && payment_status !== "All") {
      matchStage.payment_status = payment_status;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      matchStage.$or = [
        { orderId: searchRegex },
        { "customer.name": searchRegex },
        { "customer.email": searchRegex },
        { "customer.mobile": searchRegex },
        { "items.product_details.name": searchRegex }
      ];
    }

    const filteredPipeline = [...basePipeline];
    if (Object.keys(matchStage).length > 0) {
      filteredPipeline.push({ $match: matchStage });
    }

    // Count total matched unique orders
    const countResult = await OrderModel.aggregate([
      ...filteredPipeline,
      { $count: "total" }
    ]);
    const totalOrdersCount = countResult[0]?.total || 0;

    // Apply sorting and pagination
    filteredPipeline.push({ $sort: { createdAt: -1 } });
    filteredPipeline.push({ $skip: skip });
    filteredPipeline.push({ $limit: limitNum });

    const orders = await OrderModel.aggregate(filteredPipeline);

    return res.status(200).json({
      success: true,
      error: false,
      message: "Admin orders retrieved successfully",
      data: orders,
      counts,
      pagination: {
        total: totalOrdersCount,
        page: pageNum,
        totalPages: Math.ceil(totalOrdersCount / limitNum) || 1,
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

// Update order status (delivery fulfillment / payment status) with inventory adjustment
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, delivery_status, payment_status, note } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "orderId is required"
      });
    }

    const existingOrders = await OrderModel.find({ orderId: orderId });
    if (!existingOrders || existingOrders.length === 0) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Order not found"
      });
    }

    const oldDeliveryStatus = existingOrders[0].delivery_status || 'Pending';
    const updateFields = {};

    if (delivery_status) {
      updateFields.delivery_status = delivery_status;

      // If transitioning to Cancelled, restore stock
      if (delivery_status === 'Cancelled' && oldDeliveryStatus !== 'Cancelled') {
        for (const item of existingOrders) {
          const prodId = item?.productId?._id || item?.productId;
          const qty = Number(item?.quantity) || 1;
          if (prodId) {
            await ProductModel.updateOne(
              { _id: prodId },
              { $inc: { stock: qty } }
            );
          }
        }
      }

      // If transitioning from Cancelled back to an active state, re-deduct stock
      if (oldDeliveryStatus === 'Cancelled' && delivery_status !== 'Cancelled') {
        for (const item of existingOrders) {
          const prodId = item?.productId?._id || item?.productId;
          const qty = Number(item?.quantity) || 1;
          if (prodId) {
            await ProductModel.updateOne(
              { _id: prodId },
              { $inc: { stock: -qty } }
            );
          }
        }
      }
    }

    if (payment_status) {
      updateFields.payment_status = payment_status;
    }

    const statusNote = note?.trim() 
      ? note.trim() 
      : `Status changed to ${delivery_status || payment_status} by Admin`;

    const statusHistoryEntry = {
      status: delivery_status || oldDeliveryStatus,
      timestamp: new Date(),
      note: statusNote
    };

    await OrderModel.updateMany(
      { orderId: orderId },
      { 
        $set: updateFields,
        $push: { statusHistory: statusHistoryEntry }
      }
    );

    return res.status(200).json({
      success: true,
      error: false,
      message: `Order ${orderId} status successfully updated to ${delivery_status || payment_status}.`,
      data: {
        orderId,
        delivery_status: delivery_status || oldDeliveryStatus,
        payment_status: payment_status || existingOrders[0].payment_status
      }
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
