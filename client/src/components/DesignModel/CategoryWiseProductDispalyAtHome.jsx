import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import AxiosToastError from '../../utils/AxioxToastError';
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SummaryApi';
import { useEffect } from 'react';
import ProductSkeletonCardLoading from '../Mini/ProductSkeletonCardLoading';
import ProductDisplayCard from './ProductDisplayCard';
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { URLvalidation } from '../../utils/URLValidation';


const CategoryWiseProductDispalyAtHome = ({categoryId,categoryName}) => {

    const [productDataByCategoryWise, setProductDataByCategoryWise] = useState([]);
    const [loading, setLoading] = useState(false);
    const fetchAllSubCategoryDataFromReduxStore = useSelector(state => state.product.allSubCategory)
    const containeroverflowRef = useRef();
    const user = useSelector(state => state.user);


    const fetchProductByCategoryWise = async () => {
        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.getProductByCategoryWise,
                data : {
                    categoryId : categoryId
                }
            })

            const {data : responseData} = response;

            if(responseData.success){
                setProductDataByCategoryWise(responseData.data);
            }

        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    }

    const handleLeftScroll = () => {
        containeroverflowRef.current.scrollLeft -= 200;
    }

    const handleRightScroll = () => {
        containeroverflowRef.current.scrollLeft += 200;
    }

    const handleRedirectToCategoryWiseProductList = () => {
          const subCategory = fetchAllSubCategoryDataFromReduxStore.find(subCat => {
            const filteredSubCategory = subCat.category.some(cat => {
              return cat._id == categoryId
            })
            return filteredSubCategory ? true : null
          })
          const url = `/${URLvalidation(categoryName)}-${categoryId}/${URLvalidation(subCategory?.name)}-${subCategory?._id}`;
          return url;
      }

    const redirectedURL = handleRedirectToCategoryWiseProductList();

    useEffect(() => {
        fetchProductByCategoryWise();
    }, [categoryId])

    useEffect(() => {
        if(productDataByCategoryWise.length > 0) {
            fetchProductByCategoryWise();
        }
    }, [user._id])

    const loadingProductCardNumberToShow = new Array(6).fill(null);

  if (!loading && productDataByCategoryWise.length < 7) {
    return null;
  }

  return (
          <div>
            <div className = "container mx-auto flex items-center justify-between p-4 gap-4">
              <h3 className= "font-semibold text-lg md:text-xl">{categoryName}</h3>
              <Link to={redirectedURL} className="text-blue-500 hover:text-blue-600">See More</Link>
            </div>

            <div className='relative flex items-center'>
                <div className='flex gap-2 md:gap-6 lg:gap-4 container mx-auto px-2 scroll-smooth scrollbar-none overflow-x-scroll'
                ref={containeroverflowRef}
                >
                {
                    loading &&
                    loadingProductCardNumberToShow.map((_, index) => {
                        return (
                            <div key={index+"cardSkeleton"} className="p-2 border border-gray-200 rounded">
                                <ProductSkeletonCardLoading key={index+"cardSkeletonLoading"}/>
                            </div>
                        )
                    })
                }

                {
                    productDataByCategoryWise.map((product,index) => {
                       return(
                        <ProductDisplayCard productData={product} key={index+"productDisplayCard"} />
                       ) 
                    })
                }
                </div>

                <div className='left-0 w-full right-0 hidden absolute lg:flex justify-between items-center'>
                    <button
                        onClick={handleLeftScroll}
                        className='relative z-10 ml-2 bg-blue-300 shadow-md p-2 hover:bg-blue-400 rounded'>
                        <FaAnglesLeft/>
                    </button>
                    <button
                        onClick={handleRightScroll}
                        className='relative z-10 mr-3 bg-blue-300 shadow-md p-2 hover:bg-blue-400 rounded'>
                        <FaAnglesRight/>
                    </button>
                </div> 
            </div>
          </div>                
  )
}

export default CategoryWiseProductDispalyAtHome
