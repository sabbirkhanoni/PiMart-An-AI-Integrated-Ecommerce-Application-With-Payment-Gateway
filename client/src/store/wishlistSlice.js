import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wishlistItems: [],
  wishlistProductIds: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist: (state, action) => {
      const items = Array.isArray(action.payload) ? action.payload : [];
      state.wishlistItems = items;
      state.wishlistProductIds = items
        .map((item) => item?.productId?._id || item?.productId)
        .filter(Boolean);
    },
    addToWishlist: (state, action) => {
      const newItem = action.payload;
      const prodId = newItem?.productId?._id || newItem?.productId;
      if (prodId && !state.wishlistProductIds.includes(prodId)) {
        state.wishlistItems.unshift(newItem);
        state.wishlistProductIds.push(prodId);
      }
    },
    removeFromWishlist: (state, action) => {
      const prodId = action.payload;
      state.wishlistItems = state.wishlistItems.filter(
        (item) => (item?.productId?._id || item?.productId) !== prodId
      );
      state.wishlistProductIds = state.wishlistProductIds.filter(
        (id) => id !== prodId
      );
    },
    clearWishlist: (state) => {
      state.wishlistItems = [];
      state.wishlistProductIds = [];
    },
  },
});

export const {
  setWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
