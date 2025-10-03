import { useState } from "react";
import { IoClose, IoCloseCircleSharp } from "react-icons/io5";
import uploadImage from "../../utils/UploadImage";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import SummaryApi from "../../common/SummaryApi";
import Axios from "../../utils/Axios";
import toast from "react-hot-toast";
import AxiosToastError from "../../utils/AxioxToastError";

const UploadSubCategoryModel = ({ close, fetchAllSubCategory }) => {
  const [subCategoryData, setSubCategoryData] = useState({
    name: "",
    image: "",
    category: [],
  });

  const allCategory = useSelector((state) => state.product.allCategory);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSubCategoryData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleUploadSubCategoryImage = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const response = await uploadImage(file);

    setSubCategoryData((prev) => {
      return {
        ...prev,
        image: response.data.url,
      };
    });
  };

  const handleChangeCategoryDropDown = (e) => {
    const value = e.target.value;

    const categoryDetails = allCategory.find((el) => el._id === value);
    setSubCategoryData((prev) => {
      return {
        ...prev,
        category: [...prev.category, categoryDetails],
      };
    });
  };

  const handleRemoveCategorySelected = (categoryId)=>{
    const index = subCategoryData.category.findIndex(el => el._id === categoryId )
    subCategoryData.category.splice(index,1)
    setSubCategoryData((preve)=>{
        return{
            ...preve
        }
    })
  }

  const handleSubmitSubCategory = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...SummaryApi.addSubCategory,
        data: subCategoryData,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        if(close) {
          close();
        }
        if(fetchAllSubCategory){
          fetchAllSubCategory();
        }

        setSubCategoryData({
          name: "",
          image: "",
          category: [],
        });

      }
    } catch (error) {
      AxiosToastError(error);
    }
  }

  return (
    <section
      className="fixed top-0 bottom-0 left-0 right-0 bg-neutral-700/50 z-50 p-4
        flex justify-center items-center"
    >
      <div className="w-full max-w-6xl bg-white rounded p-4">
        <div className="flex justify-between items-center gap-3">
          <h1 className="text-lg font-">Add Sub Category</h1>
          <button onClick={close}>
            <IoCloseCircleSharp size={25} />
          </button>
        </div>

        <form className="my-3 grid gap-3" onSubmit={handleSubmitSubCategory}>
          <div className="grid gap-1">
            <label htmlFor="name">Sub-Category Name</label>
            <input
              type="text"
              placeholder="Sub-Category Name"
              id="name"
              name="name"
              value={subCategoryData.name}
              onChange={handleChange}
              className="bg-blue-100 p-2 rounded outline-none focus-within:border-blue-400 border"
            />
          </div>
          <div className="grid gap-1">
            <p>Image</p>
            <div className="gap-4 flex flex-col lg:flex-row items-center">
              <div className="border h-36 w-full lg:w-36 bg-blue-100 rounded flex items-center justify-center">
                {subCategoryData.image ? (
                  <img
                    src={subCategoryData.image}
                    alt="Subcategory"
                    className="w-full h-full object-scale-down"
                  />
                ) : (
                  <p className="text-md text-center text-gray-500">No Image</p>
                )}
              </div>
              <label htmlFor="uploadSubCategoryImage">
                <div
                  className="bg-green-500 rounded-full px-7 py-1
                          text-white hover:bg-green-600 mt-1 cursor-pointer"
                >
                  Upload
                </div>
                <input
                  type="file"
                  id="uploadSubCategoryImage"
                  name="uploadSubCategoryImage"
                  className="hidden"
                  onChange={handleUploadSubCategoryImage}
                />
              </label>
            </div>
            <div className="grid gap-1">
              <label>Select Category</label>

              <div className="border focus-within:border-primary-200 rounded">
                {/*display value**/}
                <div className="flex flex-wrap gap-2">
                  {subCategoryData.category.map((cat, index) => {
                    return (
                      <p
                        key={cat._id + "selectedValue"+index}
                        className="bg-white shadow-md px-1 m-1 flex items-center gap-2"
                      >
                        {cat.name}
                        <div
                          className="cursor-pointer hover:text-red-600"
                          onClick={() => handleRemoveCategorySelected(cat._id)}
                        >
                          <IoClose size={20} />
                        </div>
                      </p>
                    );
                  })}
                </div>

                <select
                  className="bg-blue-100 border  w-full p-3 rounded outline-none"
                  onChange={handleChangeCategoryDropDown}
                >
                  <option value="">--Select Sub Caterory--</option>
                  {allCategory.map((category, index) => {
                    return (
                      <option
                        key={category._id + "subcategory" + index}
                        value={category?._id}
                      >
                        {category.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>

          <button
           className={`py-2 rounded-full
            ${subCategoryData?.name && subCategoryData?.image && subCategoryData?.category[0] ? "bg-blue-500  hover:bg-blue-600" : "bg-gray-300  hover:bg-gray-600"}
            text-white transition-all duration-300`}
          >
            Add Sub Category
          </button>
          
        </form>
      </div>
    </section>
  );
};

UploadSubCategoryModel.propTypes = {
  close: PropTypes.func.isRequired,
};

export default UploadSubCategoryModel;
