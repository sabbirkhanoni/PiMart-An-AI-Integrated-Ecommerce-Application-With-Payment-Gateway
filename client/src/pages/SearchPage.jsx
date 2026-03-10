import React, { useState } from 'react'
import ProductSkeletonCardLoading from '../components/Mini/ProductSkeletonCardLoading'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxioxToastError'
import { useEffect } from 'react'
import ProductDisplayCard from '../components/DesignModel/ProductDisplayCard'
import InfinteScroll from 'react-infinite-scroll-component'
import { useLocation } from 'react-router-dom'
import NoDataImage from "../assets/no-data.png"


const SearchPage = () => {

  const [searchedData, setSearchedData] = useState([])
  const [loading, setLoading] = useState(true)
  const loadingCardArray = new Array(12).fill(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const params = useLocation();
  const searchParams = params?.search?.slice(3);

  const fetchSearchedData = async () => {
    try {
      setLoading(true)

      const response = await Axios({
        ...SummaryApi.searchProduct, 
          data: {
            page,
            limit: 12,
            search: searchParams || "",
          }
        });
      const {data : responseData } = response;
      if(responseData.success) {
        if(responseData.page === 1) {
          setSearchedData(responseData.data)
        }else{
          setSearchedData((prev) => {
            return [
              ...prev, 
              ...responseData.data
            ]
          })
        }
        setTotalPages(responseData.totalNoPages);
      }
    }catch (error) {
      AxiosToastError(error)
    }finally {
      setLoading(false)
    }
  }

  const handleFethchMoreData =  () => {
    if(totalPages > page) {
      setPage((prev) => prev + 1);
    }
  }

   
  useEffect(() => {
    fetchSearchedData();
  }, [page, searchParams]);

  return (
    <section className='bg-white'>
      <div className="container mx-auto">
        <p className="font-bold text-lg">{searchedData.length > 0 ? `Search Results Found: ${searchedData.length} items` : 'No results found'}</p>

      {/* Product */}
      <InfinteScroll 
            className='flex items-center justify-center'
            dataLength={searchedData.length}
            hasMore={page < totalPages}
            next={handleFethchMoreData}
       >
      <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 py-4 gap-1'>
          {
            searchedData.length > 0 && (
              searchedData.map((product, index) => {
                return <ProductDisplayCard key={product._id+"searchProduct"+index} productData={product} />
              })
            )
          }

          {
            !loading && searchedData.length === 0 && (
              <div className='flex flex-col items-center justify-center gap-4 col-span-full py-10'>
                <img src={NoDataImage} alt="no data" className='w-48 h-48 object-contain' />
                <p className='text-sm text-gray-500'>No products found matching your search.</p>
              </div>
            )
          }

          {
            loading && (
              loadingCardArray.map((_, index) => (
                <ProductSkeletonCardLoading key={index} />
              ))
            )
          }
      </div>
      </InfinteScroll>
    </div>
    </section>
  )
}

export default SearchPage