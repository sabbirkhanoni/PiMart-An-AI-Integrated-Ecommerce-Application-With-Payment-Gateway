import { useState } from "react";
import { IoCloseCircleSharp } from "react-icons/io5";
import PropTypes from "prop-types";
import UploadImage from "../../utils/UploadImage";
import SummaryApi from "../../common/SummaryApi";
import Axios from "../../utils/Axios";
import toast from "react-hot-toast";
import AxiosToastError from "../../utils/AxioxToastError";


const UploadCategoryModel = ({close,fetchAllCategory}) => {
  
      const [data,setData] = useState({
        name : "",
        image : ""
    })



    const handleOnChange = (e)=>{
      const { name, value} = e.target

      setData((preve)=>{
          return{
              ...preve,
              [name] : value
          }
      })
  }

  const [loading,setLoading] = useState(false) ;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.addCategory,
        data : data
      })

      const {data : responseData } = response;
      if(responseData.success){
        toast.success(responseData.message || "Category added successfully");
        close()
        fetchAllCategory();
      }
    } catch (error) {
      AxiosToastError(error);
    }finally {
      setLoading(false)
    }

  }

      const handleUploadCategoryImage = async(e)=>{
        const file = e.target.files[0]

        if(!file){
            return
        }

        const response = await UploadImage(file)
        //missing the destucturing of the response data

          setData((preve)=>{
              return{
                  ...preve,
                  image : response.data.url
              }
          })
      }


  return (
    <section className="fixed top-0 left-0 bottom-0 right-0 bg-neutral-900/50 p-4 flex items-center justify-center">
      <div className="bg-white max-w-4xl w-full rounded p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Category</h2>
          <button onClick={close} className="w-fit block ml-auto">
            <IoCloseCircleSharp size={20}/>
          </button>
        </div>

        <form className="grid gap-2" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="categoryName">Category Name</label>
            <input 
            type="text"
            id="categoryName"
            name="name"
            placeholder="Enter Category Name"
            className="p-2 bg-blue-50 outline-primary border focus-within:border-blue-400 rounded my-2"
            value={data.name}
            onChange={handleOnChange}
            required
            />
          </div>

          <div className="grid gap-1">
              <p>Image</p>

              <div className="gap-4 flex flex-col lg:flex-row items-center">
                <div className="flex items-center justify-center bg-blue-50 rounded drop-shadow-lg w-full lg:w-37 h-37">

                {
                  data.image ? (
                      <img
                          alt='category'
                          src={data.image}
                          className='w-full h-full object-scale-down'
                      />
                  ) : (
                      <p className='text-sm text-neutral-500'>No Image</p>
                  )
                }
                
                </div>

                <label htmlFor="categoryImage">
                 <div className={"bg-green-600 hover:bg-green-700 text-sm border px-5 py-1 rounded-full mt-5 text-white cursor-pointer"}>
                  Upload Image
                  </div>
                  <input onChange={handleUploadCategoryImage} type="file" name="image" id="categoryImage" className="hidden"/>
                </label>
              </div>
          </div>

          <button className={`${(data.name && data.image) ? "bg-blue-500 hover:bg-blue-700": "bg-gray-500 hover:bg-gray-700"} rounded-full p-1 text-white mt-5`}>{loading ? "uploading..." : "Add Category"}</button>
          
        </form>
          
      </div>
    </section>
  )
}
UploadCategoryModel.propTypes = {
  close: PropTypes.func.isRequired,
  fetchAllCategory: PropTypes.func.isRequired
};

export default UploadCategoryModel