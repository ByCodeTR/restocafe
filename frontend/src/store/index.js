import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tableReducer from './slices/tableSlice';
import orderReducer from './slices/orderSlice';
import productReducer from './slices/productSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    tables: tableReducer,
    orders: orderReducer,
    products: productReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store; 