
import {Router} from 'express'
import { 
    getUserLoginDetailsController, 
    logoutController, 
    loginController, 
    registerUserController,
    verifyEmailController, 
    uploadAvatarController, 
    updateUserDetailsController, 
    forgetPasswordController, 
    verifyForgotPasswordOtpController, 
    resetPasswordController, 
    refreshTokenController,
    getAllUsersAdminController,
    updateUserStatusAdminController,
    updateUserRoleAdminController
} from '../controllers/user.controller.js';
import auth from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';
import upload from '../middleware/multer.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const userRouter = Router();

userRouter.post('/register', authLimiter, registerUserController);
userRouter.post('/verify-email', verifyEmailController);
userRouter.post('/login', authLimiter, loginController);
userRouter.get('/logout', auth, logoutController);
userRouter.put('/upload-avatar', auth, upload.single('avatar'), uploadAvatarController);
userRouter.put('/update-user', auth, updateUserDetailsController);
userRouter.post('/forgot-password', authLimiter, forgetPasswordController);
userRouter.put('/verify-forgot-password-otp', authLimiter, verifyForgotPasswordOtpController);
userRouter.put('/reset-password', authLimiter, resetPasswordController);
userRouter.post('/refresh-token', refreshTokenController);
userRouter.get('/user-details', auth, getUserLoginDetailsController);

// Admin User Management Routes
userRouter.get('/admin/all-users', auth, admin, getAllUsersAdminController);
userRouter.put('/admin/update-status', auth, admin, updateUserStatusAdminController);
userRouter.put('/admin/update-role', auth, admin, updateUserRoleAdminController);

export default userRouter;

