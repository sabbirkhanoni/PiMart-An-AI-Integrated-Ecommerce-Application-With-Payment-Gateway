//backend server url

export const baseURL = import.meta.env.VITE_API_URL;

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
  },
  editDeliveryAddress: {
    url: "/api/delivery-address/edit",
    method: "put"
  },
  stripePaymentGateway: {
    url: "/api/order/stripe-payment",
    method: "post"
  },
  SSLCOMMERZPayment: {
    url: "/api/sslcommerz-payment",
    method: "post"
  },
  deleteDeliveryAddress: {
    url: "/api/delivery-address/delete",
    method: "delete"
  },
  cashOnDeliveryPayment: {
    url: "/api/order/cash-on-delivery-payment",
    method: "post"
  },
  getAllOrderedProductDetails: {
    url: "/api/order/order-details",
    method: "get"
  },
  getAdminAnalyticsOverview: {
    url: "/api/analytics/overview",
    method: "get"
  },
  getAllOrdersForAdmin: {
    url: "/api/analytics/all-orders",
    method: "get"
  },
  updateOrderStatus: {
    url: "/api/analytics/update-order-status",
    method: "put"
  },
  cancelOrder: {
    url: "/api/order/cancel-order",
    method: "put"
  },
  createOrUpdateReview: {
    url: "/api/review/create",
    method: "post"
  },
  getProductReviews: {
    url: "/api/review/product",
    method: "get"
  },
  deleteReview: {
    url: "/api/review",
    method: "delete"
  },
  toggleLikeReview: {
    url: "/api/review/like",
    method: "post"
  },
  toggleWishlist: {
    url: "/api/wishlist/toggle",
    method: "post"
  },
  getWishlist: {
    url: "/api/wishlist/all",
    method: "get"
  },
  checkWishlist: {
    url: "/api/wishlist/check",
    method: "get"
  },
  createCoupon: {
    url: "/api/coupon/create",
    method: "post"
  },
  getAllCouponsAdmin: {
    url: "/api/coupon/get-all",
    method: "get"
  },
  updateCoupon: {
    url: "/api/coupon/update",
    method: "put"
  },
  deleteCoupon: {
    url: "/api/coupon/delete",
    method: "delete"
  },
  applyCoupon: {
    url: "/api/coupon/apply",
    method: "post"
  },
  createBanner: {
    url: "/api/banner/create",
    method: "post"
  },
  getAllBannersAdmin: {
    url: "/api/banner/get-all-admin",
    method: "get"
  },
  getActiveBanners: {
    url: "/api/banner/get-active",
    method: "get"
  },
  updateBanner: {
    url: "/api/banner/update",
    method: "put"
  },
  deleteBanner: {
    url: "/api/banner/delete",
    method: "delete"
  },
  getAllUsersAdmin: {
    url: "/api/user/admin/all-users",
    method: "get"
  },
  updateUserStatusAdmin: {
    url: "/api/user/admin/update-status",
    method: "put"
  },
  updateUserRoleAdmin: {
    url: "/api/user/admin/update-role",
    method: "put"
  }
};

export default SummaryApi;
