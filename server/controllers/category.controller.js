import CategoryModel from '../models/category.model.js';
import ProductModel from '../models/product.model.js';
import SubCategoryModel from '../models/subCategory.model.js';

//upload Category API
export const AddCategoryController = async (request, response) => {
    try {

        const { name, image } = request.body;
        if(!name || !image){
            return response.status(400).json({
                message: "Please Enter Category Name and Image",
                error: true,
                success: false,
             })
        }

        const uploadCategory = new CategoryModel({
            name,
            image,
        });

        const savedCategory = await uploadCategory.save();

        if (!savedCategory) {
            return response.status(400).json({
                message: "Category Creation Failed",
                error: true,
                success: false,
            });
        }
        
        return response.status(200).json({
            message: "Category Created Successfully",
            error: false,
            success: true,
            data: savedCategory,
        });


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

//get all categories API
export const GetAllCategoriesController = async (request, response) => {
    try {
        const categorysData = await CategoryModel.find().sort({ createdAt: -1})


        return response.status(200).json({
            data: categorysData,
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        })
    }
}

export const UpdateCategoryController = async (request,response)=>{
    try {
        const {_id,name, image} = request.body;

        const updateCategory = await CategoryModel.updateOne({
            _id : _id
        },{
            name,
            image
        })

        return response.status(200).json({
            message: "Category Updated Successfully",
            error: false,
            success: true,
            data: updateCategory
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const DeleteCategoryController = async (request,response)=>{
    try {
        const {_id} = request.body;
        if(!_id){
            return response.status(400).json({
                message: "Category Id Not Found",
                error:true,
                success: false
             })
        }

        //before deleting the category, check if the category exists
        const checkOnSubCategoryDatabaseModel = await SubCategoryModel.findOne({
            category : {
                "$in" : _id
            }
        }).countDocuments();

        const checkOnProductDatabaseModel = await ProductModel.findOne({
            category : {
                "$in" : _id
            }
        }).countDocuments()

        if(checkOnSubCategoryDatabaseModel > 0 || checkOnProductDatabaseModel > 0){
            return response.status(400).json({
                message: "Category is used in Sub-Category or Products,So You Cannot Delete",
                error: true,
                success: false
            })
        }

        //if the category is not used in any sub-category or product, then delete the category

        const deleteCategory = await CategoryModel.deleteOne({
            _id : _id
        })

        if(deleteCategory){
            return response.status(200).json({
                message: "Category Deleted Successfully",
                error: false,
                success: true,
                data : deleteCategory
            })
        }


    } catch (error) {
        response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}




