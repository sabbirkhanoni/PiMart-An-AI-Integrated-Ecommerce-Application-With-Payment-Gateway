import ReviewModel from "../models/review.model.js";
import ProductModel from "../models/product.model.js";
import OrderModel from "../models/order.model.js";
import mongoose from "mongoose";

// Create or update a customer product review
export const createOrUpdateReviewController = async (request, response) => {
  try {
    const userId = request.userId;
    const { productId, rating, title, comment, images } = request.body;

    if (!productId || !rating || !comment) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "Product ID, rating (1-5), and review comment are required.",
      });
    }

    const numericRating = Number(rating);
    if (numericRating < 1 || numericRating > 5) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "Rating must be between 1 and 5 stars.",
      });
    }

    // Check if user has purchased this product to grant "Verified Buyer" badge
    const hasPurchased = await OrderModel.findOne({
      userId: userId,
      productId: productId,
      delivery_status: { $ne: "Cancelled" },
    });

    const isVerifiedPurchase = Boolean(hasPurchased);

    // Upsert review (allows user to update their review if they already reviewed)
    const review = await ReviewModel.findOneAndUpdate(
      { userId, productId },
      {
        userId,
        productId,
        rating: numericRating,
        title: title ? title.trim() : "",
        comment: comment.trim(),
        images: Array.isArray(images) ? images : [],
        isVerifiedPurchase,
      },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );

    // Recalculate average rating & total reviews on ProductModel
    const ratingStats = await ReviewModel.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: "$productId",
          avgRating: { $avg: "$rating" },
          total: { $sum: 1 },
        },
      },
    ]);

    const averageRating = ratingStats[0]
      ? Number(ratingStats[0].avgRating.toFixed(1))
      : numericRating;
    const totalReviews = ratingStats[0] ? ratingStats[0].total : 1;

    await ProductModel.findByIdAndUpdate(productId, {
      averageRating,
      totalReviews,
    });

    // Populate user info for immediate display
    const populatedReview = await ReviewModel.findById(review._id).populate(
      "userId",
      "name avatar email"
    );

    return response.status(200).json({
      success: true,
      error: false,
      message: "Review submitted successfully!",
      data: populatedReview,
      productStats: {
        averageRating,
        totalReviews,
      },
    });
  } catch (error) {
    console.error("Error in createOrUpdateReviewController:", error);
    return response.status(500).json({
      success: false,
      error: true,
      message: error.message || error || "Failed to submit review.",
    });
  }
};

// Get reviews for a specific product with filters and rating breakdown
export const getProductReviewsController = async (request, response) => {
  try {
    const { productId } = request.params;
    const {
      page = 1,
      limit = 10,
      rating = "all",
      sortBy = "newest",
    } = request.query;

    if (!productId) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "Product ID is required.",
      });
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 10);
    const skip = (pageNum - 1) * limitNum;

    const filter = {
      productId: new mongoose.Types.ObjectId(productId),
      status: "approved",
    };

    if (rating && rating !== "all") {
      filter.rating = Number(rating);
    }

    // Sort order
    let sortOptions = { createdAt: -1 };
    if (sortBy === "highest") sortOptions = { rating: -1, createdAt: -1 };
    if (sortBy === "lowest") sortOptions = { rating: 1, createdAt: -1 };
    if (sortBy === "helpful") sortOptions = { "likes.length": -1, createdAt: -1 };

    // 1. Fetch rating breakdown & average
    const breakdownAgg = await ReviewModel.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
    ]);

    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalScore = 0;
    let allReviewsCount = 0;

    breakdownAgg.forEach((item) => {
      if (breakdown[item._id] !== undefined) {
        breakdown[item._id] = item.count;
      }
      totalScore += item._id * item.count;
      allReviewsCount += item.count;
    });

    const averageRating =
      allReviewsCount > 0 ? Number((totalScore / allReviewsCount).toFixed(1)) : 0;

    // 2. Count matched reviews
    const matchedCount = await ReviewModel.countDocuments(filter);

    // 3. Query reviews
    const reviews = await ReviewModel.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .populate("userId", "name avatar email");

    return response.status(200).json({
      success: true,
      error: false,
      message: "Product reviews retrieved successfully.",
      data: reviews,
      stats: {
        averageRating,
        totalReviews: allReviewsCount,
        breakdown,
      },
      pagination: {
        total: matchedCount,
        page: pageNum,
        totalPages: Math.ceil(matchedCount / limitNum) || 1,
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error("Error in getProductReviewsController:", error);
    return response.status(500).json({
      success: false,
      error: true,
      message: error.message || error || "Failed to retrieve reviews.",
    });
  }
};

// Delete review (by owner or admin)
export const deleteReviewController = async (request, response) => {
  try {
    const userId = request.userId;
    const { reviewId } = request.params;

    if (!reviewId) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "Review ID is required.",
      });
    }

    const review = await ReviewModel.findById(reviewId);
    if (!review) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Review not found.",
      });
    }

    // Check ownership
    if (review.userId.toString() !== userId.toString()) {
      return response.status(403).json({
        success: false,
        error: true,
        message: "You can only delete your own reviews.",
      });
    }

    const productId = review.productId;
    await ReviewModel.findByIdAndDelete(reviewId);

    // Recalculate average rating & total reviews
    const ratingStats = await ReviewModel.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: "$productId",
          avgRating: { $avg: "$rating" },
          total: { $sum: 1 },
        },
      },
    ]);

    const averageRating = ratingStats[0]
      ? Number(ratingStats[0].avgRating.toFixed(1))
      : 0;
    const totalReviews = ratingStats[0] ? ratingStats[0].total : 0;

    await ProductModel.findByIdAndUpdate(productId, {
      averageRating,
      totalReviews,
    });

    return response.status(200).json({
      success: true,
      error: false,
      message: "Review deleted successfully.",
      productStats: {
        averageRating,
        totalReviews,
      },
    });
  } catch (error) {
    console.error("Error in deleteReviewController:", error);
    return response.status(500).json({
      success: false,
      error: true,
      message: error.message || error || "Failed to delete review.",
    });
  }
};

// Toggle like / helpful upvote on a review
export const toggleLikeReviewController = async (request, response) => {
  try {
    const userId = request.userId;
    const { reviewId } = request.params;

    const review = await ReviewModel.findById(reviewId);
    if (!review) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Review not found.",
      });
    }

    const alreadyLiked = review.likes.some(
      (id) => id.toString() === userId.toString()
    );

    let updatedReview;
    if (alreadyLiked) {
      updatedReview = await ReviewModel.findByIdAndUpdate(
        reviewId,
        { $pull: { likes: userId } },
        { new: true }
      );
    } else {
      updatedReview = await ReviewModel.findByIdAndUpdate(
        reviewId,
        { $addToSet: { likes: userId } },
        { new: true }
      );
    }

    return response.status(200).json({
      success: true,
      error: false,
      message: alreadyLiked ? "Review unliked" : "Marked as helpful!",
      likesCount: updatedReview.likes.length,
      isLiked: !alreadyLiked,
    });
  } catch (error) {
    console.error("Error in toggleLikeReviewController:", error);
    return response.status(500).json({
      success: false,
      error: true,
      message: error.message || error || "Failed to toggle like.",
    });
  }
};
