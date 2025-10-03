import { useState } from "react";
import { CgProfile } from "react-icons/cg"
import { useDispatch, useSelector } from "react-redux";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import AxiosToastError from "../../utils/AxioxToastError";
import { updatedAvatar } from "../../store/userSlice";
import { IoCloseCircleSharp } from "react-icons/io5";
import PropTypes from "prop-types";

const PersonalDetailsAvatarChange = ({close}) => {
    // Get user data from Redux store
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [loadingAvatar, setLoadingAvatar] = useState(false);


    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const handleUploadAvatar = async (e) => {
        //select the file
        const file = e.target.files[0];
        if (!file) return;

        //send the file to the server

        const formData = new FormData();
        formData.append("avatar", file);

        try {
            setLoadingAvatar(true);
            //send the file to the server
            const response = await Axios({
                ...SummaryApi.uploadAvatar,
                data: formData,
            });

            const { data : responseData } = response;
            dispatch(updatedAvatar(responseData.data.avatar));
        } catch (error) {
              AxiosToastError(error);
        } finally {
            setLoadingAvatar(false);
        }
    }

  return (
    <section className="fixed top-0 left-0 bottom-0 right-0 bg-neutral-900/50 p-4 flex items-center justify-center">
        <div className="bg-white max-w-sm w-full rounded p-4 flex flex-col items-center justify-center ">
            <button onClick={close} className="w-fit block ml-auto">
              <IoCloseCircleSharp size={20}/>
            </button>

            <div className="flex items-center justify-center bg-red-500 rounded-full overflow-hidden drop-shadow-lg w-20 h-20">
                    {
                      user?.avatar ? (
                        <img src={user?.avatar} alt={user?.name} className="w-full h-full"/>
                      ) : (
                        <CgProfile size={70} className="text-white" />
                      )
                    }
                  </div>
                  <form onSubmit={handleSubmit}>
                    <label htmlFor="uploadAvatar" className="cursor-pointer">
                        <div className="border rounded-full px-3 py-0.5 mt-2 hover:bg-blue-500 hover:text-white text-sm">
                            {
                                loadingAvatar ? "Uploading..." : "Upload"
                            }
                        </div>
                    </label>
                    <input onChange={handleUploadAvatar} type="file" id="uploadAvatar" className="hidden"/>
                </form>


           
        </div>
    </section>
  )
}




PersonalDetailsAvatarChange.propTypes = {
    close: PropTypes.func.isRequired,
};

export default PersonalDetailsAvatarChange