import WishlistModel from "../models/wishlist.model.js";

// Toggle add / remove item in user's wishlist
export const toggleWishlistController = async (request, response) => {
  try {
    const userId = request.userId;
    const { productId } = request.body;

    if (!productId) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "Product ID is required.",
      });
    }

    const existingWishlistItem = await WishlistModel.findOne({
      userId,
      productId,
    });

    if (existingWishlistItem) {
      await WishlistModel.findByIdAndDelete(existingWishlistItem._id);

      return response.status(200).json({
        success: true,
        error: false,
        isAdded: false,
        message: "Item removed from your Wishlist.",
      });
    }

    const newWishlistItem = await WishlistModel.create({
      userId,
      productId,
    });

    const populatedItem = await WishlistModel.findById(newWishlistItem._id).populate({
      path: "productId",
      select: "name image price discount unit stock category subCategory description",
    });

    return response.status(200).json({
      success: true,
      error: false,
      isAdded: true,
      message: "Item added to your Wishlist!",
      data: populatedItem,
    });
  } catch (error) {
    console.error("Error in toggleWishlistController:", error);
    return response.status(500).json({
      success: false,
      error: true,
      message: error.message || error || "Failed to update wishlist.",
    });
  }
};

// Get all wishlist products for current logged in user
export const getWishlistItemsController = async (request, response) => {
  try {
    const userId = request.userId;

    const wishlistCollection = await WishlistModel.find({ userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "productId",
        select: "name image price discount unit stock category subCategory description",
      });

    // Filter out items where the product might have been deleted from catalog
    const validItems = wishlistCollection.filter((item) => Boolean(item.productId));

    return response.status(200).json({
      success: true,
      error: false,
      message: "Wishlist items fetched successfully.",
      data: validItems,
      count: validItems.length,
    });
  } catch (error) {
    console.error("Error in getWishlistItemsController:", error);
    return response.status(500).json({
      success: false,
      error: true,
      message: error.message || error || "Failed to fetch wishlist items.",
    });
  }
};

// Quick check if a specific product is in user's wishlist
export const checkInWishlistController = async (request, response) => {
  try {
    const userId = request.userId;
    const { productId } = request.params;

    if (!productId) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "Product ID is required.",
      });
    }

    const exists = await WishlistModel.exists({ userId, productId });

    return response.status(200).json({
      success: true,
      error: false,
      inWishlist: Boolean(exists),
    });
  } catch (error) {
    console.error("Error in checkInWishlistController:", error);
    return response.status(500).json({
      success: false,
      error: true,
      message: error.message || error || "Failed to check wishlist status.",
    });
  }
};
