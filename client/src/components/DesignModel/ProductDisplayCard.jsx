import React from 'react'
import { DisplayPriceInBDT } from '../../utils/DisplayPriceInBDT'
import { URLvalidation } from '../../utils/URLValidation';
import { Link } from 'react-router-dom';

const ProductDisplayCard = ({ productData }) => {

  const URL = `/product/${URLvalidation(productData?.name)}-${URLvalidation(productData?._id)}`;
  return (
    <Link to={URL}>
        <div className= 'lg:h-[380px] h-[300px] lg:w-[350px] border border-gray-200 p-2 lg:p-4 lg:space-y-3 grid max-w-56.5 w-[172px] rounded shadow-lg overflow-hidden'>
            <div className='min-h-25 lg:min-h-20 max-h-15 lg:max-h-32 rounded'>
              <img 
                src={productData?.image[0]}
                alt={productData?.name}
                className="w-full h-full object-scale-down scale-125"
                />
            </div>
            <div className='bg-blue-200/70 text-sm flex items-center text-center justify-center mx-auto w-fit mt-5 px-2 text-blue-600 rounded-full'>  
              10 unit
            </div>
            <div className='font-medium text-ellipsis my-2 line-clamp-2 text-md'>  
              {productData?.name}
            </div>
            <div className='flex items-center justify-between gap-2'>
              <div className=''>  
              {productData?.unit}
              </div>
              <div className='font-bold text-lg text-green-600'>
                    {DisplayPriceInBDT(productData?.price)}
              </div>
            </div>

            <div className='flex items-center justify-between gap-2 font-semibold'>
                
                <div className='w-full'>
                  <button
                    className='bg-blue-500 text-white p-1 px-4 lg:px-6 w-full rounded-full hover:bg-blue-600 transition-all duration-300'
                  >Cart
                  </button>
                </div>
            </div>
        </div>
    </Link>
  )
}

export default ProductDisplayCard
