import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  createOrUpdateReviewController,
  getProductReviewsController,
  deleteReviewController,
  toggleLikeReviewController,
} from "../controllers/review.controller.js";

const reviewRouter = Router();

reviewRouter.post("/create", auth, createOrUpdateReviewController);
reviewRouter.get("/product/:productId", getProductReviewsController);
reviewRouter.delete("/:reviewId", auth, deleteReviewController);
reviewRouter.post("/like/:reviewId", auth, toggleLikeReviewController);

export default reviewRouter;
