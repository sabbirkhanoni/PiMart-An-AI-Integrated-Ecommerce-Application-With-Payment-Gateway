import { useState, useEffect } from "react";
import { useGlobalContext } from "../contexts/GlobalContext";
import { DisplayPriceInBDT } from "../utils/DisplayPriceInBDT";
import { useNavigate } from "react-router-dom";
import AddressForm from "../components/ViewPageComponent/AddressForm";
import { useSelector } from "react-redux";
import AddressCard from "../components/DesignModel/AddressCard";
import AxiosToastError from "../utils/AxioxToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { HiCurrencyBangladeshi, HiCurrencyDollar } from "react-icons/hi";
import { Ticket, Tag, CheckCircle2, X, Plus, ShieldCheck } from "lucide-react";

const ProceedPage = () => {
  const {
    cartProductTotalPrice,
    cartWithoutDisTotalPrice,
    savedAmount,
    cartProductTotalQuantity,
    fetchCartProducts,
    fetchOrderedProducts,
  } = useGlobalContext();

  const [selectedAddress, setSelectedAddress] = useState(0);
  const [openAddressFormModel, setOpenAddressFormModel] = useState(false);

  // Coupon state
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const couponDiscountAmount = appliedCoupon?.discountAmount || 0;
  const finalPayableTotal = Math.max(0, cartProductTotalPrice - couponDiscountAmount);

  const deliveryAddress = useSelector((state) => state?.deliveryAddress?.address);
  const navigate = useNavigate();
  const cartProducts = useSelector((state) => state?.cart?.cart);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleApplyCoupon = async (e) => {
    e?.preventDefault();
    if (!couponCodeInput.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    try {
      setApplyingCoupon(true);
      const response = await Axios({
        ...SummaryApi.applyCoupon,
        data: {
          code: couponCodeInput.trim(),
          subtotal: cartProductTotalPrice,
        },
      });

      if (response.data.success) {
        setAppliedCoupon(response.data.data);
        toast.success(response.data.message || "Coupon applied successfully!");
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput("");
    toast.success("Coupon removed.");
  };

  const handleCashOnDelivery = async () => {
    try {
      if (
        !deliveryAddress ||
        deliveryAddress.length === 0 ||
        !deliveryAddress[selectedAddress]?._id
      ) {
        toast.error("Please add and select a delivery address.");
        return;
      }

      if (!cartProducts || cartProducts.length === 0) {
        toast.error("Your cart is empty.");
        return;
      }

      const response = await Axios({
        ...SummaryApi.cashOnDeliveryPayment,
        data: {
          list_item: cartProducts,
          addressId: deliveryAddress[selectedAddress]?._id,
          subTotalAmt: cartWithoutDisTotalPrice,
          totalAmt: finalPayableTotal,
          couponCode: appliedCoupon?.code || "",
          couponDiscount: couponDiscountAmount,
        },
      });

      const { data: responseData } = response;

      if (responseData?.success) {
        toast.success(responseData?.message || "Cash on delivery successful.");
        if (fetchCartProducts) {
          fetchCartProducts();
        }
        if (fetchOrderedProducts) {
          fetchOrderedProducts();
        }
        navigate("/complete", {
          state: {
            text: "Order Placed Successfully",
          },
        });
      } else {
        toast.error(responseData?.message || "Cash on delivery failed.");
        navigate("/failed", {
          state: {
            text: responseData?.message || "Cash on delivery failed.",
          },
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleStripePayment = async () => {
    try {
      if (
        !deliveryAddress ||
        deliveryAddress.length === 0 ||
        !deliveryAddress[selectedAddress]?._id
      ) {
        toast.error("Please add and select a delivery address.");
        return;
      }

      if (!cartProducts || cartProducts.length === 0) {
        toast.error("Your cart is empty.");
        return;
      }

      toast.loading("Redirecting to Stripe payment gateway...");
      const response = await Axios({
        ...SummaryApi.stripePaymentGateway,
        data: {
          list_item: cartProducts,
          addressId: deliveryAddress[selectedAddress]?._id,
          subTotalAmt: cartWithoutDisTotalPrice,
          totalAmt: finalPayableTotal,
          couponCode: appliedCoupon?.code || "",
          couponDiscount: couponDiscountAmount,
        },
      });

      const { data: responseData } = response;
      if (responseData?.url) {
        window.location.href = responseData.url;
      }

      if (fetchCartProducts) {
        fetchCartProducts();
      }
      if (fetchOrderedProducts) {
        fetchOrderedProducts();
      }
    } catch (error) {
      console.error("Stripe Payment Error:", error);
      AxiosToastError(error);
    }
  };

  const handleSSLCOMMERZPayment = async () => {
    try {
      if (
        !deliveryAddress ||
        deliveryAddress.length === 0 ||
        !deliveryAddress[selectedAddress]?._id
      ) {
        toast.error("Please add and select a delivery address.");
        return;
      }

      if (!cartProducts || cartProducts.length === 0) {
        toast.error("Your cart is empty.");
        return;
      }

      const response = await Axios({
        ...SummaryApi.SSLCOMMERZPayment,
        data: {
          list_item: cartProducts,
          addressId: deliveryAddress[selectedAddress]?._id,
          totalAmt: finalPayableTotal,
          couponCode: appliedCoupon?.code || "",
          couponDiscount: couponDiscountAmount,
        },
      });

      const { data: responseData } = response;

      if (responseData?.url) {
        window.location.href = responseData.url;
        toast.success(responseData?.message || "Redirecting to SSLCommerz payment gateway...");
      } else {
        toast.error(responseData?.message || "Failed to initiate SSLCommerz payment.");
        return;
      }

      if (fetchCartProducts) {
        fetchCartProducts();
      }
      if (fetchOrderedProducts) {
        fetchOrderedProducts();
      }
    } catch (error) {
      console.error("SSLCommerz Payment Error:", error);
      AxiosToastError(error);
    }
  };

  return (
    <section className="bg-gray-50/50 min-h-screen py-4 md:py-8">
      <div className="container mx-auto px-3 md:px-4 max-w-6xl">
        <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
          <span>Checkout & Secure Payment</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Delivery Address Selection */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 shadow-xs p-4 md:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="font-extrabold text-gray-900 text-base md:text-lg">
                1. Delivery Address
              </h2>
              <button
                type="button"
                onClick={() => setOpenAddressFormModel(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Add New Address</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2">
              {deliveryAddress && deliveryAddress.length > 0 ? (
                deliveryAddress.map((address, index) => (
                  <div key={index + "addresscard"}>
                    <AddressCard
                      address={address}
                      index={index}
                      setSelectedAddress={setSelectedAddress}
                      selectedAddress={selectedAddress}
                    />
                  </div>
                ))
              ) : (
                <div className="sm:col-span-2 text-center py-8 text-gray-400 text-sm">
                  No addresses found. Please add a delivery address to continue.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Promo Code & Billing & Payment */}
          <div className="lg:col-span-5 space-y-4">
            {/* Promo Code Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-4 md:p-5 space-y-3">
              <div className="flex items-center gap-2 text-gray-800 font-bold text-sm">
                <Ticket size={18} className="text-purple-600" />
                <span>Have a Promo Code or Coupon?</span>
              </div>

              {!appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon Code (e.g. SAVE20)"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm font-mono font-bold uppercase focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={applyingCoupon || !couponCodeInput.trim()}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    {applyingCoupon ? "Applying..." : "Apply"}
                  </button>
                </form>
              ) : (
                <div className="p-3 bg-purple-50/80 border border-purple-200 rounded-xl flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-extrabold text-purple-700 text-xs sm:text-sm">
                          {appliedCoupon.code}
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded">
                          APPLIED
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 truncate">
                        Saved ৳{appliedCoupon.discountAmount} on this order!
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                    title="Remove coupon"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Billing Summary Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-4 md:p-5 space-y-4">
              <h2 className="font-extrabold text-gray-900 text-base border-b border-gray-100 pb-2">
                2. Order Summary
              </h2>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Items Subtotal:</span>
                  <span className="font-semibold text-gray-800">
                    {DisplayPriceInBDT(cartWithoutDisTotalPrice)}
                  </span>
                </div>

                {savedAmount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600">
                    <span>Store Discount:</span>
                    <span className="font-semibold">
                      -{DisplayPriceInBDT(savedAmount)}
                    </span>
                  </div>
                )}

                {appliedCoupon && (
                  <div className="flex items-center justify-between text-purple-600 font-semibold bg-purple-50/60 p-1.5 rounded-lg">
                    <span className="flex items-center gap-1">
                      <Tag size={13} />
                      <span>Coupon ({appliedCoupon.code}):</span>
                    </span>
                    <span>-{DisplayPriceInBDT(couponDiscountAmount)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Total Items:</span>
                  <span>{cartProductTotalQuantity} pcs</span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Shipping & Delivery:</span>
                  <span className="text-emerald-600 font-bold">FREE</span>
                </div>

                <div className="border-t border-gray-200 pt-3 flex items-center justify-between text-base font-extrabold text-gray-900">
                  <span>Grand Total:</span>
                  <span className="text-lg text-blue-600 font-black">
                    {DisplayPriceInBDT(finalPayableTotal)}
                  </span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  Select Payment Method
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={handleCashOnDelivery}
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/30 text-gray-800 text-xs font-bold transition-all cursor-pointer shadow-2xs group"
                  >
                    <ShieldCheck size={20} className="text-cyan-700 mb-1 group-hover:scale-110 transition-transform" />
                    <span>Cash on Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleStripePayment}
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/30 text-gray-800 text-xs font-bold transition-all cursor-pointer shadow-2xs group"
                  >
                    <HiCurrencyDollar size={22} className="text-blue-600 mb-0.5 group-hover:scale-110 transition-transform" />
                    <span>Stripe Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSSLCOMMERZPayment}
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-gray-200 hover:border-pink-500 hover:bg-pink-50/30 text-gray-800 text-xs font-bold transition-all cursor-pointer shadow-2xs group"
                  >
                    <HiCurrencyBangladeshi size={22} className="text-pink-600 mb-0.5 group-hover:scale-110 transition-transform" />
                    <span>SSLCommerz</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {openAddressFormModel && (
        <AddressForm close={() => setOpenAddressFormModel(false)} />
      )}
    </section>
  );
};

export default ProceedPage;
