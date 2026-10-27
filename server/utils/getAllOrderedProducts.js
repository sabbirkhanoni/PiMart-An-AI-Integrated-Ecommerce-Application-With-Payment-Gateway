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
  const commonOrderId = `ORD-${new mongoose.Types.ObjectId()}`;

  if (line_items && line_items.data.length > 0) {
    for (const item of line_items.data) {
      const product = await Stripe.products.retrieve(item.price.product);

      const quantity = item.quantity || 1;
      const totalAmount = Number(item.amount_total / 100);

      const payload = {
        userId: userId,
        orderId: commonOrderId,
        productId: product.metadata.productId,
        product_details: {
          name: product.name,
          image: product.images,
        },
        quantity: quantity,
        paymentId: paymentId,
        payment_status: payment_status,
        delivery_address: addressId,
        subTotalAmt: Number((totalAmount / quantity).toFixed(2)),
        totalAmt: totalAmount,
      };

      productList.push(payload);
    }
  }
  console.log("Generated product list for order:", productList);
  return productList;
}
