import React, { useState } from 'react'
import { useGlobalContext } from '../contexts/GlobalContext';
import { DisplayPriceInBDT } from '../utils/DisplayPriceInBDT';
import { useNavigate } from 'react-router-dom';
import AddressForm from '../components/ViewPageComponent/AddressForm';


const ProceedPage = () => {

    const { cartProductTotalPrice,cartWithoutDisTotalPrice, savedAmount, cartProductTotalQuantity} = useGlobalContext();
    const [openAddressFormModel, setOpenAddressFormModel] = useState(false);

  return (
    <section className='bg-white'>
        <div className='container mx-auto p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4'>

            <div className=''>
                <h2 className='p-2 rounded mb-4 text-gray-600 border border-gray-300 text-center'>Set Delivery Address</h2>
                <div onClick={() => setOpenAddressFormModel(true)} className='py-2 cursor-pointer w-full rounded-full bg-blue-500 text-white text-center'>
                    Set up your delivery address
                </div>
            </div>

            <div className=''>
                <h2 className='p-2 rounded mb-4 text-gray-600 border border-gray-300 text-center'>Billing & Payment Method</h2>
                <div>
                    Payment form will be here
                </div>
                <div>
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
                    <div className='grid grid-cols-2 items-center justify-center gap-4 mt-2 pb-4'>
                        <button className='text-white bg-cyan-800 cursor-pointer p-2 rounded-full hover:bg-green-600 transition-colors duration-300'>
                            Cash on Delivery
                        </button>
                        <button className='text-white bg-blue-500 cursor-pointer p-2 rounded-full hover:bg-green-600 transition-colors duration-300'>
                            Pay with Card
                        </button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        {
            openAddressFormModel && (
                <AddressForm close={() => setOpenAddressFormModel(false)} />
            )
        }
    </section>
  )
}

export default ProceedPage
