import React from 'react'

const ProductDisplayDesignCardAdmin = ({ productData }) => {
  return (
    <div className="w-[140px] bg-white p-3 rounded shadow-md flex flex-col items-center gap-2 h-full">
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
    </div>
  );
};



export default ProductDisplayDesignCardAdmin
