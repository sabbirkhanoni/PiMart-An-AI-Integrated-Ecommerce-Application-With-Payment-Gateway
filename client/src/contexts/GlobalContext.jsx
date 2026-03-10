import { createContext, use, useContext, useEffect } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxioxToastError";
import { handleAddToCart } from "../store/cart.store";
import { useDispatch } from "react-redux";

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

    useEffect(() => {
        fetchCartProducts();
    }, []);

    return (
        <GlobalContext.Provider value={{
                fetchCartProducts
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalContexts;