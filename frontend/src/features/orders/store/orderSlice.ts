import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  OrderState,
  OrderFilters,
  CreateOrderData,
  UpdateOrderItemData,
  CreatePaymentData,
} from '../types';
import { orderService } from '../services/orderService';

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  filters: {},
  isLoading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (filters?: OrderFilters) => {
    const response = await orderService.getOrders(filters);
    return response;
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id: number) => {
    const response = await orderService.getOrderById(id);
    return response;
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (data: CreateOrderData) => {
    const response = await orderService.createOrder(data);
    return response;
  }
);

export const updateOrderItem = createAsyncThunk(
  'orders/updateOrderItem',
  async ({
    orderId,
    itemId,
    data,
  }: {
    orderId: number;
    itemId: number;
    data: UpdateOrderItemData;
  }) => {
    const response = await orderService.updateOrderItem(orderId, itemId, data);
    return response;
  }
);

export const deleteOrderItem = createAsyncThunk(
  'orders/deleteOrderItem',
  async ({ orderId, itemId }: { orderId: number; itemId: number }) => {
    await orderService.deleteOrderItem(orderId, itemId);
    return { orderId, itemId };
  }
);

export const addPayment = createAsyncThunk(
  'orders/addPayment',
  async ({ orderId, data }: { orderId: number; data: CreatePaymentData }) => {
    const response = await orderService.addPayment(orderId, data);
    return response;
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId: number) => {
    const response = await orderService.cancelOrder(orderId);
    return response;
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Siparişler yüklenirken bir hata oluştu';
      })
      // Fetch Order By Id
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.selectedOrder = action.payload;
      })
      // Create Order
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.unshift(action.payload);
      })
      // Update Order Item
      .addCase(updateOrderItem.fulfilled, (state, action) => {
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.selectedOrder?.id === action.payload.id) {
          state.selectedOrder = action.payload;
        }
      })
      // Delete Order Item
      .addCase(deleteOrderItem.fulfilled, (state, action) => {
        const { orderId, itemId } = action.payload;
        const orderIndex = state.orders.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
          state.orders[orderIndex].items = state.orders[orderIndex].items.filter(
            item => item.id !== itemId
          );
        }
        if (state.selectedOrder?.id === orderId) {
          state.selectedOrder.items = state.selectedOrder.items.filter(
            item => item.id !== itemId
          );
        }
      })
      // Add Payment
      .addCase(addPayment.fulfilled, (state, action) => {
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.selectedOrder?.id === action.payload.id) {
          state.selectedOrder = action.payload;
        }
      })
      // Cancel Order
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.selectedOrder?.id === action.payload.id) {
          state.selectedOrder = action.payload;
        }
      });
  },
});

export const { setFilters, clearSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer; 