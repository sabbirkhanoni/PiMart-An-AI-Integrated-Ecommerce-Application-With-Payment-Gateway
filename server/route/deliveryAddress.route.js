import { addDeliveryAddress } from "../controllers/deliveryAddress.controller.js";
import {Router} from "express";

const deliveryAddressRouter = Router();

deliveryAddressRouter.post("/add", addDeliveryAddress);

export default deliveryAddressRouter;