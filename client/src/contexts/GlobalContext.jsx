import { createContext, use, useContext, useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxioxToastError";
import { handleAddToCart } from "../store/cart.store";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { calculatePriceWithDiscount } from "../utils/calculatePriceWithDiscount";
import { handleAddAddress } from "../store/deliveryAddressSlice";
import { setOrderDataSet } from "../store/orderedSlice";


export const GlobalContext = createContext(null)

export const useGlobalContext = () => useContext(GlobalContext)

const GlobalContexts = ({children}) => {

    const dispatch = useDispatch();

    const cartProduct = useSelector(state => state?.cart?.cart);
    const [cartWithoutDisTotalPrice, setCartWithoutDisTotalPrice] = useState(0);
    const [savedAmount, setSavedAmount] = useState(0);
    const [cartProductTotalPrice, setCartProductTotalPrice] = useState(0);
    const [cartProductTotalQuantity, setCartProductTotalQuantity] = useState(0);
    const user = useSelector(state => state?.user);

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

    const handleLogoutCartClear = () => {
        dispatch(handleAddToCart([]));
    }

    const fetchUserDeliveryAddress = async() => {
        try {
            const response = await Axios({
                ...SummaryApi.getAllDeliveryAddressOfUser
            })
            const { data : responseData } =response;

            if(responseData.success) {
                dispatch(handleAddAddress(responseData.data));
            }
        } catch (error) {
            AxiosToastError(error);
        }
    }

    const fetchOrderedProducts = async() => {
        try {
            const response = await Axios({
                ...SummaryApi.getAllOrderedProductDetails
            })

            const { data : responseData } = response;

            if(responseData.success) {
                dispatch(setOrderDataSet(responseData.data));
            } else {
                toast.error(responseData.message || "Failed to fetch ordered products.")
            }

        } catch (error) {
            AxiosToastError(error); 
        }
    }

    useEffect(() => {
        fetchCartProducts();
        handleLogoutCartClear();
        fetchUserDeliveryAddress();
        fetchOrderedProducts();
    }, [user]);


    useEffect(() => {
        let totalQuantity = cartProduct.reduce((prev, current) => {
        return prev + current.quantity;
        }, 0);
        setCartProductTotalQuantity(totalQuantity);

        let totalPrice = cartProduct.reduce((prev, current) => {
        return prev + (current.quantity * calculatePriceWithDiscount(current.productId.price, current.productId.discount));
        }, 0);
        setCartProductTotalPrice(totalPrice);

        const withoutDiscountPrice = cartProduct.reduce((prev, current) => {
        return prev + (current.quantity * current.productId.price);
        }, 0);
        setCartWithoutDisTotalPrice(withoutDiscountPrice);

        const saved = withoutDiscountPrice - totalPrice;
        setSavedAmount(saved);

  }, [cartProduct])

    return (
        <GlobalContext.Provider value={{
                fetchCartProducts,
                increaseAndDecreaseQuantityToCartProduct,
                removeCartProduct,
                fetchUserDeliveryAddress,
                cartProductTotalPrice,
                cartProductTotalQuantity,
                cartProduct,
                cartWithoutDisTotalPrice,
                savedAmount,
                user,
                fetchOrderedProducts
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalContexts;