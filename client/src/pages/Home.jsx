
import largeBanner from '../assets/largeBanner.png';
import mobileSizeBanner from '../assets/mobileSize-Banner.png';
import { useSelector } from 'react-redux';
import { URLvalidation } from '../utils/URLValidation.js';
import { Link, useNavigate } from 'react-router-dom';
import CategoryWiseProductDispalyAtHome from '../components/DesignModel/CategoryWiseProductDispalyAtHome.jsx';
import { useEffect } from 'react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { useGlobalContext } from '../contexts/GlobalContext.jsx';

export const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory);
  const fetchAllCategoryDataFromReduxStore = useSelector(state => state.product.allCategory)
  const fetchAllSubCategoryDataFromReduxStore = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate();

  const handleRedirectToCategoryWiseProductList = (categoryId,categoryName) => {
      const subCategory = fetchAllSubCategoryDataFromReduxStore.find(subCat => {
        const filteredSubCategory = subCat.category.some(cat => {
          return cat._id == categoryId
        })
        return filteredSubCategory ? true : null
      })
      const url = `/${URLvalidation(categoryName)}-${categoryId}/${URLvalidation(subCategory.name)}-${subCategory._id}`;
      navigate(url);
  }

  return (
    <section className='bg-white'>
      <div
        className='container mx-auto my-1'>

          {/* Banner Section */}
          <div className={`min-h-full w-full shadow-xl h-full bg-white p-5 rounded ${!largeBanner || !mobileSizeBanner && 'animate-pulse'}`}>
            <img 
              src={largeBanner}
              alt="Banner"
              className='w-full h-full object-cover rounded hidden lg:block md:block'
              />

            <img 
              src={mobileSizeBanner}
              alt="Banner"
              className='w-full h-full object-cover lg:hidden md:hidden rounded'
              />
          </div>

          {/* Category Middle Section */}
          <div className='bg-blue-300/50 text-black mx-1 shadow-lg rounded my-2 p-2 text-center font-semibold'>
            <p className='animate-bounce'>Shop By Category</p>
          </div>


          {/* Category List display */}
          <div className='container mx-auto my-2 px-2 grid grid-cols-2 md:grid-cols-6 lg:grid-cols-10 gap-5 md:gap-2 lg:gap-2'>
            {
              loadingCategory ? (
                  new Array(20).fill(null).map((cat, index) => {
                  return (
                    <div key={index+"loadingCategoryDataOverlay"} className='bg-blue-50 p-4 rounded min-h-36 grid gap-2 shadow animate-pulse'>
                      <div className='bg-blue-100 min-h-25 rounded'></div>
                      <div className='bg-blue-100 h-8 rounded'></div>
                    </div>
                  )
                })
              ) : (

                  fetchAllCategoryDataFromReduxStore.map((cat,index) => {
                    return (
                        <div key={index+"categoryData"} className='bg-white shadow-md rounded p-2 flex flex-col items-center justify-between h-40 w-full'
                        onClick={() => handleRedirectToCategoryWiseProductList(cat._id, cat.name)}>
                        <div className='h-24 w-full flex items-center justify-center'>
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className='object-contain max-h-full'
                          />
                        </div>

                        <div className='bg-blue-50 w-full h-10 flex items-center justify-center rounded'>
                          <p className='text-center text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis px-1'>
                            {cat.name}
                          </p>
                        </div>
                        </div>

                    )
                  })
              )
            }

          </div>


          {/* Category Wise Product Display Section */}
          {
            fetchAllCategoryDataFromReduxStore.map((category, index) => {
              return (
                <CategoryWiseProductDispalyAtHome key={index+"categoryWiseProductDisplay"} categoryId={category._id} categoryName = {category.name}/>
              )
            })
          }

      </div>
    </section>
  )
}
