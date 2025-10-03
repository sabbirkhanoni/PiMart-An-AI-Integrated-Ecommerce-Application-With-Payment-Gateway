
import { CgProfile } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import AxiosToastError from "../utils/AxioxToastError";
import SummaryApi from "../common/SummaryApi";
import PersonalDetailsAvatarChange from "../components/ViewPageComponent/PersonalDetailsAvatarChange";
import Axios from "../utils/Axios";
import toast from "react-hot-toast";
import { setUserDetails } from "../store/userSlice";
import fetchUserDetails from "../utils/fetchUserDetails";


const PersonalDetails = () => {
  // Get user data from Redux store
  const user = useSelector((state) => state.user);
  const [openPersonalDetailsAvatarChange, setOpenPersonalDetailsAvatarChange] = useState(false);

  //whole app will updated the details of the user no need to refresh the page
  const dispatch = useDispatch();

  // for getting the data
  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  });

  //to stop the form data clearing on refresh
  useEffect(() => {
    setUserData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    });
  }, [user]);

  // for updating the form data
  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setUserData((prev) => {
      return {
        ...prev,
        [name]: value,
      }
    })
  }

  const [dataUpdateLoading, setDataUpdateLoading] = useState(false);

  // for updating the user details
  const handleUpdateUserDetailsSubmit = async (e) => {
    e.preventDefault();

    // send the data to the server and save it in the database
    try {
      setDataUpdateLoading(true);

      // send the data to the server
      const response = await Axios({
        ...SummaryApi.updateUserDetails,
        data: userData,
      })

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        setUserData({
          name: responseData.data.name,
          email: responseData.data.email,
          mobile: responseData.data.mobile,
        })

        // update the user data in the redux store
        const userData = await fetchUserDetails();
        dispatch(setUserDetails(userData.data));
      }
       
    } catch (error) {
      AxiosToastError(error);
    }finally {
      setDataUpdateLoading(false);
    }
    
  }

  return (
    <div className="ml-5">
      {/** Avatar Upload And Display Avatar */}

      <div className="flex items-center justify-center bg-red-500 rounded-full overflow-hidden drop-shadow-lg w-30 h-30">
        {user?.avatar ? (
          <img src={user?.avatar} alt={user?.name} className="w-full h-full" />
        ) : (
          <CgProfile size={70} className="text-white" />
        )}
      </div>

      <button
        onClick={() => setOpenPersonalDetailsAvatarChange(true)}
        className="text-sm min-w-30 border px-5 py-1 rounded-full mt-5
      hover:bg-blue-700 text-white bg-blue-500 cursor-pointer"
      >
        Change
      </button>

      {openPersonalDetailsAvatarChange && (
        <PersonalDetailsAvatarChange
          close={() => setOpenPersonalDetailsAvatarChange(false)}
        />
      )}

      {/** User Details --> Name,Mobile,Email, Change Password */}
      <form
        className="my-5 grid gap-4"
        onSubmit={handleUpdateUserDetailsSubmit}
      >
        <div className="grid">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter Your Name"
            className="p-2 bg-blue-50 outline-primary border
          focus-within:border-blue-400 rounded"
            value={userData.name}
            onChange={handleOnChange}
            name="name"
            required
          />
        </div>

        <div className="grid">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter Your Email"
            className="p-2 bg-blue-50 outline-primary border
          focus-within:border-blue-400 rounded"
            value={userData.email}
            onChange={handleOnChange}
            name="email"
            required
          />
        </div>

        <div className="grid">
          <label htmlFor="mobile">Contact No:</label>
          <input
            type="text"
            id="mobile"
            placeholder="Enter Your Contact No"
            className="p-2 bg-blue-50 outline-primary border
          focus-within:border-blue-400 rounded"
            value={userData.mobile}
            onChange={handleOnChange}
            name="mobile"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-700"
        >
          {dataUpdateLoading ? "Loading..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default PersonalDetails