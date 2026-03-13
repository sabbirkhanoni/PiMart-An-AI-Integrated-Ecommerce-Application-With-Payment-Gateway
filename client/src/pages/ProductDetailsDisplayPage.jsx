import React, { useEffect, useRef, useState } from "react";
import { data, useParams } from "react-router-dom";
import AxiosToastError from "../utils/AxioxToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { DisplayPriceInBDT } from "../utils/DisplayPriceInBDT";
import Divider from "../components/Divider";
import { TbTruckDelivery } from "react-icons/tb";
import { SiCashapp } from "react-icons/si";
import { IoPricetags } from "react-icons/io5";
import { BiSolidOffer } from "react-icons/bi";
import { FaRunning } from "react-icons/fa";
import {calculatePriceWithDiscount} from "../utils/calculatePriceWithDiscount.js";
import AddToCartButton from "../components/DesignModel/AddToCartButton.jsx";

const ProductDetailsDisplayPage = () => {
  const params = useParams();
  const productParams = params["product-details"] || "";

  const productIdFromParams = productParams.split("-").slice(-1)[0];

  const [productDetailsData, setProductDetailsData] = useState({
    name: "",
    image: []
  })
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(0);

  const imageScrollRef = useRef();

  const fetchSingleProductDetails = async () => {
    try{
        setLoading(true);
        const response = await Axios({
            ...SummaryApi.getSingleProductDetails,
            data: {
                productId : productIdFromParams
            }
        });

        if(response.data.success) {
            setProductDetailsData(response.data.data);
        }

    }catch(error) {
        AxiosToastError(error);
    }finally {
        setLoading(false);
    }
  }

  const handleScrollLeft = () => {
    imageScrollRef.current.scrollLeft -= 100;
  }

  const handleScrollRight = () => {
    imageScrollRef.current.scrollLeft += 100;
  }

  useEffect(() => {
    fetchSingleProductDetails();
  },[params]);


  return (
    <section className= "container bg-white mx-auto p-2 grid lg:grid-cols-2">
        {/* Left Part */}
        <div className='space-y-4'>
            <div className='h-full bg-white min-h-55 max-h-55 lg:min-h-[60vh] lg:max-h-[60vh]'>
                <img
                    src={productDetailsData.image[image]}
                    alt="product image"
                    className="w-full h-full object-scale-down"
                />
            </div>
            <div className='flex justify-center items-center gap-2 mt-4 lg:mt-0 flex-wrap'>
                {
                  productDetailsData.image.map((imageItem, index) => {
                    return (
                      <div className="lg:h-5 lg:w-5 h-3 w-3 rounded-full bg-blue-100">
                           <div className={`w-full h-full ${image === index ? 'bg-blue-400 rounded-full' : ''}`}></div>
                      </div>
                    )
                  })
                }
            </div>

            <div className='grid relative'>
              <div ref={imageScrollRef} className='flex gap-4 relative z-10 overflow-x-auto w-full scrollbar-none'>
                {
                  productDetailsData.image.map((imageItem, index) => {
                    return (
                      <div className="h-10 w-10 min-h-20 min-w-20 bg-blue-200 shadow-lg cursor-pointer">
                        <img
                            src={imageItem}
                            alt={`product image ${index}`}
                            onClick={() => setImage(index)}
                            className='w-full h-full object-cover'
                        />
                      </div>
                    )
                  })
                  }
              </div>

              <div className=' absolute flex justify-between w-full h-full -ml-5 items-center'>
                <button
                  className="z-10 relative  bg-blue-100 rounded-full p-1"
                  onClick={() => handleScrollLeft()}>
                  <FaAngleLeft /></button>
                <button
                  className="z-10 relative bg-blue-100 rounded-full p-1"
                  onClick={() => handleScrollRight()}>
                  <FaAngleRight /></button>
              </div>
            </div>

            <Divider />

            {
              productDetailsData.description && (
                <div>
                  <h2 className="font-bold text-sm">Product Description</h2>
                  <p className="text-sm text-gray-700">{productDetailsData.description}</p>
                </div>
              )
            }

            {
                productDetailsData?.more_details && Object.keys(productDetailsData?.more_details).map((element,index) => {
                return (
                  <div key={index}>
                    <h2 className="font-bold text-sm">{element}</h2>
                    <p className="text-sm">{productDetailsData?.more_details[element]}</p>
                  </div>
                )
                })
            }
        </div>

        {/* Right Part */}
        <div className='p-3 space-y-4'>
              <h5 className="bg-orange-400 w-fit p-1 rounded-full text-white text-sm lg:text-md">{productDetailsData.stock} in stock</h5>
              <h1 className='font-semibold text-lg pl-1'>{productDetailsData.name}</h1>
              <p className='bg-gray-200 w-fit p-1 rounded-3xl px-3 text-sm lg:text-md'>{productDetailsData.unit}</p>
              {
                productDetailsData.discount > 0 && (
                  <p className="text-md text-white bg-green-600 w-fit px-2 py-1 rounded-full">{productDetailsData.discount}% OFF</p>
                )
              }
              <div className="flex w-fit items-center gap-1 border-1 p-2 rounded-full bg-blue-200 border-blue-300">
               {
                productDetailsData.discount > 0 ? (
                  <>
                    
                    <p className="text-sm text-red-500 line-through">{DisplayPriceInBDT(productDetailsData.price)}</p>
                    <p className="text-sm text-green-600 font-bold">{DisplayPriceInBDT(calculatePriceWithDiscount(productDetailsData.price, productDetailsData.discount))}</p>
                  </>
                ) : (
                  <p className="text-sm font-semibold text-gray-800">{DisplayPriceInBDT(productDetailsData.price)}</p>
                )
               }
              </div>
              
              {
                productDetailsData.stock === 0 ? (
                  <p className="bg-red-100 w-fit p-1 px-2 rounded-full text-red-600 text-xs">Out of Stock</p>
                ) : (
                  <div className="flex gap-2 items-center">
                    {/* <button className="bg-blue-500 hover:bg-blue-600 hover:border-blue-600 my-2 text-md font-semibold px-4 rounded-full py-2 text-white ">Add To Cart</button> */}
                    <div
                      className="w-[130px]"
                    >
                      <AddToCartButton productData={productDetailsData} />
                    </div>
                    <p className="bg-green-100 w-fit p-1 px-2 rounded-full text-green-600 text-xs">In Stock</p>
                  </div>
                )
              }

              
             



              <Divider />
              <h2 className="font-bold text-sm">Why Shopping From Us?</h2>
              <div className='flex gap-5 items-center'>
                <div className="">
                  <TbTruckDelivery className="text-2xl"/>
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Fast Delivery</h3>
                  <p className="text-sm">Get your products delivered to your doorstep in no time!</p>
                </div>
              </div>

              <div className='flex gap-5 items-center'>
                <div className="">
                  <FaRunning className="text-2xl"/>
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Fast Delivery</h3>
                  <p className="text-sm">Get your products delivered to your doorstep in no time!</p>
                </div>
              </div>

              <div className='flex gap-5 items-center'>
                <div className="">
                  <SiCashapp className="text-xl"/>
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Cash on Delivery</h3>
                  <p className="text-sm">Pay for your order upon delivery!</p>
                </div>
              </div>

              <div className='flex gap-5 items-center'>
                <div className="">
                  <IoPricetags className="text-2xl"/>
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Best Price</h3>
                  <p className="text-sm">Get the best price for your products!</p>
                </div>
              </div>

              <div className='flex gap-5 items-center'>
                <div className="">
                  <BiSolidOffer className="text-2xl"/>
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Exclusive Offers</h3>
                  <p className="text-sm">Get exclusive offers and discounts!</p>
                </div>
              </div>
        </div>
    </section>
  );
};

export default ProductDetailsDisplayPage;
