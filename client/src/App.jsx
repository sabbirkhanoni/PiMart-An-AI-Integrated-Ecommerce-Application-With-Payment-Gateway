import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import fetchUserDetails from "./utils/fetchUserDetails";
import { setUserDetails } from "./store/userSlice";
import { useDispatch } from "react-redux";
import SummaryApi from "./common/SummaryApi";
import {
  setAllCategory,
  setAllSubCategory,
  setLoadingCategory,
} from "./store/productSlice";
import Axios from "./utils/Axios";
import AxiosToastError from "./utils/AxioxToastError";
import { handleAddToCart } from "./store/cart.store";

function App() {
  const dispatch = useDispatch();

  const fetchUser = async () => {
    const userData = await fetchUserDetails();
    dispatch(setUserDetails(userData.data));
  };

  //fetch categories from the server
  const fetchAllCategories = async () => {
    try {
      dispatch(setLoadingCategory(true));
      const response = await Axios({
        ...SummaryApi.getAllCategories,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(setAllCategory(responseData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      dispatch(setLoadingCategory(false));
    }
  };

  //fetch categories from the server
  const fetchAllSubCategories = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getAllSubCategory,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(setAllSubCategory(responseData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      //     setLoading(false);
    }
  };

  //when user login then also fetch the cart products to show in the header
  const fetchCartProducts = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getCartProducts,
      })
      const { data: responseData } = response;

      // he
      if(responseData.success) {
        dispatch(handleAddToCart(responseData.data))
      }

      } catch (error) {
        AxiosToastError(error);
      }
  };

  useEffect(() => {
    fetchCartProducts();
    fetchUser();
    fetchAllCategories();
    fetchAllSubCategories();
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-[78vh] lg:px-5 lg:pb-5">
        <Outlet />
      </main>
      <Footer />

      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerStyle={{}}
        containerClassName=""
        toastOptions={{
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
    </>
  );
}

export default App;
