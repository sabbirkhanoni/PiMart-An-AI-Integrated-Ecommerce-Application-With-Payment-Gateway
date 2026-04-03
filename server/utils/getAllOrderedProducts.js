import Stripe from "../config/paymentGatewayStripe.js";
import mongoose from "mongoose";

export async function getAllOrderedProducts({
  line_items,
  userId,
  addressId,
  paymentId,
  payment_status,
}) {
  const productList = [];
  if (line_items && line_items.data && line_items.data.length > 0) {
    for (const item of line_items.data) {
      const product = await Stripe.products.retrieve(item.price.product);
      
      const payload = {
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: product.metadata.productId,
        product_details: {
          name: product.name,
          image: product.images,
        },
        paymentId: paymentId,
        payment_status: payment_status,
        delivery_address: addressId,
        subTotalAmt: Number(item.amount_total / 100), // Stripe amount is in cents
        totalAmt: Number(item.amount_total / 100), // Stripe amount is in cents
      };

      productList.push(payload);
    }
  }

  return productList;
}
