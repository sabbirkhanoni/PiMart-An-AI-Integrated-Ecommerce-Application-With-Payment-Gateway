import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    address: []
}

const deliveryAddressSlice = createSlice({
    name: "deliveryAddress",
    initialState,
    reducers : {
        handleAddAddress : (state, action) => {
            state.address = [...action.payload]
        }
    }
})

export const { handleAddAddress } = deliveryAddressSlice.actions
export default deliveryAddressSlice.reducer