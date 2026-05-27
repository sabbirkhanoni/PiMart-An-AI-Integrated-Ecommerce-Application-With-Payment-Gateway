import { Router } from "express";
import {SSLCommerzPaymentController, SSLCommerzPaymentSuccessController, SSLCommerzPaymentFailedController, SSLCommerzPaymentCancelController, SSLCommerzIpnController} from "../controllers/SSLCommerzPaymentController.controller.js";
import auth from "../middleware/auth.js";
const sslcommerzRouter = Router();

sslcommerzRouter.post("/sslcommerz-payment", auth, SSLCommerzPaymentController);

sslcommerzRouter.route("/payment-complete/:tran_id")
  .get(SSLCommerzPaymentSuccessController)
  .post(SSLCommerzPaymentSuccessController);

sslcommerzRouter.route("/payment-failed/:tran_id")
  .get(SSLCommerzPaymentFailedController)
  .post(SSLCommerzPaymentFailedController);

sslcommerzRouter.route("/payment-cancel/:tran_id")
  .get(SSLCommerzPaymentCancelController)
  .post(SSLCommerzPaymentCancelController);
  
sslcommerzRouter.post("/payment-ipn", SSLCommerzIpnController);

export default sslcommerzRouter;