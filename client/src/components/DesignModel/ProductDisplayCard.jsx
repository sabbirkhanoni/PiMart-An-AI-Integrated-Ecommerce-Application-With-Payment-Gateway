import React from "react";
import { DisplayPriceInBDT } from "../../utils/DisplayPriceInBDT";
import { URLvalidation } from "../../utils/URLValidation";
import { Link } from "react-router-dom";
import { calculatePriceWithDiscount } from "../../utils/calculatePriceWithDiscount";

const ProductDisplayCard = ({ productData }) => {
  const URL = `/product/${URLvalidation(productData?.name)}-${URLvalidation(
    productData?._id
  )}`;
  return (
    <Link to={URL}>
      <div className="lg:h-[400px] w-[175px] h-[310px] lg:w-[350px] border border-gray-200 p-2 lg:p-4 lg:space-y-3 grid max-w-58 rounded shadow-lg overflow-hidden hover:shadow-lg">
        <div className="min-h-25 lg:min-h-20 max-h-15 lg:max-h-35 pt-2 rounded">
          <img
            src={productData?.image[0]}
            alt={productData?.name}
            className="w-full h-full object-scale-down scale-125"
          />
        </div>
        <div className="bg-blue-200/70 text-sm flex items-center text-center justify-center mx-auto w-fit mt-5 px-2 text-blue-600 rounded-full">
          {productData?.stock} Available
        </div>
        <div className="font-medium text-ellipsis my-1 line-clamp-2 text-md">
          {productData?.name}
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col items-center gap-2">
            <div className="">{productData?.unit}</div>
              {
                productData?.discount > 0 && (
                  <div className="text-xs lg:text-sm text-white bg-green-600 w-fit px-[0.5px] py-1 my-1 lg:px-2 lg:py-1 rounded-full">
                    <p className="flex items-center justify-center">{productData?.discount}% OFF</p>
                  </div>
                )
              }
          </div>
          
          {
            productData?.discount > 0 ? (
              <div className="">
                <div className="text-md line-through text-red-400">
                  {DisplayPriceInBDT(productData?.price)}
                </div>
                <div className="font-semibold text-lg text-green-600">
                  {DisplayPriceInBDT(calculatePriceWithDiscount(productData?.price, productData?.discount))}
                </div>
              </div>
            ) : (
              <div className="font-bold text-lg text-green-600">
                {DisplayPriceInBDT(productData?.price)}
              </div>
            )
          }
        </div>

        <div className="flex items-center justify-between gap-2 font-semibold">
          <div className="w-full">
            {
              productData?.stock > 0 ? (
                <button className="bg-blue-500 text-white p-1 px-4 lg:px-6 w-full rounded-full hover:bg-blue-600 transition-all duration-300">
                  Cart
                </button>
              ) :
              (
                <div className="text-sm text-red-500 text-center">
                  Out of Stock
                </div>
              )
            }
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductDisplayCard;
