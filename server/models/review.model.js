import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "product",
      required: [true, "Product ID is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot be more than 5"],
    },
    title: {
      type: String,
      default: "",
    },
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["approved", "flagged"],
      default: "approved",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique review per user per product
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

const ReviewModel = mongoose.model("review", reviewSchema);

export default ReviewModel;
