import OrderModel from '../models/order.model.js';
import UserModel from '../models/user.model.js';
import ProductModel from '../models/product.model.js';
import mongoose from 'mongoose';
import CartProductModel from '../models/cartproduct.model.js';
import { calculatePriceWithDiscount } from '../utils/calculatePriceWithDiscount.js';
import Stripe from '../config/paymentGatewayStripe.js';
import {getAllOrderedProducts} from '../utils/getAllOrderedProducts.js';
import CouponModel from '../models/coupon.model.js';

export const CashOnDeliveryPaymentController = async (request, response) => {
    try {
        const userId = request.userId;
        const { list_item, addressId, couponCode, couponDiscount } = request.body;

        if (!list_item || list_item.length === 0) {
            return response.status(400).json({
                success: false,
                error: true,
                message: "Please select at least one product to proceed."
            });
        }

        if (!addressId) {
            return response.status(400).json({
                success: false,
                error: true,
                message: "Please select a delivery address."
            });
        }

        const commonOrderId = `ORD-${new mongoose.Types.ObjectId()}`;

        const totalDiscount = Number(couponDiscount) || 0;
        const totalItems = list_item.length;
        const discountPerItem = totalItems > 0 ? totalDiscount / totalItems : 0;

        const payload = list_item.map((item) => {
            const product = item?.productId || {};
            const quantity = Number(item?.quantity) || 1;
            const originalPrice = Number(product?.price) || 0;
            const discount = Number(product?.discount) || 0;
            const discountedUnitPrice = calculatePriceWithDiscount(originalPrice, discount);
            const itemTotal = Math.max(0, discountedUnitPrice * quantity - discountPerItem);

            return {
                userId : userId,
                orderId: commonOrderId,
                productId: product?._id,
                product_details: {
                    name: product?.name || "Product",
                    image: product?.image || [],
                },
                quantity: quantity,
                paymentId: "",
                payment_status: "Cash on Delivery",
                delivery_address: addressId,
                delivery_status: "Pending",
                couponCode: couponCode ? String(couponCode).toUpperCase() : "",
                discountAmt: discountPerItem,
                statusHistory: [
                    {
                        status: "Pending",
                        timestamp: new Date(),
                        note: `Order placed successfully with Cash on Delivery.${couponCode ? ` Applied coupon: ${couponCode}` : ''}`
                    }
                ],
                subTotalAmt : discountedUnitPrice,
                totalAmt : itemTotal,
            };
        });

        const createOrder = await OrderModel.insertMany(payload);
        
        if(createOrder) {
            // Deduct stock for each ordered product
            for (const item of list_item) {
                const prodId = item?.productId?._id || item?.productId;
                const qty = Number(item?.quantity) || 1;
                if (prodId) {
                    await ProductModel.updateOne(
                        { _id: prodId },
                        { $inc: { stock: -qty } }
                    );
                }
            }

            // Increment coupon usage count if applied
            if (couponCode) {
                await CouponModel.updateOne(
                    { code: String(couponCode).toUpperCase() },
                    { $inc: { usedCount: 1 } }
                );
            }

            await CartProductModel.deleteMany({ userId: userId });
            await UserModel.updateOne({_id: userId}, { shopping_cart: [] });
        }

        return response.status(200).json({
            success: true,
            error: false,
            message: "Cash on delivery order placed successfully.",
            data: createOrder,
        });
        
    } catch (error) {
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || error || 'An error occurred while processing the order.'
        });
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
        const rawBody = request.body;
        if (!endpointSecret) {
            console.error('Missing STRIPE_WEBHOOK_SECRET_KEY');
            return response.status(500).send('Webhook secret not configured');
        }

        event = Stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
    } catch (err) {
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
                    
                    if (!userId) {
                        console.warn('No userId in session.metadata, skipping order creation for session', session.id);
                        return response.status(200).json({ received: true });
                    }

                    const orderedProducts = await getAllOrderedProducts({
                        line_items,
                        userId,
                        addressId,
                        paymentId,
                        payment_status,
                    });

                    
                    await OrderModel.insertMany(orderedProducts);

                    // Deduct stock for each product in Stripe order
                    for (const prod of orderedProducts) {
                        if (prod.productId) {
                            await ProductModel.updateOne(
                                { _id: prod.productId },
                                { $inc: { stock: -(prod.quantity || 1) } }
                            );
                        }
                    }

                    await UserModel.findByIdAndUpdate(userId, { shopping_cart: [] });
                    await CartProductModel.deleteMany({ userId: userId });
                    console.log('Processed checkout.session.completed and cleared cart for user:', userId);

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


export const getAllOrderedProductDetailsController = async (request, response) => {
    try {
        const userId = request.userId;
        const ordersCollection = await OrderModel.find({userId: userId}).sort({ createdAt: -1 }).populate('delivery_address');

        return response.status(200).json({
            success: true,
            error: false,
            message: "Order Details.",
            data: ordersCollection || [],
        });

    } catch (error) {
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || error || 'An error occurred while fetching the order details.'
        });
    }
}

// User-initiated order cancellation (only when order is in 'Pending' state)
export const cancelOrderController = async (request, response) => {
    try {
        const userId = request.userId;
        const { orderId, reason } = request.body;

        if (!orderId) {
            return response.status(400).json({
                success: false,
                error: true,
                message: "Order ID is required."
            });
        }

        const orders = await OrderModel.find({ orderId, userId });

        if (!orders || orders.length === 0) {
            return response.status(404).json({
                success: false,
                error: true,
                message: "Order not found or you are not authorized to cancel this order."
            });
        }

        const currentStatus = orders[0].delivery_status || 'Pending';

        if (currentStatus === 'Cancelled') {
            return response.status(400).json({
                success: false,
                error: true,
                message: "This order is already cancelled."
            });
        }

        if (currentStatus !== 'Pending') {
            return response.status(400).json({
                success: false,
                error: true,
                message: `Order cannot be cancelled because it is already '${currentStatus}'. Please contact customer support.`
            });
        }

        // Restore inventory stock for each product in this order
        for (const item of orders) {
            const prodId = item?.productId?._id || item?.productId;
            const qty = Number(item?.quantity) || 1;
            if (prodId) {
                await ProductModel.updateOne(
                    { _id: prodId },
                    { $inc: { stock: qty } }
                );
            }
        }

        const cancelNote = reason?.trim() ? `Cancelled by customer: ${reason.trim()}` : "Order cancelled by customer.";

        await OrderModel.updateMany(
            { orderId, userId },
            {
                $set: { delivery_status: 'Cancelled' },
                $push: {
                    statusHistory: {
                        status: 'Cancelled',
                        timestamp: new Date(),
                        note: cancelNote
                    }
                }
            }
        );

        return response.status(200).json({
            success: true,
            error: false,
            message: "Order cancelled successfully and product inventory restored."
        });

    } catch (error) {
        console.error("Error in cancelOrderController:", error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || error || "Failed to cancel order."
        });
    }
};

