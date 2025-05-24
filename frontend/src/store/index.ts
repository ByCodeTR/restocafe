import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/store/authSlice';
import tableReducer from '../features/tables/store/tableSlice';
import orderReducer from '../features/orders/store/orderSlice';
import reservationReducer from '../features/reservations/store/reservationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tables: tableReducer,
    orders: orderReducer,
    reservations: reservationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 