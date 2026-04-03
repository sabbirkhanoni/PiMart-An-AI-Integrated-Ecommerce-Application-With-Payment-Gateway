import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import productReducer from './productSlice'
import cartReducer from './cart.store'
import deliveryAddressReducer from './deliveryAddressSlice'
import orderedReducer from './orderedSlice'


export default configureStore({
  reducer: {
    user: userReducer,
    product : productReducer,
    cart : cartReducer,
    deliveryAddress : deliveryAddressReducer,
    order : orderedReducer
  }
})