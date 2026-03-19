import React, { useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import { useGlobalContext } from '../../contexts/GlobalContext';
import { calculatePriceWithDiscount } from '../../utils/calculatePriceWithDiscount';
import { DisplayPriceInBDT } from '../../utils/DisplayPriceInBDT';
import { useSelector } from 'react-redux';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';
import AddToCartButton from './AddToCartButton';
import NotFoundImage from '../../assets/no-data.png';

const CartModel = ({close}) => {

  const { cartProductTotalPrice,cartWithoutDisTotalPrice, savedAmount, cartProductTotalQuantity} = useGlobalContext();
  const cartProduct = useSelector(state => state.cart.cart);

  return (
    <section
      className='bg-natural-900/50 backdrop-blur-sm fixed top-0 left-0 w-full h-screen z-50'>
        <div className='bg-white border border-gray-300 max-w-sm min-h-screen ml-auto w-full'>
            <div className='flex items-center justify-between shadow-2xl p-4 border-b border-gray-300 font-semibold bg-blue-500 text-white'>
                <h3 className=''>Your Cart</h3>
                <Link to="/" className='hover:bg-blue-600 p-1 rounded-full lg:hidden transition-colors duration-300 cursor-pointer'>
                    <IoClose size={22}/>
                </Link>
                <button
                className='hover:bg-blue-600 p-1 rounded-full hidden lg:block transition-colors duration-300 cursor-pointer'
                    onClick={() => close(false)}
                >
                    <IoClose size={22}/>
                </button>
            </div>


            <div className='min-h-[56vh] max-h-[calc(100vh-210px)] h-full overflow-auto p-2'>
              {
                cartProduct[0] ? (
                    <div className='grid gap-1 bg-white rounded-lg p-2'>
                    {
                      cartProduct[0] && (
                        cartProduct.map((product,index) => {
                          return (
                            <>
                              <div key={index} className='border border-gray-200 rounded p-3 flex items-center gap-3'>
                                <div className='w-18 h-18 min-h-18 min-w-18'>
                                  <img
                                    src={product?.productId.image[0]}
                                    alt={product?.productId.name}
                                    className='w-full h-full object-scale-down'
                                />
                                </div>
                                <div className='w-full'>
                                <h4 className='font-semibol text-ellipsis line-clamp-1'>{product?.productId.name}</h4>
                                <p className='text-sm text-gray-600 font-semibold'>Price: <span className='text-blue-600 font-bold'>{DisplayPriceInBDT(calculatePriceWithDiscount(product?.productId.price, product?.productId.discount))}</span></p>
                                <div className='text-sm text-gray-600 flex justify-between gap-2'>

                                  <div className='flex items-center gap-1'>
                                    <p>Quantity: </p>
                                    <span className='font-bold text-indigo-600'>
                                      {product?.quantity}
                                    </span>
                                  </div>

                                  <div>
                                    <AddToCartButton productData={product?.productId} iconSize={15} className="px-2 py-1 space-x-3" />
                                  </div>
                    
                                </div>
                                </div>
                              </div>
                            </>
                        )
                      })
                    )
                    }
                    </div>
                ) : (
                    <div className='flex flex-col items-center gap-4 justify-center h-full'>
                      <img src={NotFoundImage} alt="Empty Cart" className='w-full h-full object-contain' />
                      <h4 className='text-lg font-semibold'>Your cart is empty</h4>
                    </div>
                )
              }
            </div>

            {
              cartProduct[0] && (
                <div className='flex border border-gray-200 pt-2 flex-col gap-2 px-4'>
                <div className='flex items-center justify-between text-sm text-gray-600'>
                  <span>Subtotal:</span>
                  <span className='font-semibold line-through'>{DisplayPriceInBDT(cartWithoutDisTotalPrice)}</span>
                </div>
                <div className='flex items-center justify-between text-sm text-gray-600'>
                  <span>Discount:</span>
                  <span className='font-semibold'>{DisplayPriceInBDT(savedAmount)}</span>
                </div>
                <div className='flex items-center text-gray-500 py-1 justify-between text-sm'>
                  <span>Total Product Quantity:</span>
                  <span className='font-semibold'>{cartProductTotalQuantity} pcs</span>
                </div>
                <div className='flex items-center text-gray-500 justify-between text-sm'>
                  <span>Delivery Charge</span>
                  <span className='font-semibold'>Free</span>
                </div>
                <div className='flex items-center text-gray-500 justify-between text-sm font-semibold rounded'>
                  <span>Total:</span>
                  <span className='font-semibold'>{DisplayPriceInBDT(cartProductTotalPrice)}</span>
                </div>
                 <div className='flex items-center bg-amber-600 text-white py-1 px-1 justify-between text-sm font-semibold rounded'>
                  <span>Grand Total:</span>
                  <span className='font-semibold'>{DisplayPriceInBDT(cartProductTotalPrice)}</span>
                </div>
                
                <button className='text-white bg-blue-500 p-2 rounded-full hover:bg-blue-600 transition-colors duration-300'>
                  Proceed to Checkout
                </button>
                </div>
              )
            }

            
        </div>
    </section>
  )
}

export default CartModel
