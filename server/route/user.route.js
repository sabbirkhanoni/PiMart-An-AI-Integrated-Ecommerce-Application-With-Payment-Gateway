
import {Router} from 'express'
import { getUserLoginDetailsController, logoutController, loginController, registerUserController,verifyEmailController, uploadAvatarController, updateUserDetailsController, forgetPasswordController, verifyForgotPasswordOtpController, resetPasswordController, refreshTokenController } from '../controllers/user.controller.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js';

const userRouter = Router();

userRouter.post('/register',registerUserController);
userRouter.post('/verify-email', verifyEmailController);
userRouter.post('/login', loginController);
userRouter.get('/logout',auth,logoutController);
userRouter.put('/upload-avatar',auth,upload.single('avatar'),uploadAvatarController);
userRouter.put('/update-user',auth,updateUserDetailsController);
userRouter.post('/forgot-password',forgetPasswordController);
userRouter.put('/verify-forgot-password-otp',verifyForgotPasswordOtpController);
userRouter.put('/reset-password',resetPasswordController);
userRouter.post('/refresh-token',refreshTokenController);
userRouter.get('/user-details',auth,getUserLoginDetailsController);

export default userRouter;

