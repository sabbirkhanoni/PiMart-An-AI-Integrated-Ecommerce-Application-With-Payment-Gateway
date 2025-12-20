import {Router} from 'express';
import auth from '../middleware/auth.js';
import { AddProductController , GetAllProductsController, GetProductByCategoryWiseController,GetProductByCategoryAndSubCategoryParamsController, GetSingleProductDetailsController, UpdateProductController} from '../controllers/product.controller.js';
import { admin } from '../middleware/admin.js';

const productRouter = Router();

productRouter.post('/create',auth, admin, AddProductController);
productRouter.post('/get', auth, GetAllProductsController);
productRouter.post('/get-product-by-categorywise', GetProductByCategoryWiseController)
productRouter.post('/get-products-by-categorywise-subcategorywise', GetProductByCategoryAndSubCategoryParamsController)
productRouter.post('/get-product-details', GetSingleProductDetailsController);
productRouter.put('/update-product',auth,admin,UpdateProductController);

export default productRouter;