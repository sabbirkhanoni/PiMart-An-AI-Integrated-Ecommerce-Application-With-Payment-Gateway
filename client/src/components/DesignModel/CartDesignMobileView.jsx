import React from 'react'
import { FaShoppingCart } from 'react-icons/fa'
import { useGlobalContext } from '../../contexts/GlobalContext';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CartDesignMobileView = () => {

    const {cartProductTotalPrice, cartProductTotalQuantity} = useGlobalContext();
    const cartProduct = useSelector(state => state.cart.cart);

    return (
        <Link to="/cart">
         {
            cartProduct.length > 0 && (
                <div className="fixed bottom-5 right-5 z-50">
                    <div className="relative">
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-sm font-bold px-1.5 rounded-full">
                        {cartProductTotalQuantity}
                    </span>
                    </div>
                    <button className="bg-blue-500 text-white p-4 rounded-full">
                        <FaShoppingCart size={23} />
                    </button>
                </div>
            )
         }
        </Link>
    )
}

export default CartDesignMobileView
