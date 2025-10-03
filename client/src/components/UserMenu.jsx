
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import  Divider from './Divider';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { logout } from '../store/userSlice';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxioxToastError';
import PropTypes from 'prop-types';
import { ImProfile } from "react-icons/im";
import isAdmin from '../utils/checkIsAdmin';

const UserMenu = ({close}) => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
  //logout section
  const handleLogout = async() => {
    try {
      const response = await Axios({
        ...SummaryApi.logout
      })
      if(response.data.success){
        //clear the user data from redux store
        if(close){
          close();
        }

       
       dispatch(logout());
       localStorage.clear();
      toast.success(response.data.message);
      navigate("/");
      }
    } catch(error){
      AxiosToastError(error);
    }

    }


    //for closing the menu
    const handleClose = () => {
        if(close){
            close();
        }
    }

  return (
    <div>
        <div className='font-semibold text-lg'>Profile</div>
        <div className='text-lg flex items-center gap-5'>
          <span className='max-w-52 text-ellipsis line-clamp-1'>{user.name || user.mobile} </span>
          <Link onClick={handleClose} to={"/dashboard/profile"} className='hover:bg-blue-500 hover:text-white'>
            <ImProfile size={20}/>
          </Link>
          <span className="text-blue-600 font-semibold text-sm">
            { isAdmin(user.role) ? "(ADMIN)" : ""}
            </span>
        </div>

        <Divider/>
        <div className='text-md grid gap-2'>

            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/category"} className='px-2 hover:bg-blue-500 hover:text-white py-2'>Category</Link>
              )
            }

            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/subcategory"} className='px-2 hover:bg-blue-500 hover:text-white py-2'>Sub Category</Link>
              )
            }

           {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/upload-product"} className='px-2 hover:bg-blue-500 hover:text-white py-2'>Upload Products</Link>
              )
            }

          {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/product"} className='px-2 hover:bg-blue-500 hover:text-white py-2'>Products</Link> 
              )
            }

            <Link onClick={handleClose} to={"/dashboard/orders"} className='px-2 hover:bg-blue-500 hover:text-white py-2'>Orders</Link>
            <Link onClick={handleClose} to={"/dashboard/address"} className='px-2  hover:bg-blue-500 hover:text-white py-2'>Address</Link>
            <button onClick={handleLogout} className='text-left px-2 hover:bg-blue-500 hover:text-white py-2'>Log Out</button>
        </div>
    </div>
  )
}

UserMenu.propTypes = {
    close : PropTypes.func
}

export default UserMenu;

