import { Router } from "express";
import auth from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";
import {
  createCouponController,
  getAllCouponsAdminController,
  updateCouponController,
  deleteCouponController,
  applyCouponController,
} from "../controllers/coupon.controller.js";

const couponRouter = Router();

couponRouter.post("/create", auth, admin, createCouponController);
couponRouter.get("/get-all", auth, admin, getAllCouponsAdminController);
couponRouter.put("/update", auth, admin, updateCouponController);
couponRouter.delete("/delete", auth, admin, deleteCouponController);
couponRouter.post("/apply", auth, applyCouponController);

export default couponRouter;
