import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxioxToastError';
import Loading from '../components/Mini/Loading';


const CategoryWiseProductList = () => {

  const [productListData, setProductListData] = useState([]);
  const [page,setPage] = useState(1);
  const [loading,setLoading] = useState(false);
  const [totalPages,setTotalPages] = useState(1);


  const params = useParams();

  const categoryId = params.category.split("-").slice(-1)[0];
  const subCategoryId = params.subCategory.split("-").slice(-1)[0];

  //get subcategory Name
  const subCategory = params?.subCategory?.split("-")
  const subCategoryName = subCategory?.slice(0,subCategory.length -1).join(" ");


  useEffect(() => {
    fetchProductByCategoryAndSubCategoryData();
  }, [params])

  const fetchProductByCategoryAndSubCategoryData = async () => {

    try{
        setLoading(true);
        const response = await Axios({
          ...SummaryApi.getProductByCategoryAndSubCategoryParams,
          data : {
            categoryId : categoryId,
            subCategoryId : subCategoryId,
            page : page || 1,
            limit : 10
          }
        })

        const {data : responseData} = response;
        if(responseData.success){

            if(responseData.page == 1){
              setProductListData(responseData.data);
            }else{
              setProductListData([...productListData, ...responseData.data]);
            }
            setTotalPages(responseData.totalCount);
        }

    }catch(error){
      AxiosToastError(error);
    }
    finally{
      setLoading(false);
    }
  }

  return (
    <section className='top-h-20 sticky'>
      <div className='container mx-auto grid grid-cols-[140px_1fr] md:grid-cols-[200px_1fr] lg:grid-cols-[270px_1fr] p-3'>
        {/* SubCategory List  */}
        <div className='bg-red-500 min-h-[75vh]'>
          <h1>Category Wise Product List</h1>
        </div>



        {/* Product List  */}
        <div className='bg-green-500'>
          <div className = "bg-white">
            <h2 className='text-lg font-bold'>{subCategoryName}</h2>
          </div>
        </div>

        <div>
          {
            productListData.map((product,index) => {
               <ProductDisplayCard 
                productData={product} 
                key={index+"productDisplayCardForSubCategoryWise"} 
               />
            })
          }
        </div>

        {
          loading && (
            <Loading />
          )
        }



      </div>
    </section>
  )
}

export default CategoryWiseProductList
