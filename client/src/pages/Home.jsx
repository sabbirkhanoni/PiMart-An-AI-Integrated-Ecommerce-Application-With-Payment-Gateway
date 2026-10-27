
import HeroBannerSlider from '../components/HeroBannerSlider.jsx';
import { useSelector } from 'react-redux';
import { URLvalidation } from '../utils/URLValidation.js';
import { useNavigate } from 'react-router-dom';
import CategoryWiseProductDispalyAtHome from '../components/DesignModel/CategoryWiseProductDispalyAtHome.jsx';
import toast from 'react-hot-toast';


export const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory);
  const fetchAllCategoryDataFromReduxStore = useSelector(state => state.product.allCategory)
  const fetchAllSubCategoryDataFromReduxStore = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate();



  const handleRedirectToCategoryWiseProductList = (categoryId, categoryName) => {
    const subCategory = fetchAllSubCategoryDataFromReduxStore?.find((subCat) => {
      return subCat?.category?.some((cat) => (cat?._id || cat) == categoryId);
    });

    if (!subCategory) {
      toast.error("No subcategory found for this category yet.");
      return;
    }

    const url = `/${URLvalidation(categoryName)}-${categoryId}/${URLvalidation(subCategory?.name)}-${subCategory?._id}`;
    navigate(url);
  };

  return (
    <section className='bg-white'>
      <div
        className='container mx-auto my-1 px-2'>

          {/* Dynamic Hero Banner Slider */}
          <div className="my-2">
            <HeroBannerSlider />
          </div>

          {/* Category Middle Section */}
          <div className='bg-blue-300/50 text-black mx-1 shadow-lg rounded my-2 p-2 text-center font-semibold'>
            <p className='animate-bounce'>Shop By Category</p>
          </div>


          {/* Category List display */}
          <div className='container mx-auto my-2 px-2 grid grid-cols-2 md:grid-cols-6 lg:grid-cols-10 gap-5 md:gap-2 lg:gap-2'>
            {
              (loadingCategory || fetchAllCategoryDataFromReduxStore?.length === 0) ? (
                  new Array(10).fill(null).map((cat, index) => {
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
                        <div key={index+"categoryData"} className='bg-white shadow-md rounded p-2 flex flex-col items-center justify-between h-40 w-full cursor-pointer hover:shadow-lg transition-shadow'
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
            (loadingCategory || fetchAllCategoryDataFromReduxStore?.length === 0) ? (
              <div className="container mx-auto my-4 px-2 space-y-6">
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-3">
                    <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                    <div className="flex gap-4 overflow-hidden">
                      {[1, 2, 3, 4, 5, 6].map((j) => (
                        <div key={j} className="min-w-[170px] h-48 bg-gray-100 border border-gray-200 rounded-xl animate-pulse"></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              fetchAllCategoryDataFromReduxStore.map((category, index) => {
                return (
                  <CategoryWiseProductDispalyAtHome key={index+"categoryWiseProductDisplay"} categoryId={category._id} categoryName = {category.name}/>
                )
              })
            )
          }

      </div>
    </section>
  )
}
