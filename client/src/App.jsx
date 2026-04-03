import { Outlet, useLocation } from "react-router-dom";
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
import GlobalContexts from "./contexts/GlobalContext";
import { FaShoppingCart } from "react-icons/fa";
import CartDesignMobileView from "./components/DesignModel/CartDesignMobileView";
import SaveAmount from "./components/Mini/SaveAmount";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

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
        dispatch(setAllCategory(responseData.data.sort((a, b) => a.name.localeCompare(b.name))));
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
        dispatch(setAllSubCategory(responseData.data.sort((a, b) => a.name.localeCompare(b.name))));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      //     setLoading(false);
    }
  };

  

  useEffect(() => {
    fetchUser();
    fetchAllCategories();
    fetchAllSubCategories();
  }, []);

  return (
    <GlobalContexts>
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
      
      {
        (location.pathname === "/") && (
          <>
            <SaveAmount />
            <CartDesignMobileView />
          </>
        )
      }
      
    </GlobalContexts>
  );
}

export default App;
