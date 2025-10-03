import {Router} from 'express';
import auth from '../middleware/auth.js';
import { AddCategoryController,GetAllCategoriesController, UpdateCategoryController, DeleteCategoryController } from '../controllers/category.controller.js';

const categoryRouter = Router();

categoryRouter.post('/create',auth,AddCategoryController);
categoryRouter.get('/get',auth,GetAllCategoriesController);
categoryRouter.put('/update',auth,UpdateCategoryController);
categoryRouter.delete('/delete',auth,DeleteCategoryController);

export default categoryRouter;