import CartProductModel from "../models/cartproduct.model.js";
import UserModel from "../models/user.model.js";

export const AddProductToCartController = async (request, response) => {
    try {
        const userId = request.userId;
        const { productId } = request.body;

        if (!productId) {
            return response.status(400).json({
                message: "Product ID is required",
                error: true,
                success: false,
            });
        }

        const existingCartProduct = await CartProductModel.findOne({
            userId: userId,
            productId: productId
        });

        if (existingCartProduct) {
            return response.status(400).json({
                message: "Product already exists in cart",
                error: true,
                success: false,
            });
        }

        const cartProductData = new CartProductModel({
            userId: userId,
            quantity: 1,
            productId: productId,
        });

        // Save the cart product data to the database
        const savedCartProduct = await cartProductData.save();

        const updateUserCart = await UserModel.findOneAndUpdate({_id: userId}, {
            $push: {
                shopping_cart: productId
            },
        });

        if (updateUserCart) {
            return response.status(200).json({
                message: "Product added to cart",
                error: false,
                success: true,
                data : savedCartProduct
            });
        }

    } catch (error) {
        return response.status(500).json({
            message: "Error in adding product to cart",
            error: true,
            success: false,
        })
    }
}

export const GetAllCartProducts = async (request, reponse) => {
    try {
        const userId = request.userId

        const cartProducts = await CartProductModel.find({
            userId : userId
        }).populate("productId");

        return reponse.status(200).json({
            message: "Cart products retrieved successfully",
            error: false,
            success: true,
            data: cartProducts
        });

    } catch (error) {
        return reponse.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        })
    }
}

export const UpdateCartProductQuantityController = async (request, response) => {
    try {

        const userId = request.userId
        const { _id, quantity } = request.body

        if(!_id || quantity === undefined){
            return response.status(400).json({
                message: "Cart product ID and quantity are required",
                error: true,
                success: false
            })
        }

        // // quantity 0 → delete item
        // if(quantity === 0){
        //     await CartProductModel.deleteOne({
        //         _id: _id,
        //         userId: userId
        //     })

        //     return response.status(200).json({
        //         message: "Product removed from cart",
        //         error: false,
        //         success: true
        //     })
        // }

        const updateCartProduct = await CartProductModel.updateOne(
            { _id: _id, userId: userId },
            { quantity: quantity }
        )

        return response.status(200).json({
            message: "Cart updated successfully",
            error: false,
            success: true,
            data: updateCartProduct
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const RemoveProductFromCartController = async (request, response) => {
    try {

        const userId = request.userId;
        const { _id } = request.body;

        if(!_id){
            return response.status(400).json({
                message: "Cart ID required",
                error: true,
                success: false
            })
        }

        const deleteResult = await CartProductModel.deleteOne({
            _id: _id,
            userId: userId
        })

        return response.status(200).json({
            message: "Product removed from cart",
            success: true,
            error: false
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        })
    }
}
