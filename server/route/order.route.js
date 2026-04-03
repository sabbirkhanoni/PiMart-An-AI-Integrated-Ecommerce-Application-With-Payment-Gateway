import {Router} from 'express';
import express from 'express';
import auth from '../middleware/auth.js';
import { CashOnDeliveryPaymentController, StripePaymentController, ReceiveWebHookFromStripeController, getAllOrderedProductDetailsController } from '../controllers/order.controller.js';

const orderRouter = Router();

orderRouter.post('/cash-on-delivery-payment',auth, CashOnDeliveryPaymentController);
orderRouter.post('/stripe-payment',auth, StripePaymentController);
orderRouter.post('/webhook',express.raw({ type: 'application/json' }), ReceiveWebHookFromStripeController);
orderRouter.get('/order-details', auth, getAllOrderedProductDetailsController);

export default orderRouter;