import React, { useState } from "react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import AxiosToastError from "../../utils/AxioxToastError";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { useGlobalContext } from "../../contexts/GlobalContext";


const AddressEditForm = ({ close, editData }) => {
    const [addressData, setAddressData] = useState({
        homeName: editData?.homeName || "",
        roadName: editData?.roadName || "",
        zipCode: editData?.zipCode || "",
        city: editData?.city || "",
        country: editData?.country || "",
        mobile: editData?.mobile || ""
    });

    const {fetchUserDeliveryAddress} = useGlobalContext();

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        try {
           const response = await Axios({
                ...SummaryApi.editDeliveryAddress,
                data: {
                    _id: editData?._id,
                    homeName: addressData.homeName,
                    roadName: addressData.roadName,
                    zipCode: addressData.zipCode,
                    city: addressData.city,
                    country: addressData.country,
                    mobile: addressData.mobile
                }
           });

            const { data: responseData } = response;

            if(responseData.success) {
            toast.success(responseData.message);
            fetchUserDeliveryAddress();
            close();
            }

        } catch (error) {
            AxiosToastError(error);
        }
    }

    
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setAddressData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }

  return (
    <section className="fixed bg-neutral-500/40 backdrop-blur-sm top-0 left-0 w-full h-screen z-50 flex items-center justify-center overflow-auto">
      <div className="bg-white rounded-lg p-7 mx-3 w-full max-w-md">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
          <button>
            <IoClose
              onClick={close}
              size={25}
              className="bg-blue-400 cursor-pointer rounded-full p-1 hover:bg-blue-600 text-white"
            />
          </button>
        </div>
        <form className="flex flex-col" onSubmit={handleOnSubmit}>
          <div>
            <label htmlFor="homeName" className="block mb-1 text-gray-600">
              Home Name
            </label>
            <input
              name="homeName"
              value={addressData.homeName}
              required
              onChange={handleOnChange}
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              placeholder="Enter your home name"
            />
          </div>
          <div>
            <label htmlFor="roadName" className="block mb-1 text-gray-600">
              Road Name
            </label>
            <input
              name="roadName"
              required
              value={addressData.roadName}
              onChange={handleOnChange}
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              placeholder="Enter your road name"
            />
          </div>
          <div>
            <label htmlFor="zipCode" className="block mb-1 text-gray-600">
              Zip Code
            </label>
            <input
              name="zipCode"
              required
              value={addressData.zipCode}
              onChange={handleOnChange}
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              placeholder="Enter your zip code"
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="city" className="mb-1 text-gray-600">
              City
            </label>
            <select
              name="city"
              required
              onChange={handleOnChange}
              value={addressData.city}
              className="border border-gray-300 rounded px-3 py-2 mb-4"
            >
              <option className="" disabled value="">
                --Select your city--
              </option>
              <option value="Dhaka">Dhaka</option>
              <option value="Chittagong">Chittagong</option>
              <option value="Khulna">Khulna</option>
              <option value="Rajshahi">Rajshahi</option>
              <option value="Sylhet">Sylhet</option>
              <option value="Barisal">Barisal</option>
              <option value="Rangpur">Rangpur</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="country" className="block mb-1 text-gray-600">
              Country
            </label>
            <select
              name="country"
              required
              onChange={handleOnChange}
              value={addressData.country}
              className="border border-gray-300 rounded px-3 py-2 mb-4"
            >
              <option className="" disabled value="">
                --Select your country--
              </option>
              <option value="Bangladesh">Bangladesh</option>
            </select>
          </div>
          <div>
            <label htmlFor="mobile" className="block mb-1 text-gray-600">
              Mobile No
            </label>
            <input
              name="mobile"
              required
              value={addressData.mobile}
              onChange={handleOnChange}
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              placeholder="Enter your mobile number"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 w-full text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
          >
            Update Address
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddressEditForm;
