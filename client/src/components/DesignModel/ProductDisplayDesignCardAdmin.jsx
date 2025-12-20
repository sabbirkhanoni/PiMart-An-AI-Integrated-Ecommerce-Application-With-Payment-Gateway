import React from 'react'
import EditProductByAdmin from '../ViewPageComponent/EditProductByAdmin';
import { useState } from 'react';

const ProductDisplayDesignCardAdmin = ({ productData, fetchAllProducts }) => {
  const [editPanelOpen, setEditPanelOpen] = useState(false);
  return (
    <div className="w-[150px] md:w-[185px] lg:w-[185px] bg-white p-3 rounded shadow-md flex flex-col items-center gap-2 h-full">
      <div className="w-full h-[100px] flex items-center justify-center">
        <img
          src={productData?.image[0]}
          alt={productData?.name}
          className="max-w-full max-h-full object-contain"
        />
      </div>
      <p className="font-medium text-center text-sm line-clamp-2">
        {productData?.name}
      </p>
      <p className="text-gray-400 text-sm">{productData?.unit}</p>
      <div className='flex w-full justify-between mt-2 space-x-3 py-1'>
        <button className="bg-blue-500 w-full hover:bg-blue-600 text-white text-sm font-semibold py-1 px-2 rounded"
          onClick={() => setEditPanelOpen(true)}>
          Edit
        </button>
        <button className="bg-red-500 w-full hover:bg-red-600 text-white text-sm font-semibold py-1 px-2 rounded">
          Delete
        </button>
      </div>

      {
        editPanelOpen && (
          <EditProductByAdmin productData={productData} close={() => setEditPanelOpen(false)} fetchAllProducts={fetchAllProducts} />
        )
      }
      

    </div>
  );
};



export default ProductDisplayDesignCardAdmin
