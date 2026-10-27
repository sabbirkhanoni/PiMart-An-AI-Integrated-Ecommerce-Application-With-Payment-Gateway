import { useState } from 'react';
import PropTypes from 'prop-types';
import EditProductByAdmin from '../ViewPageComponent/EditProductByAdmin';
import ConfirmationPermissionBox from '../Mini/ConfirmationPermissionBox';
import AxiosToastError from '../../utils/AxioxToastError';
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SummaryApi';
import toast from 'react-hot-toast';
import { DisplayPriceInBDT } from '../../utils/DisplayPriceInBDT';
import { calculatePriceWithDiscount } from '../../utils/calculatePriceWithDiscount';
import { FiEdit3, FiTrash2 } from 'react-icons/fi';

const ProductDisplayDesignCardAdmin = ({ productData, fetchAllProducts }) => {
  const [editPanelOpen, setEditPanelOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleCancelDelete = () => {
    setOpenDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteProduct,
        data: {
          _id: productData?._id,
        },
      });

      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message || 'Product deleted successfully');
        setOpenDeleteModal(false);
        if (fetchAllProducts) {
          fetchAllProducts();
        }
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const hasDiscount = Number(productData?.discount) > 0;
  const stock = Number(productData?.stock) || 0;
  const finalPrice = hasDiscount
    ? calculatePriceWithDiscount(productData?.price, productData?.discount)
    : productData?.price;

  return (
    <div className="w-full max-w-[260px] bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between p-3.5 group">
      {/* 1. Image Showcase Frame */}
      <div className="relative w-full h-[140px] bg-gradient-to-b from-gray-50 to-gray-100/70 rounded-xl p-3 flex items-center justify-center overflow-hidden mb-3">
        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute top-2.5 left-2.5 z-10 bg-rose-500 text-white font-semibold text-[11px] px-2.5 py-0.5 rounded-full shadow-2xs">
            {productData.discount}% OFF
          </span>
        )}

        {/* Stock Badge */}
        <span
          className={`absolute top-2.5 right-2.5 z-10 font-medium text-[11px] px-2.5 py-0.5 rounded-full shadow-2xs border ${
            stock > 0
              ? 'bg-white/95 text-gray-600 border-gray-200/80'
              : 'bg-rose-50 text-rose-600 border-rose-200'
          }`}
        >
          {stock > 0 ? `${stock} left` : 'Out of stock'}
        </span>

        {/* Product Image */}
        <img
          src={productData?.image?.[0]}
          alt={productData?.name || 'Product'}
          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-2xs"
        />
      </div>

      {/* 2. Product Details */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Product Title */}
        <h3
          className="font-semibold text-sm md:text-[15px] text-gray-800 line-clamp-2 min-h-[40px] leading-snug group-hover:text-blue-600 transition-colors"
          title={productData?.name}
        >
          {productData?.name}
        </h3>

        {/* Horizontal Meta Row (Unit on left, Price on right) */}
        <div className="mt-2.5 pt-2.5 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
            {productData?.unit || 'Item'}
          </span>

          <div className="flex items-baseline gap-1.5">
            {hasDiscount ? (
              <>
                <span className="text-[15px] font-semibold text-emerald-600">
                  {DisplayPriceInBDT(finalPrice)}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  {DisplayPriceInBDT(productData?.price)}
                </span>
              </>
            ) : (
              <span className="text-[15px] font-semibold text-gray-700">
                {DisplayPriceInBDT(productData?.price || 0)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5 mt-3.5 pt-2.5 border-t border-gray-100">
        <button
          type="button"
          onClick={() => setEditPanelOpen(true)}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-50/90 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-200 text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer active:scale-95 shadow-2xs"
          title="Edit Product"
        >
          <FiEdit3 size={14} />
          <span>Edit</span>
        </button>

        <button
          type="button"
          onClick={() => setOpenDeleteModal(true)}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-50/90 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer active:scale-95 shadow-2xs"
          title="Delete Product"
        >
          <FiTrash2 size={14} />
          <span>Delete</span>
        </button>
      </div>

      {/* Edit Product Modal */}
      {editPanelOpen && (
        <EditProductByAdmin
          productData={productData}
          close={() => setEditPanelOpen(false)}
          fetchAllProducts={fetchAllProducts}
        />
      )}

      {/* Delete Confirmation Modal */}
      {openDeleteModal && (
        <ConfirmationPermissionBox
          confirm={handleConfirmDelete}
          close={handleCancelDelete}
        />
      )}
    </div>
  );
};

ProductDisplayDesignCardAdmin.propTypes = {
  productData: PropTypes.object,
  fetchAllProducts: PropTypes.func,
};

export default ProductDisplayDesignCardAdmin;
