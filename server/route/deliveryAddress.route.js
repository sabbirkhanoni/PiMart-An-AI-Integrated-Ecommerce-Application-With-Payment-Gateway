import { addDeliveryAddress, EditDeliveryAddressController, getAllAddressOfUser } from "../controllers/deliveryAddress.controller.js";
import auth from "../middleware/auth.js";
import {Router} from "express";

const deliveryAddressRouter = Router();

deliveryAddressRouter.post("/add",auth, addDeliveryAddress);
deliveryAddressRouter.get("/all", auth, getAllAddressOfUser);
deliveryAddressRouter.put("/edit", auth, EditDeliveryAddressController);

export default deliveryAddressRouter;