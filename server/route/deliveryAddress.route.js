import { addDeliveryAddress } from "../controllers/deliveryAddress.controller.js";
import auth from "../middleware/auth.js";
import {Router} from "express";

const deliveryAddressRouter = Router();

deliveryAddressRouter.post("/add",auth, addDeliveryAddress);

export default deliveryAddressRouter;