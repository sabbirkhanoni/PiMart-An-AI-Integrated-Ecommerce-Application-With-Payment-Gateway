import { populate } from "dotenv";
import ProductModel from "../models/product.model.js";

export const AddProductController = async (request, response) => {
  try {
    const {
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      costPrice,
      discount,
      description,
      more_details,
    } = request.body;

    if (
      !name ||
      !image[0] ||
      !category[0] ||
      !subCategory[0] ||
      !unit ||
      !price ||
      !description
    ) {
      return response.status(400).json({
        message: "Please Enter All Required Fields",
        error: true,
        success: false,
      });
    }

    const productData = new ProductModel({
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      costPrice: Number(costPrice) || 0,
      discount,
      description,
      more_details,
    });

    const savedProduct = await productData.save();

    if (savedProduct) {
      return response.status(200).json({
        message: "Product Added Successfully",
        error: false,
        success: true,
        data: savedProduct,
      });
    }

    return response.status(400).json({
      message: "Product Creation Failed",
      error: true,
      success: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const UpdateProductController = async (request, response) => {
  try {
    const { _id } = request.body;
    if( !_id ) {
      return response.status(400).json({
        message: "Please provide product _id",
        error: true,
        success: false,
      });
    }

    const updatedProduct = await ProductModel.updateOne({ _id: _id }, { $set: { ...request.body } });

    if (updatedProduct.modifiedCount > 0) {
      return response.status(200).json({
        message: "Product Updated Successfully",
        error: false,
        success: true,
        data: updatedProduct,
      });
    }

  }catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success:false,
    })
  }
}

export const DeleteProductController = async (request, response) => {
  try {
    const { _id } = request.body;
    if( !_id ) {
      return response.status(400).json({
        message: "Please provide product _id",
        error: true,
        success: false,
      });
    }

    const deleteProduct = await ProductModel.deleteOne({ _id: _id });

    if(deleteProduct) {
      return response.status(200).json({
        message: "Product Deleted Successfully",
        error: false,
        success: true,
        data: deleteProduct,
      });
    }

  }catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success:false,
    })
  }
}

export const GetAllProductsController = async (request, response) => {
  try {
    //pagination dependent

    let { page, limit, search } = request.body;

    if (!page) {
      page = 1;
    }

    if (!limit) {
      limit = 10;
    }

    const skip = (page - 1) * limit;

    const query = search
      ? {
          $text: {
            $search: search,
          },
        }
      : {};

    const [data, totalCount] = await Promise.all([
      ProductModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("category").populate("subCategory"),
      ProductModel.countDocuments(query),
    ]);

    return response.status(200).json({
      message: "Products Fetched Successfully",
      error: false,
      success: true,
      data: data,
      totalCount: totalCount,
      totalNoPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const GetProductByCategoryWiseController = async (request, response) => {
  try {
    const { categoryId } = request.body;

    if (!categoryId) {
      return response.status(400).json({
        message: "Please provide categoryId",
        error: true,
        success: false,
      });
    }
    const categoryWiseProduct = await ProductModel.find({
      category: { $in: categoryId },
    }).limit(15);

    return response.status(200).json({
      message: "Category wise product fetched successfully",
      error: false,
      success: true,
      data: categoryWiseProduct,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const GetProductByCategoryAndSubCategoryParamsController = async (
  request,
  response
) => {
  try {
    let {
      categoryId,
      subCategoryId,
      page,
      limit,
      sortBy,
      minPrice,
      maxPrice,
      inStock,
    } = request.body;

    if (!categoryId || !subCategoryId) {
      return response.status(400).json({
        message: "Please Provide categoryId and subCategoryId",
        error: true,
        success: false,
      });
    }

    page = Number(page) || 1;
    limit = Number(limit) || 12;

    const query = {
      category: { $in: Array.isArray(categoryId) ? categoryId : [categoryId] },
      subCategory: { $in: Array.isArray(subCategoryId) ? subCategoryId : [subCategoryId] },
    };

    if (minPrice !== undefined && minPrice !== "" && minPrice !== null) {
      query.price = query.price || {};
      query.price.$gte = Number(minPrice);
    }
    if (maxPrice !== undefined && maxPrice !== "" && maxPrice !== null) {
      query.price = query.price || {};
      query.price.$lte = Number(maxPrice);
    }

    if (inStock === true || inStock === "true") {
      query.stock = { $gt: 0 };
    }

    let sortOptions = { createdAt: -1 };
    if (sortBy === "price_asc") {
      sortOptions = { price: 1 };
    } else if (sortBy === "price_desc") {
      sortOptions = { price: -1 };
    } else if (sortBy === "discount_desc") {
      sortOptions = { discount: -1 };
    } else if (sortBy === "rating_desc") {
      sortOptions = { averageRating: -1, totalReviews: -1 };
    } else if (sortBy === "newest") {
      sortOptions = { createdAt: -1 };
    }

    const [productData, totalCount] = await Promise.all([
      ProductModel.find(query)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(limit),
      ProductModel.countDocuments(query),
    ]);

    return response.status(200).json({
      message: "Product data fetched successfully",
      error: false,
      success: true,
      data: productData,
      totalCount: totalCount,
      page: page,
      limit: limit,
      totalNoPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const GetSingleProductDetailsController = async (request, response) => {
  try {
    const { productId } = request.body;

    if (!productId) {
      return response.status(400).json({
        message: "Please provide productId",
        error: true,
        success: false,
      });
    }

    const productDetails = await ProductModel.findOne({ _id: productId })
      .populate("category")
      .populate("subCategory");

    return response.status(200).json({
      message: "Product details fetched successfully",
      error: false,
      success: true,
      data: productDetails,
    });
  } catch (error) {
    response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const GetProductBySearchController = async (request, response) => {
  try {
    let {
      search,
      page,
      limit,
      sortBy,
      minPrice,
      maxPrice,
      inStock,
      categoryId,
      subCategoryId,
    } = request.body;

    page = Number(page) || 1;
    limit = Number(limit) || 12;

    const query = {};

    // Search query with regex fallback for partial and fuzzy matching
    if (search && search.trim() !== "") {
      const trimmed = search.trim();
      const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { name: { $regex: escaped, $options: "i" } },
        { description: { $regex: escaped, $options: "i" } },
      ];
    }

    // Price range filter
    if (minPrice !== undefined && minPrice !== "" && minPrice !== null) {
      query.price = query.price || {};
      query.price.$gte = Number(minPrice);
    }
    if (maxPrice !== undefined && maxPrice !== "" && maxPrice !== null) {
      query.price = query.price || {};
      query.price.$lte = Number(maxPrice);
    }

    // In stock filter
    if (inStock === true || inStock === "true") {
      query.stock = { $gt: 0 };
    }

    // Category filter
    if (categoryId) {
      if (Array.isArray(categoryId) && categoryId.length > 0) {
        query.category = { $in: categoryId };
      } else if (typeof categoryId === "string" && categoryId.trim() !== "") {
        query.category = { $in: [categoryId] };
      }
    }

    // SubCategory filter
    if (subCategoryId) {
      if (Array.isArray(subCategoryId) && subCategoryId.length > 0) {
        query.subCategory = { $in: subCategoryId };
      } else if (typeof subCategoryId === "string" && subCategoryId.trim() !== "") {
        query.subCategory = { $in: [subCategoryId] };
      }
    }

    // Dynamic sorting
    let sortOptions = { createdAt: -1 };
    if (sortBy === "price_asc") {
      sortOptions = { price: 1 };
    } else if (sortBy === "price_desc") {
      sortOptions = { price: -1 };
    } else if (sortBy === "discount_desc") {
      sortOptions = { discount: -1 };
    } else if (sortBy === "rating_desc") {
      sortOptions = { averageRating: -1, totalReviews: -1 };
    } else if (sortBy === "newest") {
      sortOptions = { createdAt: -1 };
    }

    // Fetch products, matching count, and catalog price bounds in parallel
    const [productData, totalCount, priceStats] = await Promise.all([
      ProductModel.find(query)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("category subCategory"),
      ProductModel.countDocuments(query),
      ProductModel.aggregate([
        {
          $group: {
            _id: null,
            minPrice: { $min: "$price" },
            maxPrice: { $max: "$price" },
          },
        },
      ]),
    ]);

    const priceBounds =
      priceStats && priceStats.length > 0 && priceStats[0].maxPrice
        ? {
            minPrice: priceStats[0].minPrice || 0,
            maxPrice: priceStats[0].maxPrice || 1000,
          }
        : { minPrice: 0, maxPrice: 1000 };

    return response.status(200).json({
      message: "Product data fetched successfully",
      error: false,
      success: true,
      data: productData,
      totalCount: totalCount,
      page: page,
      totalNoPages: Math.ceil(totalCount / limit),
      limit: limit,
      priceBounds: priceBounds,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
