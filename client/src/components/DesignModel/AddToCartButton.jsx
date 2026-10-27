import { useEffect, useState } from 'react';
import { useGlobalContext } from '../../contexts/GlobalContext';
import Axios from '../../utils/Axios';
import AxiosToastError from '../../utils/AxioxToastError';
import SummaryApi from '../../common/SummaryApi';
import toast, { LoaderIcon } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';

const AddToCartButton = ({
  productData,
  iconSize = 18,
  className = '',
}) => {
  const {
    fetchCartProducts,
    increaseAndDecreaseQuantityToCartProduct,
    removeCartProduct,
  } = useGlobalContext();

  const [loading, setLoading] = useState(false);
  const [checkingCart, setCheckingCart] = useState(false);
  const [cartProductQuantity, setCartProductQuantity] = useState(0);
  const [cartProductId, setCartProductId] = useState();

  // Get all cart products from the redux store
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
      if (responseData.success) {
        toast.success('Product added to cart successfully');
        if (fetchCartProducts) {
          fetchCartProducts();
        }
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleIncreaseCartProductQuantity = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    increaseAndDecreaseQuantityToCartProduct(
      cartProductId,
      cartProductQuantity + 1
    );
  };

  const handleDecreaseCartProductQuantity = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartProductQuantity === 1) {
      removeCartProduct(cartProductId);
    } else {
      increaseAndDecreaseQuantityToCartProduct(
        cartProductId,
        cartProductQuantity - 1
      );
    }
  };

  useEffect(() => {
    const cartChecking = getCartProducts.some(
      (item) => item.productId._id === productData?._id
    );
    setCheckingCart(cartChecking);

    const cartProduct = getCartProducts.find(
      (item) => item.productId._id === productData?._id
    );
    setCartProductQuantity(cartProduct?.quantity || 0);
    setCartProductId(cartProduct?._id);
  }, [getCartProducts, productData]);

  // Check if caller already supplied a fixed height class (e.g. h-8, h-9, h-10, h-11)
  const hasHeight = className && /\bh-\S+/.test(className);
  const heightClass = hasHeight ? '' : 'h-9';

  return (
    <div className="w-full flex items-center justify-center">
      {checkingCart ? (
        <div
          className={`flex w-full rounded-full items-center justify-between bg-orange-500 text-white select-none box-border ${heightClass} ${className}`}
        >
          <button
            type="button"
            onClick={handleDecreaseCartProductQuantity}
            aria-label="Decrease quantity"
            className="text-white p-0 m-0 border-0 bg-transparent flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity shrink-0 leading-none"
          >
            <FaMinusCircle size={iconSize} />
          </button>
          <span className="text-white font-semibold text-center leading-none px-2 shrink-0">
            {cartProductQuantity}
          </span>
          <button
            type="button"
            onClick={handleIncreaseCartProductQuantity}
            aria-label="Increase quantity"
            className="text-white p-0 m-0 border-0 bg-transparent flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity shrink-0 leading-none"
          >
            <FaPlusCircle size={iconSize} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleAddToCartItem}
          className={`bg-blue-500 text-white flex items-center justify-center w-full rounded-full hover:bg-blue-600 transition-all duration-300 cursor-pointer box-border ${heightClass} ${className}`}
        >
          {loading ? (
            <LoaderIcon className="animate-spin" />
          ) : (
            <span className="leading-none text-center">Add to Cart</span>
          )}
        </button>
      )}
    </div>
  );
};

export default AddToCartButton;
