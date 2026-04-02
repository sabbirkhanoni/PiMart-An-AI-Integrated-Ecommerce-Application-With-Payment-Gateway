import OrderModel from '../models/order.model.js';
import UserModel from '../models/user.model.js';
import ProductModel from '../models/product.model.js';
import mongoose from 'mongoose';
import CartProductModel from '../models/cartproduct.model.js';
import { calculatePriceWithDiscount } from '../utils/calculatePriceWithDiscount.js';
import Stripe from '../config/paymentGatewayStripe.js';
import {getAllOrderedProducts} from '../utils/getAllOrderedProducts.js';

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

        if(!list_item || list_item.length === 0) {
            return response.status(400).json({
                success: false,
                error: true,
                message: "Please Select at least One Product to proceed."
            })
        }

        //get User Of this UserId
        const user = await UserModel.findById(userId);

        const line_items = list_item.map((item) => {
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.productId.name || "Product",
                        images: item.productId.image,
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
            success_url: `${process.env.FRONTEND_URL}/complete`,
            cancel_url: `${process.env.FRONTEND_URL}/failed`,
        })

       return response.status(200).json({
            url: session.url
        })

    } catch (error) {
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || error || 'An error occurred while processing the order.'
        })
    }
}




//from Stripe webhook Docs : https://docs.stripe.com/webhooks
//More Exception Handling and Loging Version of ReceiveWebHookFromStripeController
export const ReceiveWebHookFromStripeController = async (request, response) => {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY;
    let event;

    try {
        const signature = request.headers['stripe-signature'];
        const rawBody = request.body; // express.raw middleware must be applied before express.json
        if (!endpointSecret) {
            console.error('Missing STRIPE_WEBHOOK_SECRET_KEY');
            return response.status(500).send('Webhook secret not configured');
        }

        event = Stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
    } catch (err) {
        console.log('⚠️ Webhook signature verification failed.', err.message);
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        // Handle only safe event types here. Use session.id for listLineItems.
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object; // checkout session object
                try {
                    const line_items = await Stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
                    const userId = session.metadata?.userId;
                    const addressId = session.metadata?.addressId;
                    const paymentId = session.payment_intent || session.id;
                    const payment_status = session.payment_status || 'paid';

                    const orderedProducts = await getAllOrderedProducts({
                        line_items,
                        userId,
                        addressId,
                        paymentId,
                        payment_status,
                    });

                    if (orderedProducts && orderedProducts.length) {
                        await OrderModel.insertMany(orderedProducts);
                        await UserModel.findByIdAndUpdate(userId, { shopping_cart: [] });
                        await CartProductModel.deleteMany({ userId });
                    }

                    console.log('Processed checkout.session.completed for session:', session.id);
                } catch (err) {
                    console.error('Error processing checkout.session.completed:', err);
                    // don't throw — return 200 so Stripe doesn't keep retrying forever or crash server
                }
                break;
            }

            // Optional: just log other events; avoid using payment intent id to fetch session without mapping
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        return response.json({ received: true });
    } catch (err) {
        console.error('Error handling webhook event:', err);
        return response.status(500).send('Server error');
    }
};

