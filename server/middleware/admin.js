import UserModel from "../models/user.model.js";

export const admin = async (request,response,next) => {
    try {
        const userId = request.userId;
        if(!userId) {
            return response.status(401).json({
                message: "Unauthorized Access! No userId found",
                error: true,
                success: false,
            });
        }

        const user = await UserModel.findById(userId);
        if(user.role !== 'ADMIN') {
            return response.status(403).json({
                message: "You do not have admin access.",
                error: true,
                success: false,
            });
        }
        next();
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        })
    }
}