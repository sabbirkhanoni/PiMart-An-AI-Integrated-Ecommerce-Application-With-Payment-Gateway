
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Divider from './Divider';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { logout } from '../store/userSlice';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxioxToastError';
import PropTypes from 'prop-types';
import { ImProfile } from "react-icons/im";
import isAdmin from '../utils/checkIsAdmin';
import { 
  FiTrendingUp, 
  FiLayers, 
  FiGrid, 
  FiUploadCloud, 
  FiBox, 
  FiShoppingBag, 
  FiMapPin, 
  FiHeart,
  FiTag,
  FiImage,
  FiUsers,
  FiLogOut 
} from "react-icons/fi";

const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user);
  const wishlistItems = useSelector((state) => state?.wishlist?.wishlistItems || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Logout section
  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.logout,
      });
      if (response.data.success) {
        if (close) close();
        dispatch(logout());
        localStorage.clear();
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleClose = () => {
    if (close) close();
  };

  const currentPath = location.pathname;

  return (
    <div className="space-y-3">
      {/* Profile Header */}
      <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-2xl border border-blue-100/80 flex items-center justify-between">
        <div className="min-w-0 flex-1 pr-2">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-gray-900 text-sm truncate block">
              {user.name || user.mobile || "My Account"}
            </span>
            {isAdmin(user.role) && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white shrink-0">
                ADMIN
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 truncate mt-0.5">
            {user.email || "Store Member"}
          </p>
        </div>

        <Link
          onClick={handleClose}
          to="/dashboard/profile"
          title="View Profile"
          className="w-9 h-9 rounded-xl bg-white border border-blue-200 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors shadow-2xs shrink-0 cursor-pointer"
        >
          <ImProfile size={16} />
        </Link>
      </div>

      <Divider />

      {/* Navigation Links */}
      <div className="space-y-1 text-sm font-medium">
        {isAdmin(user.role) && (
          <>
            <div className="px-3 pt-1 pb-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Business Intelligence
            </div>

            <Link
              onClick={handleClose}
              to="/dashboard/analytics"
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
                currentPath === "/dashboard/analytics" || currentPath === "/dashboard"
                  ? "bg-blue-600 text-white font-bold shadow-sm shadow-blue-200"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <FiTrendingUp size={17} />
              <span>Business Analytics</span>
            </Link>

            <Link
              onClick={handleClose}
              to="/dashboard/admin-orders"
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
                currentPath === "/dashboard/admin-orders"
                  ? "bg-blue-600 text-white font-bold shadow-sm shadow-blue-200"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <FiShoppingBag size={17} />
              <span>Orders Management</span>
            </Link>

            <Link
              onClick={handleClose}
              to="/dashboard/coupons"
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
                currentPath === "/dashboard/coupons"
                  ? "bg-blue-600 text-white font-bold shadow-sm shadow-blue-200"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <FiTag size={17} />
              <span>Coupons & Promos</span>
            </Link>

            <Link
              onClick={handleClose}
              to="/dashboard/banners"
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
                currentPath === "/dashboard/banners"
                  ? "bg-blue-600 text-white font-bold shadow-sm shadow-blue-200"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <FiImage size={17} />
              <span>Banner Sliders</span>
            </Link>

            <Link
              onClick={handleClose}
              to="/dashboard/users"
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
                currentPath === "/dashboard/users"
                  ? "bg-blue-600 text-white font-bold shadow-sm shadow-blue-200"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <FiUsers size={17} />
              <span>Customer Accounts</span>
            </Link>

            <div className="px-3 pt-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Inventory & Catalog
            </div>

            <Link
              onClick={handleClose}
              to="/dashboard/category"
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
                currentPath === "/dashboard/category"
                  ? "bg-blue-600 text-white font-bold shadow-sm shadow-blue-200"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <FiLayers size={17} />
              <span>Categories</span>
            </Link>

            <Link
              onClick={handleClose}
              to="/dashboard/subcategory"
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
                currentPath === "/dashboard/subcategory"
                  ? "bg-blue-600 text-white font-bold shadow-sm shadow-blue-200"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <FiGrid size={17} />
              <span>Sub Categories</span>
            </Link>

            <Link
              onClick={handleClose}
              to="/dashboard/upload-product"
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
                currentPath === "/dashboard/upload-product"
                  ? "bg-blue-600 text-white font-bold shadow-sm shadow-blue-200"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <FiUploadCloud size={17} />
              <span>Upload Product</span>
            </Link>

            <Link
              onClick={handleClose}
              to="/dashboard/product"
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
                currentPath === "/dashboard/product"
                  ? "bg-blue-600 text-white font-bold shadow-sm shadow-blue-200"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <FiBox size={17} />
              <span>All Products</span>
            </Link>

            <div className="px-3 pt-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Customer Account
            </div>
          </>
        )}

        <Link
          onClick={handleClose}
          to="/dashboard/orders"
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
            currentPath === "/dashboard/orders"
              ? "bg-blue-600 text-white font-bold shadow-sm shadow-blue-200"
              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          }`}
        >
          <FiShoppingBag size={17} />
          <span>My Orders</span>
        </Link>

        <Link
          onClick={handleClose}
          to="/dashboard/wishlist"
          className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
            currentPath === "/dashboard/wishlist"
              ? "bg-blue-600 text-white font-bold shadow-sm shadow-blue-200"
              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <FiHeart size={17} />
            <span>My Wishlist</span>
          </div>
          {wishlistItems.length > 0 && (
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                currentPath === "/dashboard/wishlist"
                  ? "bg-white text-blue-600"
                  : "bg-rose-100 text-rose-600"
              }`}
            >
              {wishlistItems.length}
            </span>
          )}
        </Link>

        <Link
          onClick={handleClose}
          to="/dashboard/address"
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
            currentPath === "/dashboard/address"
              ? "bg-blue-600 text-white font-bold shadow-sm shadow-blue-200"
              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          }`}
        >
          <FiMapPin size={17} />
          <span>Saved Addresses</span>
        </Link>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 font-semibold transition-colors cursor-pointer text-left"
          >
            <FiLogOut size={17} />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

UserMenu.propTypes = {
  close: PropTypes.func,
};

export default UserMenu;

