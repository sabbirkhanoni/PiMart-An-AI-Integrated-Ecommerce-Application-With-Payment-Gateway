import { Router } from "express";
import {SSLCommerzPaymentController, SSLCommerzPaymentSuccessController, SSLCommerzPaymentFailedController, SSLCommerzPaymentCancelController, SSLCommerzIpnController} from "../controllers/SSLCommerzPaymentController.controller.js";
import auth from "../middleware/auth.js";
const sslcommerzRouter = Router();

sslcommerzRouter.post("/sslcommerz-payment", auth, SSLCommerzPaymentController);
sslcommerzRouter.get("/payment-complete/:tran_id", SSLCommerzPaymentSuccessController);
sslcommerzRouter.get("/payment-failed/:tran_id", SSLCommerzPaymentFailedController);
sslcommerzRouter.get("/payment-cancel/:tran_id", SSLCommerzPaymentCancelController);
sslcommerzRouter.post("/payment-ipn", SSLCommerzIpnController);

export default sslcommerzRouter;