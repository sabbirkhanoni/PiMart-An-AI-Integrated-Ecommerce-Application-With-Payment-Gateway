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
            mobile
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