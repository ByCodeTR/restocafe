import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tableReducer from './slices/tableSlice';
import categoryReducer from './slices/categorySlice';
import productReducer from './slices/productSlice';
import orderReducer from './slices/orderSlice';
import kitchenReducer from './slices/kitchenSlice';
import waiterReducer from './slices/waiterSlice';
import reservationReducer from './slices/reservationSlice';
import customerReducer from './slices/customerSlice';
import reportReducer from './slices/reportSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tables: tableReducer,
    categories: categoryReducer,
    products: productReducer,
    orders: orderReducer,
    kitchen: kitchenReducer,
    waiter: waiterReducer,
    reservations: reservationReducer,
    customers: customerReducer,
    reports: reportReducer,
    theme: themeReducer
  }
}); 