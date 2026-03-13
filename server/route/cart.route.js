import { Router } from "express";
import auth from "../middleware/auth.js";
import { AddProductToCartController, GetAllCartProducts, RemoveProductFromCartController, UpdateCartProductQuantityController } from "../controllers/cart.controller.js";


const cartRouter = Router();

cartRouter.post("/add",auth, AddProductToCartController)
cartRouter.get("/get", auth, GetAllCartProducts)
cartRouter.put("/update", auth, UpdateCartProductQuantityController)
cartRouter.delete("/delete", auth, RemoveProductFromCartController)

export default cartRouter;