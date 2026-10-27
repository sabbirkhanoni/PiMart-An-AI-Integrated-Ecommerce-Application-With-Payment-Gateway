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
import AnalyticsDashboardPage from "../pages/AnalyticsDashboardPage";
import AdminOrdersPage from "../pages/AdminOrdersPage";
import CategoryWiseProductList from "../pages/CategoryWiseProductList";
import ProductDetailsDisplayPage from "../pages/ProductDetailsDisplayPage";
import CartModel from "../components/DesignModel/CartModel";
import ProceedPage from "../pages/ProceedPage";
import Complete from "../pages/Complete";
import Failed from "../pages/Failed";
import WishlistPage from "../pages/WishlistPage";
import AdminCouponsPage from "../pages/AdminCouponsPage";
import DashboardIndex from "../components/DashboardIndex";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
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
            path: "",
            element: <DashboardIndex />,
          },
          {
            path: "analytics",
            element: (
              <AdminPermission>
                <AnalyticsDashboardPage />
              </AdminPermission>
            ),
          },
          {
            path: "admin-orders",
            element: (
              <AdminPermission>
                <AdminOrdersPage />
              </AdminPermission>
            ),
          },
          {
            path: "coupons",
            element: (
              <AdminPermission>
                <AdminCouponsPage />
              </AdminPermission>
            ),
          },
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
            path: "wishlist",
            element: <WishlistPage />,
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
        path: "product/:product-details",
        element: <ProductDetailsDisplayPage />,
      },
      {
        path: "cart",
        element: <CartModel />,
      },
      {
        path: "proceed",
        element: <ProceedPage />
      },
    ],
  },
  {
    path: "/payment-complete/:tran_id",
    element: <Complete />
  },
  {
    path: "/payment-failed/:tran_id",
    element: <Failed />
  },
  {
    path: "/payment-cancel/:tran_id",
    element: <Failed />
  },
]);

export default router;
