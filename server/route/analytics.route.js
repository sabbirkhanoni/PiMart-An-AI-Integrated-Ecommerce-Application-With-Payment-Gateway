import { Router } from 'express';
import auth from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';
import { 
  getAdminAnalyticsOverview, 
  getAllOrdersForAdmin, 
  updateOrderStatus 
} from '../controllers/analytics.controller.js';

const analyticsRouter = Router();

analyticsRouter.get('/overview', auth, admin, getAdminAnalyticsOverview);
analyticsRouter.get('/all-orders', auth, admin, getAllOrdersForAdmin);
analyticsRouter.put('/update-order-status', auth, admin, updateOrderStatus);

export default analyticsRouter;
