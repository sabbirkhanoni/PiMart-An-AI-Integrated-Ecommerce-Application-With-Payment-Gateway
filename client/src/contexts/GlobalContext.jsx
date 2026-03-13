import { createContext, use, useContext, useEffect } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxioxToastError";
import { handleAddToCart } from "../store/cart.store";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

export const GlobalContext = createContext(null)

export const useGlobalContext = () => useContext(GlobalContext)

const GlobalContexts = ({children}) => {

    const dispatch = useDispatch();

    //when user login then also fetch the cart products to show in the header
    const fetchCartProducts = async () => {
        try {
        const response = await Axios({
            ...SummaryApi.getCartProducts,
        })
        const { data: responseData } = response;

        // here we are doing a check if the response is success then only we are dispatching the action to add the products to the cart
        if(responseData.success) {
            dispatch(handleAddToCart(responseData.data))
        }

        } catch (error) {
            AxiosToastError(error);
        }
    };

    const increaseAndDecreaseQuantityToCartProduct = async (id, qty) => {
        try {
            const response = await Axios({
                ...SummaryApi.updateCartProduct,
                data : {
                    _id : id,
                    quantity : qty
                }
            })

            const { data : responseData } = response;

            if (responseData.success) {
                toast.success(responseData.message);
                fetchCartProducts();
            }

        } catch (error) {
            AxiosToastError(error);
        }
    }

    const removeCartProduct = async (id)  => {
        try {
            const response = await Axios({
                ...SummaryApi.deleteCartProduct,
                data : {
                    _id : id
                }
            })

            const { data : responseData } = response;

            if (responseData.success) {
                toast.success(responseData.message);
                fetchCartProducts();
            }
        } catch (error) {
            AxiosToastError(error);
        }
    }

    useEffect(() => {
        fetchCartProducts();
    }, []);

    return (
        <GlobalContext.Provider value={{
                fetchCartProducts,
                increaseAndDecreaseQuantityToCartProduct,
                removeCartProduct
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalContexts;