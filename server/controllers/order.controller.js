import OrderModel from '../models/order.model.js';
import UserModel from '../models/user.model.js';
import ProductModel from '../models/product.model.js';
import mongoose from 'mongoose';
import CartProductModel from '../models/cartproduct.model.js';

export const CashOnDeliveryPaymentController = async (request, response) => {
    try {
        const userId = request.userId;
        const { list_item, addressId, subTotalAmt, totalAmt } = request.body;

        const payload = list_item.map((item) => {
            return {
                userId : userId,
                orderId: `ORD-${new mongoose.Types.ObjectId()}`,
                productId: item.productId._id,
                product_details: {
                    name: item.productId.name,
                    image: item.productId.image,
                },
                paymentId: "",
                payment_status: "Cash on Delivery",
                delivery_address: addressId,
                subTotalAmt : subTotalAmt,
                totalAmt : totalAmt,
            }
        });

        const createOrder = await OrderModel.insertMany(payload);
        
        if(createOrder) {
            const deleteCartProducts = await CartProductModel.deleteMany({ userId: userId });
            const updateUserModel = await UserModel.updateOne({_id: userId}, { shopping_cart: [] });
        }

        return response.status(200).json({
            success: true,
            error: false,
            message: "Cash on delivery Successful."
        })
        
    } catch (error) {
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || error || 'An error occurred while processing the order.'
        })
    }
}
