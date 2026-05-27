import React, { useState } from "react";
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
const ProceedPage = () => {
  const {
    cartProductTotalPrice,
    cartWithoutDisTotalPrice,
    savedAmount,
    cartProductTotalQuantity,
    fetchCartProducts,
    fetchOrderedProducts
  } = useGlobalContext();

  const [selectedAddress, setSelectedAddress] = useState(0);
  const [openAddressFormModel, setOpenAddressFormModel] = useState(false);
  const deliveryAddress = useSelector(
    (state) => state?.deliveryAddress?.address,
  );
  const navigate = useNavigate();
  const cartProducts = useSelector((state) => state?.cart?.cart);

  const handleCashOnDelivery = async() => {
    try {
      const response = await Axios({
        ...SummaryApi.cashOnDeliveryPayment,
        data: {
          list_item: cartProducts ,
          addressId: deliveryAddress[selectedAddress]?._id,
          subTotalAmt : cartWithoutDisTotalPrice,
          totalAmt : cartProductTotalPrice
        }
      })

      const { data : responseData } = response

      if(responseData?.success){
        toast.success(responseData?.message || "Cash on delivery successful.")
        if(fetchCartProducts) {
          fetchCartProducts();
        }
        if(fetchOrderedProducts) {
          fetchOrderedProducts();
        }
        navigate("/complete",{
          state: {
            text: "Order Placed Successfully",
          }
        });
      } else {
        toast.error(responseData?.message || "Cash on delivery failed.")
        navigate("/failed",{
          state: {
            text: responseData?.message || "Cash on delivery failed.",
          }
        });
      }

    } catch (error) {
      AxiosToastError(error)
    }
  }

  const handleStripePayment = async () => {
    try {
      toast.loading("Redirecting to Stripe payment gateway...");
      const response = await Axios({
        ...SummaryApi.stripePaymentGateway,
        data: {
          list_item: cartProducts ,
          addressId: deliveryAddress[selectedAddress]?._id,
          subTotalAmt : cartWithoutDisTotalPrice,
          totalAmt : cartProductTotalPrice
        }
      })


      const { data : responseData } = response;
      
      if(responseData?.url) {
        window.location.href = responseData.url;
      } else {
        toast.error("Failed to initiate Stripe payment.")
      }

      if(fetchCartProducts) {
        fetchCartProducts();
      }
      if(fetchOrderedProducts) {
        fetchOrderedProducts();
      }

    } catch (error) {
      console.error("Stripe Payment Error:", error);
      AxiosToastError(error)
    }
  }


  const handleSSLCOMMERZPayment = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.SSLCOMMERZPayment,
        data: {
          list_item: cartProducts,
          addressId: deliveryAddress[selectedAddress]?._id,
        }
      });

      console.log("SSLCommerz Payment Response:", response);
      const { data: responseData } = response;

      console.log("SSLCommerz Payment Response Data:", responseData);

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
  }

  return (
    <section className="bg-white min-h-screen">
      <div className="container mx-auto p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <div className="">
          <h2 className="p-2 rounded mb-4 text-gray-600 border border-gray-300 text-center">
            Set Delivery Address
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 my-2">
            {
                deliveryAddress.map((address, index) => {
                return (
                    <div key={index+"addresscard"}>
                      <AddressCard address={address} index={index} setSelectedAddress={setSelectedAddress} selectedAddress={selectedAddress} />
                    </div>
                );
                })
            }
          </div>
          <div
            onClick={() => setOpenAddressFormModel(true)}
            className="py-2 cursor-pointer w-full rounded-full bg-blue-500 text-white text-center"
          >
            Set up your delivery address
          </div>
        </div>

        <div className="">
          <h2 className="p-2 rounded mb-4 text-gray-600 border border-gray-300 text-center">
            Billing & Payment Method
          </h2>
          <div>Payment form will be here</div>
          <div>
            <div className="flex border border-gray-200 pt-2 flex-col gap-2 px-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Subtotal:</span>
                <span className="font-semibold line-through">
                  {DisplayPriceInBDT(cartWithoutDisTotalPrice)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Discount:</span>
                <span className="font-semibold">
                  {DisplayPriceInBDT(savedAmount)}
                </span>
              </div>
              <div className="flex items-center text-gray-500 py-1 justify-between text-sm">
                <span>Total Product Quantity:</span>
                <span className="font-semibold">
                  {cartProductTotalQuantity} pcs
                </span>
              </div>
              <div className="flex items-center text-gray-500 justify-between text-sm">
                <span>Delivery Charge</span>
                <span className="font-semibold">Free</span>
              </div>
              <div className="flex items-center text-gray-500 justify-between text-sm font-semibold rounded">
                <span>Total:</span>
                <span className="font-semibold">
                  {DisplayPriceInBDT(cartProductTotalPrice)}
                </span>
              </div>
              <div className="flex items-center bg-amber-600 text-white py-1 px-1 justify-between text-sm font-semibold rounded">
                <span>Grand Total:</span>
                <span className="font-semibold">
                  {DisplayPriceInBDT(cartProductTotalPrice)}
                </span>
              </div>
              <div className="grid grid-cols-3 items-center justify-center gap-4 mt-2 pb-4">
                <button
                  onClick={handleCashOnDelivery}
                  className="text-white bg-cyan-800 cursor-pointer p-2 rounded-full hover:bg-green-600 transition-colors duration-300">
                  Cash on Delivery
                </button>
                <button
                  className="text-white bg-blue-500 cursor-pointer p-2 rounded-full hover:bg-green-600 transition-colors duration-300 flex items-center justify-center gap-2"
                  onClick={handleStripePayment}>
                  <HiCurrencyDollar /> Stripe Payment
                </button>
                <button
                  className="text-white bg-pink-700 cursor-pointer p-2 rounded-full hover:bg-green-600 transition-colors duration-300 flex items-center justify-center gap-2"
                  onClick={handleSSLCOMMERZPayment}>
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex justify-center items-center gap-3"><HiCurrencyBangladeshi /> SSLCommerz</div>
                  </div>
                </button>
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
