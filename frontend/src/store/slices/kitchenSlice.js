import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Aktif siparişleri getir
export const fetchActiveOrders = createAsyncThunk(
  'kitchen/fetchActiveOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/orders', {
        params: {
          status: 'active',
          sort: 'createdAt',
          order: 'asc'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Sipariş durumunu güncelle
export const updateOrderItemStatus = createAsyncThunk(
  'kitchen/updateOrderItemStatus',
  async ({ orderId, itemId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `/api/orders/${orderId}/items/${itemId}/status`,
        { status }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  activeOrders: [],
  filteredOrders: [],
  filters: {
    status: 'all', // all, pending, preparing, ready
    search: '',
    sortBy: 'time', // time, table
    sortOrder: 'asc' // asc, desc
  },
  loading: false,
  error: null
};

const kitchenSlice = createSlice({
  name: 'kitchen',
  initialState,
  reducers: {
    // Filtreleri güncelle
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filteredOrders = filterOrders(state.activeOrders, state.filters);
    },
    // Sipariş güncelleme (socket.io event'lerinden)
    updateOrder: (state, action) => {
      const index = state.activeOrders.findIndex(
        order => order._id === action.payload._id
      );
      
      if (index !== -1) {
        state.activeOrders[index] = action.payload;
      } else {
        state.activeOrders.push(action.payload);
      }
      
      state.filteredOrders = filterOrders(state.activeOrders, state.filters);
    },
    // Tamamlanan veya iptal edilen siparişleri kaldır
    removeOrder: (state, action) => {
      state.activeOrders = state.activeOrders.filter(
        order => order._id !== action.payload
      );
      state.filteredOrders = filterOrders(state.activeOrders, state.filters);
    }
  },
  extraReducers: (builder) => {
    builder
      // Aktif siparişleri getir
      .addCase(fetchActiveOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.activeOrders = action.payload.orders;
        state.filteredOrders = filterOrders(action.payload.orders, state.filters);
      })
      .addCase(fetchActiveOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Siparişler alınamadı';
      })
      // Sipariş durumu güncelleme
      .addCase(updateOrderItemStatus.fulfilled, (state, action) => {
        const { order, item } = action.payload;
        const orderIndex = state.activeOrders.findIndex(o => o._id === order._id);
        
        if (orderIndex !== -1) {
          const itemIndex = state.activeOrders[orderIndex].items.findIndex(
            i => i._id === item._id
          );
          if (itemIndex !== -1) {
            state.activeOrders[orderIndex].items[itemIndex] = item;
          }
        }
        
        state.filteredOrders = filterOrders(state.activeOrders, state.filters);
      });
  }
});

// Yardımcı fonksiyonlar
const filterOrders = (orders, filters) => {
  let result = [...orders];

  // Durum filtresi
  if (filters.status !== 'all') {
    result = result.filter(order =>
      order.items.some(item => item.status === filters.status)
    );
  }

  // Arama filtresi
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter(order =>
      order.items.some(item =>
        item.product.name.toLowerCase().includes(searchLower) ||
        item.notes?.toLowerCase().includes(searchLower)
      ) ||
      order.table.number.toString().includes(searchLower) ||
      order.customer?.name?.toLowerCase().includes(searchLower)
    );
  }

  // Sıralama
  result.sort((a, b) => {
    if (filters.sortBy === 'time') {
      return filters.sortOrder === 'asc'
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    } else if (filters.sortBy === 'table') {
      return filters.sortOrder === 'asc'
        ? a.table.number - b.table.number
        : b.table.number - a.table.number;
    }
    return 0;
  });

  return result;
};

export const { updateFilters, updateOrder, removeOrder } = kitchenSlice.actions;

export default kitchenSlice.reducer; 