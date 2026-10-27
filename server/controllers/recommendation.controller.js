import ProductModel from "../models/product.model.js";
import OrderModel from "../models/order.model.js";
import CartProductModel from "../models/cartproduct.model.js";
import WishlistModel from "../models/wishlist.model.js";

export const getPersonalizedRecommendationsController = async (request, response) => {
  try {
    const userId = request.userId; // optional auth from token if available
    let preferredCategories = new Set();
    let preferredSubCategories = new Set();
    let isPersonalized = false;

    if (userId) {
      // 1. Gather product IDs from User's Orders, Cart, and Wishlist
      const [userOrders, userCart, userWishlist] = await Promise.all([
        OrderModel.find({ userId }).select("productId").limit(20),
        CartProductModel.find({ userId }).select("productId").limit(20),
        WishlistModel.find({ userId }).select("productId").limit(20),
      ]);

      const productIds = [
        ...userOrders.map((o) => o.productId).filter(Boolean),
        ...userCart.map((c) => c.productId).filter(Boolean),
        ...userWishlist.map((w) => w.productId).filter(Boolean),
      ];

      if (productIds.length > 0) {
        // Fetch categories and subcategories of these products
        const interactedProducts = await ProductModel.find({
          _id: { $in: productIds },
        }).select("category subCategory");

        interactedProducts.forEach((prod) => {
          if (prod.category && Array.isArray(prod.category)) {
            prod.category.forEach((catId) => preferredCategories.add(String(catId)));
          }
          if (prod.subCategory && Array.isArray(prod.subCategory)) {
            prod.subCategory.forEach((subId) => preferredSubCategories.add(String(subId)));
          }
        });

        if (preferredCategories.size > 0 || preferredSubCategories.size > 0) {
          isPersonalized = true;
        }
      }
    }

    let recommendedProducts = [];

    if (isPersonalized) {
      // Find products matching preferred categories or subcategories, prioritizing high-rated and in-stock
      const categoryArray = Array.from(preferredCategories);
      const subCategoryArray = Array.from(preferredSubCategories);

      recommendedProducts = await ProductModel.find({
        stock: { $gt: 0 },
        $or: [
          { category: { $in: categoryArray } },
          { subCategory: { $in: subCategoryArray } },
        ],
      })
        .sort({ averageRating: -1, discount: -1, createdAt: -1 })
        .limit(16)
        .populate("category subCategory");
    }

    // Fallback if not enough personalized products or guest user
    if (recommendedProducts.length < 8) {
      const existingIds = recommendedProducts.map((p) => p._id);
      const fallbackProducts = await ProductModel.find({
        _id: { $nin: existingIds },
        stock: { $gt: 0 },
      })
        .sort({ averageRating: -1, discount: -1, totalReviews: -1 })
        .limit(16 - recommendedProducts.length)
        .populate("category subCategory");

      recommendedProducts = [...recommendedProducts, ...fallbackProducts];
    }

    return response.status(200).json({
      message: "Personalized recommendations retrieved successfully.",
      error: false,
      success: true,
      isPersonalized: isPersonalized,
      badge: isPersonalized ? "Recommended For You" : "Trending & High Rated",
      data: recommendedProducts,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getRelatedProductsController = async (request, response) => {
  try {
    const { productId } = request.params;

    if (!productId) {
      return response.status(400).json({
        message: "Product ID is required.",
        error: true,
        success: false,
      });
    }

    const currentProduct = await ProductModel.findById(productId);
    if (!currentProduct) {
      return response.status(404).json({
        message: "Product not found.",
        error: true,
        success: false,
      });
    }

    const query = {
      _id: { $ne: currentProduct._id },
      stock: { $gt: 0 },
      $or: [
        { category: { $in: currentProduct.category || [] } },
        { subCategory: { $in: currentProduct.subCategory || [] } },
      ],
    };

    const related = await ProductModel.find(query)
      .sort({ averageRating: -1, discount: -1 })
      .limit(8)
      .populate("category subCategory");

    return response.status(200).json({
      message: "Related products retrieved.",
      error: false,
      success: true,
      data: related,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
