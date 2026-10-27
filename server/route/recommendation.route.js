import { Router } from "express";
import optionalAuth from "../middleware/optionalAuth.js";
import {
  getPersonalizedRecommendationsController,
  getRelatedProductsController,
} from "../controllers/recommendation.controller.js";

const recommendationRouter = Router();

recommendationRouter.get("/personalized", optionalAuth, getPersonalizedRecommendationsController);
recommendationRouter.get("/related/:productId", getRelatedProductsController);

export default recommendationRouter;
