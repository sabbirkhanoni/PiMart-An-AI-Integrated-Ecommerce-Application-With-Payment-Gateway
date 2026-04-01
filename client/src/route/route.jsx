import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { Home } from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import VerifyForgotPasswordOtp from "../pages/VerifyForgotPasswordOTP";
import ResetPassword from "../pages/ResetPassword";
import UserMenuPage from "../pages/mobilePage/UserMenuPage";
import Dashboard from "../layouts/Dashboard";
import PersonalDetails from "../pages/PersonalDetails";
import PersonalOrder from "../pages/PersonalOrder";
import PersonalAddress from "../pages/PersonalAddress";
import CategoryPage from "../pages/CategoryPage";
import SubCategoryPage from "../pages/SubCategoryPage";
import UploadProductPage from "../pages/UploadProductPage";
import ProductPage from "../pages/ProductAdminPage";
import AdminPermission from "../layouts/AdminPermission";
import CategoryWiseProductList from "../pages/CategoryWiseProductList";
import ProductDetailsDisplayPage from "../pages/ProductDetailsDisplayPage";
import CartModel from "../components/DesignModel/CartModel";
import ProceedPage from "../pages/ProceedPage";
import Complete from "../pages/Complete";
import Failed from "../pages/Failed";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "verify-forgot-password-otp",
        element: <VerifyForgotPasswordOtp />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "user",
        element: <UserMenuPage />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
          {
            path: "profile",
            element: <PersonalDetails />,
          },
          {
            path: "orders",
            element: <PersonalOrder />,
          },
          {
            path: "address",
            element: <PersonalAddress />,
          },
          {
            path: "category",
            element: (
              <AdminPermission>
                <CategoryPage />
              </AdminPermission>
            ),
          },
          {
            path: "subcategory",
            element: (
              <AdminPermission>
                <SubCategoryPage />
              </AdminPermission>
            ),
          },
          {
            path: "upload-product",
            element: (
              <AdminPermission>
                <UploadProductPage />
              </AdminPermission>
            ),
          },
          {
            path: "product",
            element: (
              <AdminPermission>
                <ProductPage />
              </AdminPermission>
            ),
          },
        ],
      },
      {
        path: ":category",
        children: [
          {
            path: ":subCategory",
            element: <CategoryWiseProductList />,
          },
        ],
      },
      {
        path: "/product/:product-details",
        element: <ProductDetailsDisplayPage />,
      },
      {
        path: "/cart",
        element: <CartModel />,
      },
      {
        path: "proceed",
        element: <ProceedPage />
      },
      {
        path: "complete",
        element: <Complete />
      },
      {
        path: "failed",
        element: <Failed />
      }
    ],
  },
]);

export default router;
