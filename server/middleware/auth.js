import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

const auth = async(request,response,next) => {

    try {
        const token = request.cookies.accessToken || request?.headers?.authorization?.split(" ")[1]
        
        if(!token){
            return response.status(401).json({
                message : "Please Login to Access this Resource",
                error : true,
                success : false
            })
        }

        const secret = process.env.SECRET_KEY_ACCESS_TOKEN;
        if(!secret) {
            console.error('Missing SECRET_KEY_ACCESS_TOKEN in environment variables');
            return response.status(500).json({
                message : "Server configuration error",
                error : true,
                success : false
            })
        }

        //decode the token
        const decode = await jwt.verify(token,process.env.SECRET_KEY_ACCESS_TOKEN)

        if(!decode){
            return response.status(402).json({
                message : "Unauthorized Access, Access Denied",
                error : true,
                success : false
            })
        }

        request.userId = decode.id

        next();

    } catch (error) {
        return response.status(500).json({
            message : "Internal Server Error" || error.message || error,
            error : true,
            success : false
        })
    }
}

export default auth;