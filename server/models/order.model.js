

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    orderId: {
        type: String,
        required: [true, "Order Id is required"],
    },
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: 'product'
    },
    product_details: {
        _id: String,
        name: String,
        image: Array,
    },
    quantity: {
        type: Number,
        default: 1
    },
    paymentId: {
        type: String,
        default: ""
    },
    payment_status: {
        type: String,
        default: ""
    },
    delivery_address: {
        type: mongoose.Schema.ObjectId,
        ref: 'address'
    },
    subTotalAmt: {
        type: Number,
        default: 0
    },
    totalAmt: {
        type: Number,
        default: 0
    },
    couponCode: {
        type: String,
        default: ""
    },
    discountAmt: {
        type: Number,
        default: 0
    },
    invoice_receipt: {
        type: String,
        default: ""
    },
    delivery_status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    statusHistory: [
        {
            status: {
                type: String,
                enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
                default: 'Pending'
            },
            timestamp: {
                type: Date,
                default: Date.now
            },
            note: {
                type: String,
                default: ''
            }
        }
    ]
}, {
    timestamps: true
});


const OrderModel = mongoose.model('order', orderSchema);

// Drop unique index on orderId if it exists to allow multiple products in the same order
OrderModel.collection.dropIndex('orderId_1').catch(() => { });

export default OrderModel;