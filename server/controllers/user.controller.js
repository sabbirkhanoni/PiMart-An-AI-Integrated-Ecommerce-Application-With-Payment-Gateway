import sendEmail from '../config/sendEmail.js';
import UserModel from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js'
import generateAccessToken from '../utils/generateAccessToken.js';
import generateRefreshToken from '../utils/generateRefreshToken.js';
import uploadImageCloudinary from '../utils/uploadImageCloudinary.js';
import generatedOtp from '../utils/generatedOtp.js';
import forgotPasswordTemplate from '../utils/forgetPasswordTemplate.js';
import jwt from 'jsonwebtoken'


export async function registerUserController(request,response){
    try{
        const {name,email,password} = request.body

        //check name,email,password are given or not, if not then response error
        if(!name || !email ||!password){
            return response.status(400).json({
                message : "Please Provide Your Email or Name or Password Properly",
                error : true,
                success : false
            })
        }

        //check email exist or not in database
        const user = await UserModel.findOne({email});
        
        if(user){
            //if esist
            return response.json({
                message : "Email Are Already Exist",
                error : true,
                success : false
            })
        }

        //if not exist that's mean new user and have to save it into database
        //Now You Can Save The Details In Database.
        //But Before Save details into Database bcrypt the password

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password,salt)

        const payload = {
            name,
            email,
            password : hashPassword
        }

        const newUser = new UserModel(payload);
        const save = await newUser.save();

        //create varify email URL which help the new user to verify
        const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code = ${save?._id}`

        //now I want to varify the Email.
        const varifyEmail = await sendEmail({
            sendTo : email,
            subject : "Verify Email from PiMart",
            html : verifyEmailTemplate({
                name,
                url : VerifyEmailUrl
            })
        })

        //send response to frontend
        return response.json({
            message : "User Register Successfully",
            error : false,
            success : true,
            data : save
        })

    }catch(error){
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


//After getting Email and Redirect to verify page, then update the verify_status : true; 
export async function verifyEmailController(request,response) {
    try{

        //get code
        const {code} = request.body;

        //check with _id
        const user = await UserModel.findOne({_id : code})

        if(!user){
            return response.status(400).json({
                message : "Invalid Code",
                error : true,
                success : false
            })
        }

        const updateUsersVerifyingStatus = await UserModel.updateOne({ _id : code},{
            verify_email : true
        })

        return response.json({
            message : "Congratulations! You are now Varified",
            error : false,
            success : true
        })
    }catch(error){
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
    
}


//login controller
export async function loginController(request,response){
    try {
        const {email , password } = request.body

        if(!email || !password){
            return response.status(400).json({
                message : "Please Provide Email or Password Properly",
                error : true,
                success : false
            })
        }

        //for checking email exist or not(user got details from database)
        const user = await UserModel.findOne({email})
        if(!user){
            return response.status(400).json({
                message : "User Not Registered",
                error: true,
                success : false
            })
        }

        //check Account Status is it Active Or Inactive Or Suspended
        if(user.status !== "Active"){
            return response.status(400).json({
                message : "Contact To PiMart Administration",
                error : true,

            })
        }


        //check given password by user, is it match with database's password of that user?
        //before matching I have de decript(decryption) the password.

        const checkPassword = await bcryptjs.compare(password,user.password);

        if(!checkPassword){
            return response.status(400).json({
                message : "Please Check Your Password",
                error : true,
                success : false
            })
        }

        //If user enter valid Passsword generate Access and Refresh Token
        const accesstoken = await generateAccessToken(user._id);
        const refreshtoken = await generateRefreshToken(user._id);

        //update user login time in database
        const updateUser = await UserModel.findByIdAndUpdate(user._id,{
            last_login_date : new Date(),
        })

        //accesstoken and refreshtoken are generated successfully 
        //now send them to cookies
        //before sending create cookiesOption
        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }

        response.cookie('accessToken',accesstoken,cookiesOption);
        response.cookie('refreshToken',refreshtoken,cookiesOption)

        //now user can log in successfully
        return response.json({
            message : "Login Successfully",
            error : false,
            success : true,
            data : {
                accesstoken,
                refreshtoken
            }
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error.message,
            error : true,
            success : false
        })
    }
}


//logout controller
export async function logoutController(request,response) {
    try {

        const userid = request.userId; //which is coming form middleware
        //clear accessToken and refreshToken from cookie when user logout
        //but before clear create cookieOption as you create when login
    
        const cookieOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None",
        }

        response.clearCookie("accessToken",cookieOption)
        response.clearCookie("refreshToken",cookieOption)

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userid,{
            refresh_token : ""
        })
        //clear done
        //now send reponse
        return response.json({
            message : "Logout Successfully",
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
    
}


//upload user avatar
export async function uploadAvatarController(request,response){
    try {

        const userId = request.userId //auth middleware
        //recieve file from local machine's request.file
        const image = request.file //multer middleware

        //get buffer using a middleware
        const upload = await uploadImageCloudinary(image);

        //update the database of avatar
        const updateUser = await UserModel.findByIdAndUpdate(userId,{
            avatar : upload.url
        })
        //send response
        return response.json({
            message : "Profile Avatar Uploaded Successfully",
            success : true,
            error : false,
            data : {
                _id : userId,
                avatar : upload.url
            }
        })

    } catch (error) {
        return response.json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


//upload user details(name,email,password,mobile) when he is login
export async function updateUserDetailsController(request,response){
    try {
        const userId = request.userId; //auth middleware (which help to find which user and is he authorize user or not)
        const {name, email, mobile , password } = request.body

        let hashPassword = "";
        if(password){
            const salt = await bcryptjs.genSalt(10)
            hashPassword = await bcryptjs.hash(password,salt)
        }
        //when updateing if availabel then update it, so in this case I have to spread technique
        const updateUser = await UserModel.updateOne({_id : userId},{
            ...(name && {name : name}),
            ...(email && {email : email}),
            ...(mobile && {mobile : mobile}),
            ...(password && {password : hashPassword})
        })

        return response.json({
            message :"Name or Email or Mobile or Password Update Successfully",
            erro : false,
            success : true,
            data : updateUser
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


export async function forgetPasswordController(request,response){
    try {
        //take email from user(request.body)
        const {email} = request.body

        //check in database the email exist in database or not
        const user = await UserModel.findOne({email})
        if(!user){
            return response.status(400).json({
                message : "This Email is Not Exist, Try again",
                error : true,
                success : false
            })
        }

        //if exixt in database
        //first of all generate OTP code in utils folder
        const otp = generatedOtp()
        const expireTime = new Date() + 1000 * 60 * 60; //1hr
        //save the forget password otp and forget password expiry time in database

        const update = await UserModel.findByIdAndUpdate(user._id,{
            forgot_password_otp : otp,
            forgot_password_expiry : new Date(expireTime).toISOString()
        })

        //after save into database now send email
        await sendEmail({
            sendTo : email,
            subject : "Forgot Password OTP from PiMart",
            html : forgotPasswordTemplate({
                name : user.name,
                otp : otp
            }),

        })



        //send response to client or user or frontend
        return response.json({
            message : "Please Check Your Email",
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


//verify forgot password otp
export async function verifyForgotPasswordOtpController(request,response){
    try {
        //get email and otp from client site
        const {email, otp } =request.body
        //check email and otp are give by user are not
        if(!email || !otp){
            return response.status(400).json({
                message : "Please Provide Email and OTP",
                error : true,
                success : false
            })
        }
        //check Email Exist in database or not
        const user = await UserModel.findOne({email})
        if(!user){
            return response.status(500).json({
                message : "Email is not Exist, Please Try Again",
                error : true,
                success : false
            })
        }

        //check otp expired or not
        //check that user's forgot_password_expiry 's current time
        
        const currentTime = new Date().toISOString()

        const sendingTime = user.forgot_password_expiry
        if( sendingTime < currentTime){
            return response.status(400).json({
                message : "Your OTP is Expired, Request Again",
                error : true,
                success : false
            })
        }

        //now Check is OTP is Match with forgot_password_otp
        //which is available in that user's database collection

        const realOTP = user.forgot_password_otp
        if(otp !== realOTP){
            return response.status(400).json({
                message : "Invalid OTP",
                error : true,
                success : false
            })
        }

        //now otp is not expired
        //and otp === user_forgot.password_otp

        //remove the otp and expiry time from database after verified
        const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
            forgot_password_otp : "",
            forgot_password_expiry : ""
        })

         
        return response.status(200).json({
            message : "OTP Verified Successfully",
            error : false,
            success : true
        })


    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


//reset the password
export async function resetPasswordController(request,response) {
    try {
        const {email, newPassword, confirmPassword} = request.body
        
        //check email and new password and confirm password are properly given or not
        if(!email && !newPassword && !confirmPassword){
           return response.status(400).json({
                message : "Please Provide Email and New Password and Confirm Password",
                error : true,
                success : false
                
            })
        }

        //check user is available or not in database
        const user = await UserModel.findOne({email})
        if(!user){
            return response.status(400).json({
                message : "Email is not Available",
                error : true,
                success : false
            })
        }

        //check new Password and confirm passsword are same or not
        if(newPassword !== confirmPassword){
            return response.status(400).json({
                message : "New Password and Confirm Password are not same",
                error : true,
                success : false
            })
        }

        //now you can save the password in the database
        //before the passsword are saved in database I have to convert the plane password to hash password
        //using bcrypjs
        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(newPassword,salt)

        

        //Now saved in database
        const update = await UserModel.findByIdAndUpdate(user._id,{
            password : hashPassword
        })

        //send response to client
        return response.json({
            message : "Password Updated Successfully",
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


//using refresh token extend the access token's life time
export async function refreshTokenController(request,response){
    try {
        //get refresh token from cookies
        const refreshToken = request.cookies.refreshToken || request?.headers?.authorization?.split(" ")[1] //for mobile version
        //check refeshToken comming or not
        if(!refreshToken){
            return response.status(401).json({
                message : "Invalid Token",
                error : true,
                success : false
            })
        }
        

        //check refresh token is expired or not
        const verifyToken = await jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN)

        if(!verifyToken){
            return response.status(401).json({
                message : "Token is Expired",
                error : true,
                success : false
            })
        }

        //Now That's mean token is not expired
        //Now Generate a new access token and send to client site

        //before generate access token, get userId of that user
        const userId = verifyToken?.id

        //generate newAccessToken
        const newAccessToken = await generateAccessToken(userId);
        
        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }
        //send to cookies but before sending create cookiesOption
        response.cookie('accessToken',newAccessToken,cookiesOption)
        
        return response.json({
            message : "New Token is Generated",
            error : false,
            success : true,
            data : {
                accessToken : newAccessToken
            }
        })


    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


//get login user details except password and refresh_token
export async function getUserLoginDetailsController(request,response){
    try {
        const userId = request.userId //auth middleware
        //get user details
        const user = await UserModel.findById(userId).select("-password -refresh_token")
        return response.json({
            message : "Got User Details",
            error : false,
            success : true,
            data : user
        })
    }
    catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}
