import { Router } from "express";
import auth from "../middleware/auth.js";
import { AddProductToCartController, GetAllCartProducts } from "../controllers/cart.controller.js";


const cartRouter = Router();

cartRouter.post("/add",auth, AddProductToCartController)
cartRouter.get("/get", auth, GetAllCartProducts)

export default cartRouter;