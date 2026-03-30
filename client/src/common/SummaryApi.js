//backend server url

export const baseURL = "http://localhost:8080";

const SummaryApi = {
  register: {
    url: "/api/user/register",
    method: "post",
  },
  login: {
    url: "/api/user/login",
    method: "post",
  },
  forgotPassword: {
    url: "/api/user/forgot-password",
    method: "post",
  },
  verifyForgotPasswordOtp: {
    url: "/api/user/verify-forgot-password-otp",
    method: "put",
  },
  resetPassword: {
    url: "/api/user/reset-password",
    method: "put",
  },
  refreshToken: {
    url: "/api/user/refresh-token",
    method: "post",
  },
  userDetails: {
    url: "/api/user/user-details",
    method: "get",
  },
  logout: {
    url: "/api/user/logout",
    method: "get",
  },
  uploadAvatar: {
    url: "/api/user/upload-avatar",
    method: "put",
  },
  updateUserDetails: {
    url: "/api/user/update-user",
    method: "put",
  },
  uploadImage: {
    url: "/api/file/upload",
    method: "post",
  },
  addCategory: {
    url: "/api/category/create",
    method: "post",
  },
  getAllCategories: {
    url: "/api/category/get",
    method: "get",
  },
  updateCategory: {
    url: "/api/category/update",
    method: "put",
  },
  deleteCategory: {
    url: "/api/category/delete",
    method: "delete",
  },
  addSubCategory: {
    url: "/api/subcategory/create",
    method: "post",
  },
  getAllSubCategory: {
    url: "/api/subcategory/get",
    method: "get",
  },
  updateSubCategory: {
    url: "/api/subcategory/update",
    method: "put",
  },
  deleteSubCategory: {
    url: "/api/subcategory/delete",
    method: "delete",
  },
  addProduct: {
    url: "/api/product/create",
    method: "post",
  },
  getAllProducts: {
    url: "/api/product/get",
    method: "post",
  },
  updateProduct: {
    url: "/api/product/update-product",
    method: "put",
  },
  getProductByCategoryWise: {
    url: "/api/product/get-product-by-categorywise",
    method: "post",
  },
  getProductByCategoryAndSubCategoryParams: {
    url: "/api/product/get-products-by-categorywise-subcategorywise",
    method: "post",
  },
  getSingleProductDetails: {
    url: "/api/product/get-product-details",
    method: "post",
  },
  deleteProduct: {
    url: "/api/product/delete-product",
    method: "delete",
  },
  searchProduct: {
    url: "/api/product/search-product",
    method: "post"
  },
  addProductToCart: {
    url: "/api/cart/add",
    method: "post"
  },
  getCartProducts: {
    url: "/api/cart/get",
    method: "get"
  },
  updateCartProduct: {
    url: "/api/cart/update",
    method: "put"
  },
  deleteCartProduct: {
    url: "/api/cart/delete",
    method: "delete"
  },
  addDeliveryAddress: {
    url: "/api/delivery-address/add",
    method: "post"
  },
  getAllDeliveryAddressOfUser: {
    url: "/api/delivery-address/all",
    method: "get"
  }
};

export default SummaryApi;
