import AddressModel from "../models/address.model.js";
import CartProductModel from "../models/cartproduct.model.js";
import UserModel from "../models/user.model.js";
import SSLCommerzPayment from 'sslcommerz-lts';
import OrderModel from "../models/order.model.js";
import mongoose from "mongoose";
import { validateSSLPayment } from "../utils/API/validateSSLPayment.js";

const store_id = process.env.STORE_ID
const store_passwd = process.env.STORE_PASSWORD
const is_live = false


async function getCartALLProductsPrice(userId) {
    const cartProducts = await CartProductModel
        .find({ userId })
        .populate("productId");
    const totalPrice = cartProducts.reduce((acc, item) => {
        const product = item.productId;
        const price = product.price;
        const discount = product.discount || 0;
        const quantity = item.quantity;
        const discountedPrice =
            price - (price * discount / 100);
        return acc + (discountedPrice * quantity);
    }, 0);
    return totalPrice;
}


async function getUserDetails(userId) {
    const user = await UserModel.findById(userId);
    user.password = "";
    user.refresh_token = "";
    user.avatar = ""
    return user;
}

async function getUserAddressDetails(userId, addressId) {
    const addressDetails = await AddressModel.findOne({ _id: addressId, userId });
    return addressDetails;
}

export const SSLCommerzPaymentController = async (req, res) => {
    try {
        const userId = req.userId;
        const { list_item, addressId } = req.body;
        const totalAmt = await getCartALLProductsPrice(userId);
        const user = await getUserDetails(userId);
        const addressDetails = await getUserAddressDetails(userId, addressId);

        
        if (!totalAmt || !list_item || list_item.length === 0 || !addressId) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: totalAmt, list_item, or addressId.",
                error: true,
            });
        }

        const tran_id = `SSLCOMMERZ_${new Date().getTime()}`;
        const orderedProducts = list_item.map((item) => {
            return {
                userId: userId,
                orderId: `ORD-${new mongoose.Types.ObjectId()}`,
                productId: item.productId._id,
                product_details: {
                    name: item.productId.name,
                    image: item.productId.image,
                },
                paymentId: tran_id,
                payment_status: "pending", // will update to "success" after payment
                delivery_address: addressId,
                subTotalAmt: Number(totalAmt),
                totalAmt: Number(totalAmt),
            };
        });

        const data = {
            total_amount: totalAmt,
            currency: 'BDT',
            tran_id: tran_id,
            success_url: `${process.env.BACKEND_URL}/api/payment-complete/${tran_id}`,
            fail_url: `${process.env.BACKEND_URL}/api/payment-failed/${tran_id}`,
            cancel_url: `${process.env.BACKEND_URL}/api/payment-cancel/${tran_id}`,
            ipn_url: `${process.env.BACKEND_URL}/api/payment-ipn`,
            shipping_method: 'Online',
            product_name: list_item.map(item => item.productId.name).join(', '),
            product_category: 'general',
            product_profile: 'general',
            cus_name: user.name,
            cus_email: user.email,
            cus_add1: addressDetails.homeName,
            cus_add2: addressDetails.homeName,
            cus_city: addressDetails.city,
            cus_state: addressDetails.city,
            cus_postcode: addressDetails.zipCode,
            cus_country: addressDetails.country,
            cus_phone: user.mobile,
            cus_fax: user.mobile,
            ship_name: addressDetails.homeName,
            ship_add1: addressDetails.homeName,
            ship_add2: addressDetails.homeName,
            ship_city: addressDetails.city,
            ship_state: addressDetails.city,
            ship_postcode: addressDetails.zipCode,
            ship_country: addressDetails.country,
    };

    //Order Create First Then Initialized Payment
    try {
        await OrderModel.insertMany(orderedProducts);
        
        //not need on production of application (only for localhost)
        //await UserModel.findByIdAndUpdate(userId,{shopping_cart: []});
        //await CartProductModel.deleteMany({userId: userId});

    } catch (err) {
        console.error('Error saving orders:', err);
    }

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
    sslcz.init(data).then(async apiResponse => {
    let GatewayPageURL = apiResponse.GatewayPageURL

        res.status(200).json({
            success: true,
            message: "SSLCommerz payment initiated successfully.",
            error: false,
            url: GatewayPageURL
        });

    }).catch(err => {
        res.status(500).json({
            success: false,
            message: "Failed to initialize SSLCommerz payment",
            error: true,
        });
    });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while processing the SSLCommerz payment.",
            error: true,
        });
    }
};


export const SSLCommerzPaymentSuccessController = async (req, res) => {
    try {
        const { tran_id } = req.params;

        if (!tran_id) {
            return res.status(400).json({
                success: false,
                message: "Missing required field: tran_id.",
                error: true,
            });
        }

         return res.redirect(
            `${process.env.FRONTEND_URL}/payment-complete/${tran_id}`
        );

    } catch (error) {
         return res.redirect(
            `${process.env.FRONTEND_URL}/payment-failed/${tran_id}`
        );
    }
};


export const SSLCommerzPaymentFailedController = async (req, res) => {
    try {
        const { tran_id } = req.params;

        if (!tran_id) {
            return res.status(400).json({
                success: false,
                message: "Missing required field: tran_id.",
                error: true,
            });
        }

        const updatedOrders = await OrderModel.updateMany(
            { paymentId: tran_id },
            { payment_status: "failed" },
            { new: true }
        );

        if (updatedOrders.modifiedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "No orders found for this transaction.",
                error: true,
            });
        }

        return res.redirect(
            `${process.env.FRONTEND_URL}/payment-failed/${tran_id}`
        );

    } catch (error) {
        return res.redirect(
            `${process.env.FRONTEND_URL}/payment-failed/${tran_id}`
        );
    }
};


export const SSLCommerzPaymentCancelController = async (req, res) => {

    const { tran_id } = req.params;

     if (!tran_id) {
        return res.status(400).json({
            success: false,
            message: "Missing required field: tran_id.",
            error: true,
        });
    }

    await OrderModel.updateMany(
        { paymentId: tran_id },
        { payment_status: "cancelled" }
    );

    return res.redirect(
        `${process.env.FRONTEND_URL}/payment-cancel/${tran_id}`
    );
};


export const SSLCommerzIpnController = async (req, res) => {

    try {

        const data = req.body;

        console.log("IPN:", data);

        const {
            val_id,
            tran_id
        } = data;

        // check ipn response from sslcommerz and validate
        const validation = await validateSSLPayment(val_id);

        console.log("Validation:", validation);

        
        const isValid =
            validation.status === "VALID" &&
            validation.tran_id === tran_id &&
            validation.currency_type === "BDT";

        if (!isValid) {
            return res.status(400).send("INVALID PAYMENT");
        }

        // check duplicate
        const existingOrder = await OrderModel.findOne({
            paymentId: tran_id,
            payment_status: "success"
        });

        if (existingOrder) {
            return res.status(200).send("ALREADY PROCESSED");
        }

        // check order
        const orders = await OrderModel.find({
            paymentId: tran_id
        });

        if (!orders.length) {
            return res.status(404).send("ORDER NOT FOUND");
        }

        const userId = orders[0].userId;

        // update payment status
        await OrderModel.updateMany(
            { paymentId: tran_id },
            { payment_status: "success" }
        );

        // clear cart
        await UserModel.findByIdAndUpdate(userId,{shopping_cart: []});

        await CartProductModel.deleteMany({userId: userId});

        return res.status(200).send("OK");

    } catch (err) {

        console.log(err);

        return res.status(500).send("ERROR");
    }
};