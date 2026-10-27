import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  toggleWishlistController,
  getWishlistItemsController,
  checkInWishlistController,
} from "../controllers/wishlist.controller.js";

const wishlistRouter = Router();

wishlistRouter.post("/toggle", auth, toggleWishlistController);
wishlistRouter.get("/all", auth, getWishlistItemsController);
wishlistRouter.get("/check/:productId", auth, checkInWishlistController);

export default wishlistRouter;
