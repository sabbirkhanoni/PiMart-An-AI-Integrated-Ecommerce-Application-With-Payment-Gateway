import {Router} from 'express';
import auth from '../middleware/auth.js';
import { AddProductController , GetAllProductsController, GetProductByCategoryWiseController,GetProductByCategoryAndSubCategoryParamsController} from '../controllers/product.controller.js';

const productRouter = Router();

productRouter.post('/create',auth, AddProductController);
productRouter.post('/get', auth, GetAllProductsController);
productRouter.post('/get-product-by-categorywise', GetProductByCategoryWiseController)
productRouter.post('/get-products-by-categorywise-subcategorywise', GetProductByCategoryAndSubCategoryParamsController)


export default productRouter;