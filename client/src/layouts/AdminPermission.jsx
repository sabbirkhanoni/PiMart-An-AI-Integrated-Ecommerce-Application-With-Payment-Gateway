import { useSelector } from "react-redux";
import isAdmin from "../utils/checkIsAdmin";
import PropTypes from "prop-types";
import noAccessImage from "../assets/no-access.jpg";


const AdminPermission = ({children}) => {
  const user = useSelector(state=> state.user);
  return (
    <>
    {
        isAdmin(user.role) ? children : 
        <div>
            <div className="text-center bg-red-400/60 py-4 mt-1 text-2xl border-red-800 border-1 text-blue-950 text-md rounded">
                You do not have permission to access this page
            </div>
            
            <img src={noAccessImage} alt="no-access"
            className="w-96 h-80 object-contain mx-auto mt-4"/>
            
        </div>
    }
    </>
  )
}
AdminPermission.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminPermission;