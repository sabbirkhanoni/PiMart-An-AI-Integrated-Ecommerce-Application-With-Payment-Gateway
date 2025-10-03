import {Router} from 'express';
import auth from '../middleware/auth.js';
import { AddSubCatgoryController,GetSubCategoryController, UpdateSubCategoryController, DeleteSubCategoryController } from '../controllers/subCategory.controller.js';

const subCategoryRouter = Router();

subCategoryRouter.post('/create',auth,AddSubCatgoryController);
subCategoryRouter.get('/get',auth,GetSubCategoryController);
subCategoryRouter.put('/update',auth,UpdateSubCategoryController);
subCategoryRouter.delete('/delete',auth,DeleteSubCategoryController);

export default subCategoryRouter;