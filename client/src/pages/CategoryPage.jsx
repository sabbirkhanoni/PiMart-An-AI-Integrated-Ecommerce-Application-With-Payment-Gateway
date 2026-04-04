import UploadCategoryModel from "../components/ViewPageComponent/UploadCategoryModel"
import Loading from "../components/Mini/Loading";
import NoData from "../components/Mini/NoData";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxioxToastError";
import { MdEditSquare } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import EditCategoryComponent from "../components/ViewPageComponent/EditCategoryComponent";
import ConfirmationPermissionBox from "../components/Mini/ConfirmationPermissionBox";
import toast from "react-hot-toast";
import {useEffect, useState } from "react";

const CategoryPage = () => {

    const [openUploadCategoryModel, setOpenUploadCategoryModel] = useState(false);

    const [loading, setLoading] = useState(false);

    const [categoryData, setCategoryData] = useState([]);

    const [openEditComponent, setOpenEditComponent] = useState(false);

    const [editCategoryData, setEditCategoryData] = useState({
        name: "",
        image: "",
    });

    const [openConfirmationBox, setOpenConfirmationBox] = useState(false);
    const [deleteCategoryById, setDeleteCategoryById] =useState({
        _id: ""
    })

    
    // const fetchAllCategories = useSelector(state => state.product.allCategory)

    // useEffect(() => {
    //     setCategoryData(fetchAllCategories)
    // }, [fetchAllCategories])




    //fetch categories from the server

    const fetchAllCategories = async() => {
        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.getAllCategories,
            })

            const {data : responseData} = response
            
            if(responseData.success){
                setCategoryData(responseData.data)
            }

        } catch (error) {
            AxiosToastError(error);
        }finally {
            setLoading(false);
        }
    }

    //useEffect to fetch categories when the component mounts
    useEffect(() => {
        fetchAllCategories()
    }, [])




    //handle delete category
    const handleDeleteCategory = async() => {
        try {
            
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.deleteCategory,
                data: deleteCategoryById
            })

            const {data: responseData} = response

            if(responseData.success){
                toast.success(responseData.message)
                setOpenConfirmationBox(false)
                fetchAllCategories()
            }

        } catch (error) {
            AxiosToastError(error);
            
        }finally {
            setLoading(false);
        }
        
    }

  return (
    <section>
        <div className='p-2 bg-white shadow-md rounded flex justify-between items-center'>
            <h2 className='font-semibold'>CategoryPage</h2>
            <button onClick={()=>setOpenUploadCategoryModel(true)} className="text-sm border bg-blue-500 hover:bg-blue-700 rounded-full py-2 px-3 text-white ">Add Category</button>
        </div>

        {
            !categoryData[0] && !loading && (
                <div className="mt-30">
                    <NoData/>
                </div>
            )
        }

        
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {categoryData.map((category, index) => {
            return (
            <div key={index} className="flex flex-col items-center">
                {/* Card */}
                <div className="w-33 py-1 h-48 my-3 bg-gray-100 shadow-2xs rounded-2xl relative overflow-hidden group">
                {/* Category image */}
                <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-46 rounded-3xl object-contain"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gray-950 opacity-0 group-hover:opacity-25 transition-opacity duration-300"></div>

                {/* Buttons */}
                <div className="absolute bottom-20 left-0 right-0 flex justify-center items-center opacity-0 group-hover:opacity-90 transform translate-y-full group-hover:translate-y-0 transition-all duration-500 ease-out">
                    <button
                    onClick={()=>{
                        setOpenEditComponent(true)
                        setEditCategoryData(category)
                    }}
                    className="text-lg rounded py-2 w-15 h-10 px-5 text-black mx-1">
                    <MdEditSquare size={30} />
                    </button>
                    <button 
                    className="text-lg rounded py-2 w-15 h-10 px-5 text-black mx-1"
                    onClick={()=> {
                        setOpenConfirmationBox(true)
                        setDeleteCategoryById(category)
                    }}
                    >
                    <MdDeleteForever size={30} />
                    </button>
                </div>
                </div>

                {/* Category name - OUTSIDE the card */}
                <div className="text-black font-semibold text-center">
                {category.name}
                </div>
            </div>
            );
        })}
        </div>

        {
            loading && (
                <Loading/>
            )
        }

        {
            openUploadCategoryModel && (
                <UploadCategoryModel fetchAllCategory={fetchAllCategories} close={() => setOpenUploadCategoryModel(false)}/>
            )
        }

        {
            openEditComponent && (
                <EditCategoryComponent data={editCategoryData} fetchAllCategory={fetchAllCategories} close={()=>setOpenEditComponent(false)}/>
            )
        }

        {
            openConfirmationBox && (
                <ConfirmationPermissionBox confirm={handleDeleteCategory} cancel={()=> setOpenConfirmationBox(false)}/>
            )
        }

    </section>

    
    
  )
}

export default CategoryPage