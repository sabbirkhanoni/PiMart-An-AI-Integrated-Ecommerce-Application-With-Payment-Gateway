import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../../contexts/GlobalContext';
import Axios from '../../utils/Axios';
import AxiosToastError from '../../utils/AxioxToastError';
import SummaryApi from '../../common/SummaryApi';
import toast, { LoaderIcon } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { FaMinusCircle } from "react-icons/fa";
import { FaPlusCircle } from "react-icons/fa";

const AddToCartButton = ({ productData }) => {

  const { fetchCartProducts, increaseAndDecreaseQuantityToCartProduct, removeCartProduct } = useGlobalContext();

  const [loading, setLoading] = useState(false);
  const [checkingCart, setCheckingCart] = useState(false);
  const [cartProductQuantity, setCartProductQuantity] = useState(0);
  const [cartProductId, setCartProductId] = useState();

  //get all cart products from the redux store to check if the product is already in the cart or not, if it is already in the cart then we will show the quantity update + - instead of add to cart button
  const getCartProducts = useSelector((state) => state.cart.cart);

  const handleAddToCartItem = async (e) => {
      e.preventDefault();
      e.stopPropagation();

      try {
        setLoading(true);
        const response = await Axios({
          ...SummaryApi.addProductToCart,
          data: {
            productId: productData?._id,
          },
        });

        const { data: responseData } = response;
        if(responseData.success) {
          toast.success("Product added to cart successfully");
          if(fetchCartProducts) {
            fetchCartProducts();
          }
        }
      } catch (error) {
        AxiosToastError(error);
      } finally {
        setLoading(false);
      }

  }

  const handleIncreaseCartProductQuantity = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    increaseAndDecreaseQuantityToCartProduct(cartProductId, cartProductQuantity + 1);
  }

  const handleDecreaseCartProductQuantity = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if(cartProductQuantity === 1) {
      // if the quantity is 1 and user click on decrease button then will remove the product from the cart
      removeCartProduct(cartProductId);
    }else {
      increaseAndDecreaseQuantityToCartProduct(cartProductId, cartProductQuantity - 1);
    }
  }


  useEffect(() => {
    const cartCheking = getCartProducts.some(item => item.productId._id === productData?._id);
    setCheckingCart(cartCheking);

    const cartProduct = getCartProducts.find(item => item.productId._id === productData?._id);
    setCartProductQuantity(cartProduct?.quantity || 0);
    setCartProductId(cartProduct?._id);
    
  }, [getCartProducts, productData]);


  return (
    <div className='w-full rounded-full flex items-center justify-center'>
      {
        checkingCart ? (
          <div className='flex w-full rounded-full py-[4px] items-center justify-between px-5 bg-orange-500'>
            <button
              onClick={handleDecreaseCartProductQuantity}
              className='text-white font-bold rounded-full w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-gray-400 transition-all duration-300'>
              <FaMinusCircle size={20} />
            </button>
            <span className='text-white'>{cartProductQuantity}</span>
            <button
              onClick={handleIncreaseCartProductQuantity}
              className='text-white font-bold rounded-full w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-gray-400 transition-all duration-300'>
              <FaPlusCircle size={20} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCartItem}
            className={`bg-blue-500 text-white flex items-center justify-center p-1 px-4 lg:px-6 w-full rounded-full hover:bg-blue-600 transition-all duration-300`}>
            {loading ? <LoaderIcon className='animate-spin py-2' /> : "Add to Cart"}
          </button>
        )
      }
    </div>
  )
}

export default AddToCartButton
