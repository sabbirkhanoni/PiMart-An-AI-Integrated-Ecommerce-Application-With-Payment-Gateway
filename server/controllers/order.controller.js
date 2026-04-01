import OrderModel from '../models/order.model.js';
import UserModel from '../models/user.model.js';
import ProductModel from '../models/product.model.js';
import mongoose from 'mongoose';
import CartProductModel from '../models/cartproduct.model.js';
import { calculatePriceWithDiscount } from '../utils/calculatePriceWithDiscount.js';
import Stripe from '../config/paymentGatewayStripe.js';

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

export const StripePaymentController = async (request, response) => {
    try {
        const userId = request.userId;
        const { list_item, addressId, subTotalAmt, totalAmt, paymentId } = request.body;

        //get User Of this UserId
        const user = await UserModel.findById(userId);

        const line_items = list_item.map((item) => {
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.productId.name,
                        images: [item.productId.image],
                        metadata : {
                            productId: item.productId._id,
                        }
                    },
                    unit_amount: calculatePriceWithDiscount(item.productId.price, item.productId.discount) * 100, // Stripe expects amount in cents
                },
                adjustable_quantity: {
                    enabled: true,
                    minimum: 1,
                },
                quantity: item.quantity,
            }
        });

        const session = await Stripe.checkout.sessions.create({
            submit_type: 'pay',
            payment_method_types: ['card'],
            line_items: line_items,
            mode: 'payment',
            customer_email: user.email,
            metadata: {
                userId: userId,
                orderId: `ORD-${new mongoose.Types.ObjectId()}`,
                addressId: addressId,
            },
            success_url: `${process.env.CLIENT_URL}/complete`,
            cancel_url: `${process.env.CLIENT_URL}/failed`,
        })

        return response.status(303).json({
            success: true,
            error: false,
            message: "Stripe checkout session created successfully.",
            session : session
        })

    } catch (error) {
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || error || 'An error occurred while processing the order.'
        })
    }
}
