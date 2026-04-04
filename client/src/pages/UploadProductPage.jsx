import { useState } from "react"
import { MdOutlineCloudUpload } from "react-icons/md";
import UploadImage from "../utils/UploadImage";
import MiniLoading from "../components/Mini/MiniLoading.jsx";
import ImageZoom from "../components/Mini/ImageZoom";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import AddNewFeildsComponent from "../components/Mini/AddNewFeildsComponent";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxioxToastError";
import SuccessNotification from "../utils/SuccessNotification";


  const UploadProductPage = () => {

  const [addProductData, setAddProductData] = useState({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: {}
  })


  const [forImageLoading, setForImageLoading] = useState(false);
  const [imageZoom, setImageZoom] = useState("");
  const [selectMultipleCategory, setSelectMultipleCategory] = useState("");
  const [selectMultipleSubCategory, setSelectMultipleSubCategory] = useState("");

  const [openAddMoreFeilds, setOpenAddMoreFeilds] = useState(false);
  const [commingAddFeildsName, setCommingAddFeildsName] = useState("");

  // Fetching all categories from Redux store
  const fetchAllCategories = useSelector((state) => state.product.allCategory);

    // Fetching all subcategories from Redux store
  const fetchAllSubCategories = useSelector((state) => state.product.allSubCategory);



  const handleChangeOfFormData = (e) =>{
    const { name, value } = e.target


    setAddProductData((prev) =>{
      return {
        ...prev,
        [name] : value
      }
    })
  }

  const handleUploadProductImage = async(e) => {
    const file = e.target.files[0];
    if(!file) return;

    setForImageLoading(true);
    const uploadImageResponse = await UploadImage(file);
    
    const response = await UploadImage(file)

    const imageUrlData = response.data.url;
    
    setAddProductData((preve)=>{
        return{
            ...preve,
            image : [...preve.image,imageUrlData]
        }
    })
    setForImageLoading(false);
  }

  const handleDeleteImageFromFormData = async(index) => {
    addProductData.image.splice(index,1);

    setAddProductData((prev) => {
      return {
        ...prev
      }
    })
  }

  const handleSelectMultipleCategory = (e) => {
    const selectedCategoryValue = e.target.value;
    const selectedCategory = fetchAllCategories.find(cat => cat._id === selectedCategoryValue);

    setAddProductData((preve) => {
      return {
        ...preve,
        category : [...preve.category, selectedCategory]
      }
    })

    setSelectMultipleCategory("");
  }

  const handleDeleteCategoryFromFormData = async(index) => {
    addProductData.category.splice(index, 1);

    setAddProductData((prev) => {
      return {
        ...prev
      }
    })
  }

  const handleSelectMultipleSubCategory = (e) => {
    const selectedSubCategoryValue = e.target.value;
    const selectedSubCategory = fetchAllSubCategories.find(cat => cat._id === selectedSubCategoryValue);

    setAddProductData((preve) => {
      return {
        ...preve,
        subCategory : [...preve.subCategory, selectedSubCategory]
      }
    })

    setSelectMultipleSubCategory("");
  }

  const handleDeleteSubCategoryFromFormData = async(index) => {
    addProductData.subCategory.splice(index, 1);

    setAddProductData((prev) => {
      return {
        ...prev
      }
    })
  }


  const handleAddFeildsSubmit =() => {
    setAddProductData((preve ) => {
      return {
        ...preve,
        more_details : {
          ...preve.more_details,
          [commingAddFeildsName] : ""
        }
      }
    })
    setOpenAddMoreFeilds(false);
    setCommingAddFeildsName("");
  }

  const handleOnChangeForAddNewFeildsDetails = (e, key) => {
    const value = e.target.value;

    setAddProductData((preve) => {
      return {
        ...preve,
        more_details : {
          ...preve.more_details,
          [key] : value
        }
      }
    })

  }


  const handleDeleteMoreDetailsField = (keyToDelete) => {
      setAddProductData((prev) => {
        const updatedMoreDetails = { ...prev.more_details };
        delete updatedMoreDetails[keyToDelete]; // remove the key

        return {
          ...prev,
          more_details: updatedMoreDetails,
        };
      });
  };




  const handleFormSubmitForPublishProduct = async(e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.addProduct,
        data: addProductData
      })

      const {data : responseData } = response;
      if(responseData.success) {
        SuccessNotification("Product Is Added Successfully", responseData.message, "success");
        setAddProductData({
          name: "",
          image: [],
          category: [],
          subCategory: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          more_details: {}
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }

  }

  return (
    <section >
        <div className='p-2 bg-white shadow-md rounded flex justify-between items-center'>
            <h2 className='font-semibold'>Add Products</h2>
        </div>
        <div className="grid p-3">
          <form onSubmit = {handleFormSubmitForPublishProduct} 
          className= 'grid gap-5 text-lg'>
            <div
             className = "grid gap-1">
              <label htmlFor="name">Product Name</label>
              <input 
                id = "name"
                type="text"
                name="name"
                placeholder="Enter product name"
                value = {addProductData.name}
                onChange={handleChangeOfFormData}
                required
                className = "bg-blue-100 p-2 rounded-full border focus-within:border-blue-600"
              />
            </div>

            <div>
              <p>Image</p>
              <div>
                <label className="bg-blue-100 h-20 rounded border focus-within:border-blue-600 flex justify-center items-center cursor-pointer">
                  <div htmlFor="productImage" className="flex justify-center items-center flex-col text-center">

                    {
                      forImageLoading ? <MiniLoading/> : (
                        <>
                        <MdOutlineCloudUpload size={35}/>
                        <p>Upload Image</p>
                        </>
                      )
                    }
                    
                  </div>
                  <input
                    type="file"
                    name="productImage"
                    id="productImage"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUploadProductImage}
                  />
                </label>

                {/*Showing Uploaded Images*/}
                <div className="rounded flex gap-5 flex-wrap">
                  {
                    addProductData.image.map((img,index) => {
                      return (
                        <div key={img+index} className='h-25, w-25 min-w-25 rounded focus-within:border-blue-600 relative group'>
                          <img 
                          src={img}
                          alt="product Image"
                          className="w-full mt-3 h-full object-scale-down rounded cursor-pointer"
                          onClick={() => setImageZoom(img)}
                          />

                          <div className="absolute top-0 text-red-500 p-1 hidden group-hover:block cursor-pointer mt-5"
                            onClick={() => handleDeleteImageFromFormData(index)}
                          >
                            <MdDelete size={25}/>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </div>

            { /* Category */}

            <div>
              <label>Category</label>
              <div className="">
                <select
                  className="bg-blue-50 border w-full p-2 rounded-full focus-within:border-blue-600"
                  value={selectMultipleCategory}
                  onChange={handleSelectMultipleCategory}
                >
                  <option value={""}>Select Category</option>
                  {
                    fetchAllCategories.map((cat, index) =>{
                      return (
                        <option key={cat?._id+index+"category"} value={cat?._id}>{cat.name}</option>
                      )
                    })
                  }
                </select>
                
                <div className="flex gap-2 flex-wrap">
                    {
                      addProductData.category.map((cat, index) => {
                        return (
                          <div key={cat._id+"productcategorydata"}
                          className="flex items-center gap-1 text-md mt-1 bg-blue-50"
                          >
                            <p>{cat.name}</p>
                            <div 
                            className="cursor-pointer hover:text-red-500"
                            onClick={() => handleDeleteCategoryFromFormData(index)}
                            >
                              <IoClose size={20}/>
                            </div>
                          </div>
                        )
                      })
                    }
                </div>
              </div>
            </div>


            {/*Sub Category*/}

            <div>
              <label>Sub Category</label>
              <div className="">
                <select
                  className="bg-blue-50 border w-full p-2 rounded-full focus-within:border-blue-600"
                  value={selectMultipleSubCategory}
                  onChange={handleSelectMultipleSubCategory}
                >
                  <option value={""}>Select Sub Category</option>
                  {
                    fetchAllSubCategories.map((cat, index) =>{
                      return (
                        <option key={cat?._id+index+"subCategory"} value={cat?._id}>{cat.name}</option>
                      )
                    })
                  }
                </select>
                
                <div className="flex gap-2 flex-wrap">
                    {
                      addProductData.subCategory.map((cat, index) => {
                        return (
                          <div key={cat._id+"productsubcategorydata"}
                          className="flex items-center gap-1 text-md mt-1 bg-blue-50"
                          >
                            <p>{cat.name}</p>
                            <div 
                            className="cursor-pointer hover:text-red-500"
                            onClick={() => handleDeleteSubCategoryFromFormData(index)}
                            >
                              <IoClose size={20}/>
                            </div>
                          </div>
                        )
                      })
                    }
                </div>
              </div>
            </div>

            <div
             className = "grid gap-1">
              <label htmlFor="unit">Product Unit</label>
              <input 
                id = "unit"
                type="text"
                name="unit"
                placeholder="Enter product unit"
                value = {addProductData.unit}
                onChange={handleChangeOfFormData}
                required
                className = "bg-blue-100 p-2 rounded-full border focus-within:border-blue-600"
              />
            </div>

            <div
             className = "grid gap-1">
              <label htmlFor="stock">Product Stock</label>
              <input 
                id = "stock"
                type="number"
                name="stock"
                placeholder="Enter product stock"
                value = {addProductData.stock}
                onChange={handleChangeOfFormData}
                required
                className = "bg-blue-100 p-2 rounded-full border focus-within:border-blue-600"
              />
            </div>


            <div
             className = "grid gap-1">
              <label htmlFor="price">Product Price</label>
              <input 
                id = "price"
                type="number"
                name="price"
                placeholder="Enter product price"
                value = {addProductData.price}
                onChange={handleChangeOfFormData}
                required
                className = "bg-blue-100 p-2 rounded-full border focus-within:border-blue-600"
              />
            </div>


            <div
             className = "grid gap-1">
              <label htmlFor="discount">Product Discount</label>
              <input 
                id = "discount"
                type="text"
                name="discount"
                placeholder="Enter product discount"
                value = {addProductData.discount}
                onChange={handleChangeOfFormData}
                required
                className = "bg-blue-100 p-2 rounded-full border focus-within:border-blue-600"
              />
            </div>


            <div
             className = "grid gap-1"
             >
              <label htmlFor="description">Description</label>
              <textarea 
                id = "description"
                type="text"
                name="description"
                placeholder="Enter product description"
                value = {addProductData.description}
                onChange={handleChangeOfFormData}
                required
                multiple
                rows={4}
                className = "bg-blue-100 p-2 rounded border focus-within:border-blue-600 resize-none"
              />
            </div>

            {
              Object.keys(addProductData?.more_details)?.map((key, index) => {
                return (
                  <div key={key + index} className="grid gap-1 relative">
                    <label htmlFor={key}>{key}</label>
                    <input
                      id={key}
                      type="text"
                      placeholder="Enter New Details"
                      value={addProductData.more_details[key]}
                      onChange={(e) => handleOnChangeForAddNewFeildsDetails(e, key)}
                      className="bg-blue-100 p-2 rounded-full border focus-within:border-blue-600 pr-10"
                    />

                    {/* Close icon to delete field */}
                    <div
                      className="absolute right-2 top-11  text-red-500 cursor-pointer hover:text-red-700"
                      onClick={() => handleDeleteMoreDetailsField(key)}
                    >
                      <IoClose size={20} />
                    </div>
                  </div>
                );
              })
            }


            <div className="flex justify-end">
              <div
                onClick={() => setOpenAddMoreFeilds(true)}
                className="bg-orange-600 text-center w-32 text-sm text-white p-2 rounded-full cursor-pointer hover:bg-orange-600 transition-all duration-300"
                >
                  Add More Details
              </div>
            </div>

            <button
              type="submit"
              className = "bg-blue-500 text-white p-2 rounded-full font-semibold w-full hover:bg-blue-600 transition-all duration-300">
              Publish Product
            </button>

          </form>
        </div>


        {
          imageZoom && (
            <ImageZoom url={imageZoom} close={() => setImageZoom("")}/>
          )
        }


        {
          openAddMoreFeilds && (
            <AddNewFeildsComponent
              close={() => setOpenAddMoreFeilds(false)}
              value={commingAddFeildsName}
              onChange={(e) => setCommingAddFeildsName(e.target.value)} // ✅ This updates the state
              submit={handleAddFeildsSubmit}
            />
          )
        }
    </section>
  )
}

export default UploadProductPage