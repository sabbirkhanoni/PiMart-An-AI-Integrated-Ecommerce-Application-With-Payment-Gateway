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
    const { categoryId, subCategoryId, page, limit } = request.body;

    if (!categoryId || !subCategoryId) {
      return response.status(400).json({
        message: "Please Provide categoryId and subCategoryId",
        error: true,
        success: false,
      });
    }

    if (!page) {
      page = 1;
    }

    if (!limit) {
      limit = 10;
    }

    const query = {
      category: { $in: categoryId },
      subCategory: { $in: subCategoryId },
    };

    const [productData, totalCount] = await Promise.all([
      ProductModel.find(query)
        .sort({ createdAt: -1 })
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
    });
  } catch (error) {
    response.status(500).json({
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

    const productDetails = await ProductModel.findOne({ _id: productId });

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
