import { Router } from "express";
import auth from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";
import {
  createBannerController,
  getAllBannersAdminController,
  getActiveBannersPublicController,
  updateBannerController,
  deleteBannerController,
} from "../controllers/banner.controller.js";

const bannerRouter = Router();

bannerRouter.post("/create", auth, admin, createBannerController);
bannerRouter.get("/get-all-admin", auth, admin, getAllBannersAdminController);
bannerRouter.get("/get-active", getActiveBannersPublicController);
bannerRouter.put("/update", auth, admin, updateBannerController);
bannerRouter.delete("/delete", auth, admin, deleteBannerController);

export default bannerRouter;
