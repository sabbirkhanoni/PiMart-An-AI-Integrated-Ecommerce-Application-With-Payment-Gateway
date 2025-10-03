import { useState } from "react"
import SummaryApi from "../common/SummaryApi"
import AxiosToastError from "../utils/AxioxToastError"
import Axios from "../utils/Axios"
import MiniLoading from "../components/Mini/miniLoading"
import { useEffect } from "react"
import { MdNavigateBefore } from "react-icons/md";
import { MdNavigateNext } from "react-icons/md";
import ProductDisplayDesignCardAdmin from "../components/DesignModel/ProductDisplayDesignCardAdmin"
import { IoSearchCircle } from "react-icons/io5";




  const ProductAdminPage = () => {

  const [allProductData, setAllProductData] = useState([])
  const [pageNumber, setPageNumber] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPagesCount, setTotalPagesCount] = useState(1)
  const [gettingSearch, setGettingSearch] = useState("")




  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getAllProducts,
        data: {
          page: pageNumber,
          limit : 18,
          search: gettingSearch
        }
      })

      const {data : responseData} = response
      if(responseData.success) {
        setTotalPagesCount(responseData.totalNoPages)
        setAllProductData(responseData.data)
      }


    }catch (error) {
      AxiosToastError(error);
    }finally {
      setLoading(false);
    }

  }

  useEffect(()=>{
    fetchAllProducts();
  }, [pageNumber])

  const handleGettingSearch = (e) => {
    const searchValue = e.target.value
    setGettingSearch(searchValue)
    setPageNumber(1)
  }


  useEffect(()=>{
    const checkdebounceFlag = true
    const delayDebounceFn = setTimeout(() => {
      if(checkdebounceFlag) {
        fetchAllProducts();
        checkdebounceFlag = false
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [gettingSearch])


  const handleMoveToNextPage = () => {
    if(pageNumber < totalPagesCount) {
      setPageNumber(prev => prev + 1)
    }
  }

  const handleMoveToPreviousPage = () => {
    if(pageNumber > 1) {
      setPageNumber(prev => prev - 1)
    }
  }


    return (
      <section >
        <div className='p-1 bg-white shadow-lg rounded flex justify-between items-center gap-5'>
          <h2 className='font-semibold text-lg'>Products</h2>
          
          <div className='w-[250px] md:w-[300px] lg:w-[300px] relative'>
            <input
              type="text"
              placeholder="Search Products..."
              className='mb-2 bg-blue-300 rounded-full p-1 md:p-2 lg:p-2 text-md md:text-lg lg:text-md font-medium w-full outline-none hover:bg-blue-400 hover:text-white '
              onChange={handleGettingSearch}
              value={gettingSearch}
            />
            <IoSearchCircle
              size={24}
              className='absolute right-3 top-1 lg:top-2.5 md:top-2.5 text-gray-700 cursor-pointer'
            />
          </div>
        </div>



        {
          loading && (
            <MiniLoading />
          )
        }


        <div className="bg-blue-50 p-3 mt-2">
          <div className="min-h-[70vh]">
            <div
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-2 justify-items-center"
              >
                  {
                    allProductData.map((pro,index) =>{
                      return (
                        <ProductDisplayDesignCardAdmin productData = {pro} />
                      )
                    })
                  }
              </div>
          </div>

          <div className="flex bg-blue-500 hover:bg-blue-600 justify-between items-center rounded-full">
            <button onClick={handleMoveToPreviousPage} className='flex text-white px-2.5 hover:text-black cursor-pointer justify-center items-center text-sm'><MdNavigateBefore size={30}/></button>
            <button className='w-full text-white p-0.5'>{pageNumber}/{totalPagesCount}</button>
            <button onClick={handleMoveToNextPage} className='flex text-white hover:text-black px-2.5 cursor-pointer justify-center items-center text-sm'><MdNavigateNext size={30}/></button>
          </div>
        </div>
      </section>
    )
  }

  export default ProductAdminPage