import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique product per user in wishlist
wishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });

const WishlistModel = mongoose.model("wishlist", wishlistSchema);

export default WishlistModel;
