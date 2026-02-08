import React from 'react'

const ProductSkeletonCardLoading = () => {
  return (
    <div className= 'border border-gray-300 p-2 lg:p-4 grid min-w-32 lg:max-w-55 gap-3 rounded animate-pulse'>
        <div className='min-h-15 lg:min-h-20 rounded bg-blue-50'>
        </div>
        <div className='bg-blue-50 rounded p-3 w-20'>  
        </div>
        <div className='bg-blue-50 rounded p-3'>  
        </div>
        <div className='bg-blue-50 rounded p-3 w-15'>  
        </div>

        <div className='flex items-center justify-between gap-2'>
            <div className='p-2 lg:p-3 bg-blue-50 rounded w-20'>
            </div>
            <div className='p-2 lg:p-3 bg-blue-50 rounded w-20'>
            </div>
        </div>




    </div>
  )
}

export default ProductSkeletonCardLoading
