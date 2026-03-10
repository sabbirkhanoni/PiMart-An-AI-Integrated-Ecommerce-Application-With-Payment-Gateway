import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart : []
}

const cartSlice = createSlice({
    name: "cartName",
    initialState,
    reducers : {
        handleAddToCart : (state, action) => {
            state.cart = [...action.payload]
        }
    }
})

export const { handleAddToCart } = cartSlice.actions;

export default cartSlice.reducer;