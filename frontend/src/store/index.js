import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tableReducer from './slices/tableSlice';
import categoryReducer from './slices/categorySlice';
import productReducer from './slices/productSlice';
import orderReducer from './slices/orderSlice';
import notificationReducer from './slices/notificationSlice';
import kitchenReducer from './slices/kitchenSlice';
import waiterReducer from './slices/waiterSlice';
import reservationReducer from './slices/reservationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tables: tableReducer,
    categories: categoryReducer,
    products: productReducer,
    orders: orderReducer,
    notifications: notificationReducer,
    kitchen: kitchenReducer,
    waiter: waiterReducer,
    reservations: reservationReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store; 