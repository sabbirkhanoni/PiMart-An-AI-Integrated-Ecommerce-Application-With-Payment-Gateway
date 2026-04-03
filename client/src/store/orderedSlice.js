import {createSlice} from '@reduxjs/toolkit';


const initialState = {
    orderDataSet: []
}

const orderedSlice = createSlice({
    name : "ordered",
    initialState,
    reducers: {
        setOrderDataSet : (state, action) => {
            state.orderDataSet = [...action.payload]
        }
    }
})

export const { setOrderDataSet } = orderedSlice.actions

export default orderedSlice.reducer
