import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../../contexts/GlobalContext';
import { calculatePriceWithDiscount } from '../../utils/calculatePriceWithDiscount';
import { DisplayPriceInBDT } from '../../utils/DisplayPriceInBDT';
import { useSelector } from 'react-redux';
import AddToCartButton from './AddToCartButton';
import NotFoundImage from '../../assets/no-data.png';
import toast from 'react-hot-toast';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import PropTypes from 'prop-types';

const CartModel = ({ close }) => {
  const {
    cartProductTotalPrice,
    cartWithoutDisTotalPrice,
    savedAmount,
    cartProductTotalQuantity,
  } = useGlobalContext();

  const cartProduct = useSelector((state) => state?.cart?.cart || []);
  const checkUser = useSelector((state) => state?.user);
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    if (checkUser?._id) {
      if (close) {
        close(false);
      }
      navigate('/proceed');
      return;
    }
    toast.error('Please login to proceed to checkout');
  };

  const handleClose = () => {
    if (close) {
      close(false);
    } else {
      navigate('/');
    }
  };

  return (
    <section className="fixed inset-0 w-full h-full z-50 bg-black/50 backdrop-blur-xs flex justify-end">
      {/* Click outside backdrop to close */}
      <div
        className="fixed inset-0 cursor-pointer"
        onClick={handleClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative z-10 bg-white w-full max-w-md h-full max-h-screen flex flex-col shadow-2xl overflow-hidden">
        {/* 1. Header (Fixed at top) */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-200 bg-blue-600 text-white shrink-0 shadow-xs">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} />
            <h3 className="text-base md:text-lg font-bold">Your Cart</h3>
            {cartProductTotalQuantity > 0 && (
              <span className="text-xs font-semibold bg-white/20 text-white px-2.5 py-0.5 rounded-full">
                {cartProductTotalQuantity} {cartProductTotalQuantity === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors duration-200 cursor-pointer text-white"
            title="Close Cart"
          >
            <IoClose size={22} />
          </button>
        </div>

        {/* 2. Scrollable Product List (Fills remaining height) */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2.5 bg-gray-50/50">
          {cartProduct && cartProduct.length > 0 ? (
            <div className="space-y-2.5">
              {cartProduct.map((product, index) => {
                const item = product?.productId;
                const image = Array.isArray(item?.image) ? item?.image[0] : item?.image;
                const unitPrice = calculatePriceWithDiscount(item?.price, item?.discount);
                const itemTotal = unitPrice * (product?.quantity || 1);

                return (
                  <div
                    key={product?._id || item?._id || index}
                    className="border border-gray-200 bg-white rounded-xl p-3 flex items-center gap-3 shadow-xs hover:shadow-sm transition-all"
                  >
                    <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-gray-100 bg-white flex items-center justify-center">
                      <img
                        src={image}
                        alt={item?.name || 'Product'}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs md:text-sm font-semibold text-gray-900 line-clamp-1">
                        {item?.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Price:{' '}
                        <span className="text-blue-600 font-bold">
                          {DisplayPriceInBDT(unitPrice)}
                        </span>
                      </p>

                      <div className="flex items-center justify-between gap-2 mt-2">
                        <span className="text-[11px] text-gray-500">
                          Total:{' '}
                          <span className="font-semibold text-gray-800">
                            {DisplayPriceInBDT(itemTotal)}
                          </span>
                        </span>

                        <div className="w-24">
                          <AddToCartButton
                            productData={item}
                            iconSize={13}
                            className="h-7 px-2 space-x-2 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty Cart View */
            <div className="flex flex-col items-center justify-center h-full py-16 px-4 text-center">
              <img
                src={NotFoundImage}
                alt="Empty Cart"
                className="w-36 h-36 object-contain mb-3 opacity-90"
              />
              <h4 className="text-lg font-bold text-gray-800">Your cart is empty</h4>
              <p className="text-xs text-gray-500 max-w-xs mt-1 mb-5">
                Explore our store and add some awesome products to your cart!
              </p>
              <button
                onClick={handleClose}
                className="px-5 py-2 rounded-full bg-blue-600 text-white font-medium text-xs hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
              >
                Browse Products
              </button>
            </div>
          )}
        </div>

        {/* 3. Footer / Billing & Checkout Button (Always pinned and visible) */}
        {cartProduct && cartProduct.length > 0 && (
          <div className="border-t border-gray-200 bg-white p-3.5 md:p-4 shrink-0 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] space-y-2.5">
            {/* Bill Summary */}
            <div className="space-y-1.5 text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <div className="flex items-center justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold line-through text-gray-400">
                  {DisplayPriceInBDT(cartWithoutDisTotalPrice)}
                </span>
              </div>

              {savedAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-600 font-medium">
                  <span>Savings:</span>
                  <span>-{DisplayPriceInBDT(savedAmount)}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span>Total Items:</span>
                <span className="font-semibold text-gray-800">
                  {cartProductTotalQuantity} pcs
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Delivery Charge:</span>
                <span className="font-semibold text-emerald-600">FREE</span>
              </div>

              <div className="flex items-center justify-between pt-1.5 border-t border-gray-200 text-sm font-bold text-gray-900">
                <span>Grand Total:</span>
                <span className="text-blue-600 text-base">
                  {DisplayPriceInBDT(cartProductTotalPrice)}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full text-white bg-blue-600 hover:bg-blue-700 py-3 px-4 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-between cursor-pointer group"
            >
              <span>Proceed to Checkout</span>
              <div className="flex items-center gap-1.5 bg-blue-700/60 px-3 py-1 rounded-lg text-xs font-bold">
                <span>{DisplayPriceInBDT(cartProductTotalPrice)}</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

CartModel.propTypes = {
  close: PropTypes.func,
};

export default CartModel;
