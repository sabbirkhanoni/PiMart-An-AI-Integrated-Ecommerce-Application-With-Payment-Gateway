import SubCategoryModel from '../models/subCategory.model.js';


export const AddSubCatgoryController = async (request, response) =>{
    try {
        const { name, image, category} =request.body;
        if(!name && !image && !catgory[0]){
            return response.status(400).json({
                message: "Please fill all the feilds",
                error:true,
                false: true
            })
        }

        const dataPayload = {
            name,
            image,
            category
        }

        const createSubCategory = await SubCategoryModel(dataPayload);
        const savedSubCategory = await createSubCategory.save();

        if(savedSubCategory){
            return response.status(200).json({
                message: "Sub Category created successfully",
                error: false,
                success: true,
                data: savedSubCategory
            })
        }

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error: true,
            success: false
        })
    }
}

export const GetSubCategoryController = async (request, response) => {
    try {
        const subCategory = await SubCategoryModel.find().sort({createdAt: -1}).populate('category');
        if(subCategory.length === 0){
            return response.status(200).json({
                message: "No Sub Category found",
                error: false,
                success: true,
                data: subCategory
            })
        }
        return response.status(200).json({
            message: "Sub Category fetched successfully",
            error: false,
            success: true,
            data: subCategory
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const UpdateSubCategoryController = async (request, response) => {
    try{
        const { _id, name, image, category} = request.body;

        const checkSubCategory = await SubCategoryModel.findById(_id);

        if(!checkSubCategory){
            return response.status(404).json({
                message: "Sub Category Id is not found",
                error: true,
                success: false
            });
        }

        const updateSubCategory = await SubCategoryModel.findByIdAndUpdate(_id, {
            name,
            image,
            category
        })

        if(!updateSubCategory){
                return response.status(400).json({
                message: "Sub Category not updated",
                error: true,
                success: false
            })
        }

        return response.status(200).json({
                message: "Sub Category Updated Successfully",
                data: updateSubCategory,
                error: false,
                success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const DeleteSubCategoryController = async(request,response) =>{
    try{
        const { _id } = request.body;

        const deleteSubCategory = await SubCategoryModel.findByIdAndDelete(_id);

        if(!deleteSubCategory){
            return response.status(404).json({
                message: "Sub Category is not Deleted",
                error: true,
                success: false
            })
        }

        return response.status(200).json({
            message: "Sub Category Deleted Successfully",
            data: deleteSubCategory,
            error: false,
            success: true
        })

    } catch(error){
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}




