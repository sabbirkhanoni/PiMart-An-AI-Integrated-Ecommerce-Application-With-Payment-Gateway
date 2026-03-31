import AddressModel from "../models/address.model.js";
import UserModel from '../models/user.model.js'


export const addDeliveryAddress = async(request, response) => {
    
    try {
        const userId = request.userId;
        const { homeName, roadName, zipCode, city, country, mobile } = request.body;

        const newAddress = await AddressModel({
            homeName,
            roadName,
            zipCode,
            city,
            country,
            mobile,
            userId : userId
        });

        console.log("userId", request.userId);

        const savedAddress = await newAddress.save();

        const savedAddressIdWithUser = await UserModel.findByIdAndUpdate(userId,
            {
                $push: {
                    address_deatils : savedAddress._id
                }
            });

        if (!savedAddressIdWithUser) {
            return response.status(404).json({ 
                message: "User not found",
                error: true,
                success: false
            });
        } 

        response.status(201).json({ 
            message: "Delivery address added successfully", 
            error: false,
            success: true
        });

    } catch (error) {
        response.status(500).json({ 
            message: error.message || error || "An error occurred while adding the delivery address",
            error: "Internal server error",
            success: false
        });
    }
}

export const getAllAddressOfUser = async(request, response) => {
    try {
        const userId = request.userId;

        const data = await AddressModel.find({ userId: userId }).sort({ createdAt: -1 });

        return response.status(200).json({
            message: "Delivery address retrieved successfully",
            error: false,
            success: true,
            data: data
        })

    } catch (error) {
        response.status(500).json({ 
            message: error.message || error || "An error occurred while fetching the delivery address",
            error: "Internal server error",
            success: false
        });
    }
}

export const EditDeliveryAddressController = async(request, response) => {
    try {
        const userId = request.userId;
        const { _id , homeName, roadName, zipCode, city, country, mobile } = request.body;

        const updateedAddress = await AddressModel.updateOne(
            { _id: _id, userId: userId },
            {
                homeName,
                roadName,
                zipCode,
                city,
                country,
                mobile
            }
        );

        if(!updateedAddress) {
            return response.status(404).json({
                message: "Address not found",
                error: true,
                success: false
            })
        } else {
            return response.status(200).json({
                message: "Delivery address updated successfully",
                error: false,
                success: true
            });
        }
        
    } catch (error) {
        response.status(500).json({
            message: error.message,
            error: true,
            success: false
        })
    }
}

export const DeleteAddressController = async(request, response) => {
    try {
        const userId = request.userId;
        const { _id } = request.body;

        const deletedAddress = await AddressModel.deleteOne({
            _id: _id,
            userId: userId
        })

        if(!deletedAddress) {
            return response.status(400).json({
                message: "Address not found",
                error: true,
                success: false
            })
        } else {
            return response.status(200).json({
                message: "Delivery address deleted successfully",
                error: false,
                success: true,
                data: deletedAddress
            });
        }

    } catch (error) {
        response.status(500).json({
            message: error.message,
            error: true,
            success: false
        })
    }
}

