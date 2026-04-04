import { useEffect, useState } from 'react'
import UploadSubCategoryModel from '../components/ViewPageComponent/UploadSubCategoryModel'
import AxiosToastError from '../utils/AxioxToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import DisplayTable from '../components/DesignModel/TableDesignModel'
import { createColumnHelper } from '@tanstack/react-table'
import ViewImage from '../components/Mini/ImageZoom'
import { MdDelete  } from "react-icons/md";
import { HiPencil } from "react-icons/hi";
import EditSubCategoryComponent from '../components/ViewPageComponent/EditSubCategoryComponent'
import CofirmBox from '../components/Mini/ConfirmationPermissionBox'
import toast from 'react-hot-toast'

const SubCategoryPage = () => {
  const [openAddSubCategory,setOpenAddSubCategory] = useState(false)
  const [data,setData] = useState([])
  const [loading,setLoading] = useState(false)
  const columnHelper = createColumnHelper()
  const [ImageURL,setImageURL] = useState("")
  const [openEdit,setOpenEdit] = useState(false)
  const [editData,setEditData] = useState({
    _id : ""
  })
  const [deleteSubCategory,setDeleteSubCategory] = useState({
      _id : ""
  })
  const [openDeleteConfirmBox,setOpenDeleteConfirmBox] = useState(false)


  const fetchSubALLCategory = async()=>{
    try {
        setLoading(true)
        const response = await Axios({
          ...SummaryApi.getAllSubCategory
        })
        const { data : responseData } = response

        if(responseData.success){
          setData(responseData.data)
        }
    } catch (error) {
       AxiosToastError(error)
    } finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchSubALLCategory()
  },[])

  const column = [
    columnHelper.accessor('name',{
      header : "Name"
    }),
    columnHelper.accessor('image',{
      header : "Image",
      cell : ({row})=>{
        console.log("row",)
        return <div className='flex justify-center items-center'>
            <img 
                src={row.original.image}
                alt={row.original.name}
                className='w-8 h-8 cursor-pointer'
                onClick={()=>{
                  setImageURL(row.original.image)
                }}      
            />
        </div>
      }
    }),
    columnHelper.accessor("category",{
       header : "Category",
       cell : ({row})=>{
        return(
          <>
            {
              row.original.category.map((c,index)=>{
                return(
                  <p key={c._id+"table"} className='shadow-md px-1 inline-block'>{c.name}</p>
                )
              })
            }
          </>
        )
       }
    }),
    columnHelper.accessor("_id",{
      header : "Action",
      cell : ({row})=>{
        return(
          <div className='flex items-center justify-center gap-3'>
              <button onClick={()=>{
                  setOpenEdit(true)
                  setEditData(row.original)
              }} className='p-1 bg-blue-100 rounded-full hover:text-blue-600'>
                  <HiPencil size={20}/>
              </button>
              <button onClick={()=>{
                setOpenDeleteConfirmBox(true)
                setDeleteSubCategory(row.original)
              }} className='p-1 bg-red-100 rounded-full text-red-500 hover:text-red-600'>
                  <MdDelete  size={20}/>
              </button>
          </div>
        )
      }
    })
  ]

  const handleDeleteSubCategory = async()=>{
      try {
          const response = await Axios({
              ...SummaryApi.deleteSubCategory,
              data : deleteSubCategory
          })

          const { data : responseData } = response

          if(responseData.success){
             toast.success(responseData.message)
             fetchSubALLCategory()
             setOpenDeleteConfirmBox(false)
             setDeleteSubCategory({_id : ""})
          }
      } catch (error) {
        AxiosToastError(error)
      }
  }

  return (
    <section className=''>
        <div className='p-2 bg-white shadow-md flex items-center justify-between'>
            <h2 className='font-semibold'>Sub Category</h2>
            <button onClick={()=>setOpenAddSubCategory(true)} className='border border-primary-200 bg-blue-500  hover:bg-blue-600 text-white text-md px-3 py-1 rounded-full'>Add Sub Category</button>
        </div>

        <div className='overflow-auto w-full max-w-[95vw]'>
            <DisplayTable
              subCategoryData={data}
              columns={column}
            />
        </div>


        {
          openAddSubCategory && (
            <UploadSubCategoryModel 
              close={()=>setOpenAddSubCategory(false)}
              fetchAllSubCategory={fetchSubALLCategory}
            />
          )
        }

        {
          ImageURL &&
          <ViewImage url={ImageURL} close={()=>setImageURL("")}/>
        }

        {
          openEdit && 
          <EditSubCategoryComponent 
            data={editData} 
            close={()=>setOpenEdit(false)}
            fetchSubCategoriesDataAgainToAvoidRefresh={fetchSubALLCategory}
          />
        }

        {
          openDeleteConfirmBox && (
            <CofirmBox 
              close={()=>setOpenDeleteConfirmBox(false)}
              confirm={handleDeleteSubCategory}
            />
          )
        }
    </section>
  )
}

export default SubCategoryPage