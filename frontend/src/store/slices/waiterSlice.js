import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Garsonun masalarını getir
export const fetchWaiterTables = createAsyncThunk(
  'waiter/fetchWaiterTables',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/tables', {
        params: {
          assigned: true // Sadece garsona atanmış masaları getir
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Masanın aktif siparişini getir
export const fetchTableOrder = createAsyncThunk(
  'waiter/fetchTableOrder',
  async (tableId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/tables/${tableId}/active-order`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Yeni sipariş oluştur
export const createOrder = createAsyncThunk(
  'waiter/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/orders', orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Sipariş güncelle
export const updateOrder = createAsyncThunk(
  'waiter/updateOrder',
  async ({ orderId, orderData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/orders/${orderId}`, orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Ödeme ekle
export const addPayment = createAsyncThunk(
  'waiter/addPayment',
  async ({ orderId, paymentData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/orders/${orderId}/payments`, paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  tables: [],
  selectedTable: null,
  activeOrder: null,
  cart: {
    items: [],
    total: 0
  },
  loading: {
    tables: false,
    order: false,
    payment: false
  },
  error: {
    tables: null,
    order: null,
    payment: null
  }
};

const waiterSlice = createSlice({
  name: 'waiter',
  initialState,
  reducers: {
    // Masa seç
    selectTable: (state, action) => {
      state.selectedTable = action.payload;
      state.activeOrder = null;
      state.cart.items = [];
      state.cart.total = 0;
    },
    // Sepete ürün ekle
    addToCart: (state, action) => {
      const { product, quantity = 1, variations = [], notes = '' } = action.payload;
      const existingItem = state.cart.items.find(
        item => 
          item.product._id === product._id &&
          JSON.stringify(item.variations) === JSON.stringify(variations)
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cart.items.push({
          product,
          quantity,
          variations,
          notes
        });
      }

      // Toplam tutarı güncelle
      state.cart.total = state.cart.items.reduce((total, item) => {
        const itemTotal = item.product.price * item.quantity;
        const variationTotal = item.variations.reduce(
          (acc, variation) => acc + (variation.price || 0),
          0
        );
        return total + (itemTotal + variationTotal * item.quantity);
      }, 0);
    },
    // Sepetten ürün çıkar
    removeFromCart: (state, action) => {
      const { productId, variations = [] } = action.payload;
      state.cart.items = state.cart.items.filter(
        item => 
          item.product._id !== productId ||
          JSON.stringify(item.variations) !== JSON.stringify(variations)
      );

      // Toplam tutarı güncelle
      state.cart.total = state.cart.items.reduce((total, item) => {
        const itemTotal = item.product.price * item.quantity;
        const variationTotal = item.variations.reduce(
          (acc, variation) => acc + (variation.price || 0),
          0
        );
        return total + (itemTotal + variationTotal * item.quantity);
      }, 0);
    },
    // Sepeti temizle
    clearCart: (state) => {
      state.cart.items = [];
      state.cart.total = 0;
    },
    // Aktif siparişi güncelle (socket.io event'lerinden)
    updateActiveOrder: (state, action) => {
      state.activeOrder = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Masaları getir
      .addCase(fetchWaiterTables.pending, (state) => {
        state.loading.tables = true;
        state.error.tables = null;
      })
      .addCase(fetchWaiterTables.fulfilled, (state, action) => {
        state.loading.tables = false;
        state.tables = action.payload.tables;
      })
      .addCase(fetchWaiterTables.rejected, (state, action) => {
        state.loading.tables = false;
        state.error.tables = action.payload?.message || 'Masalar alınamadı';
      })
      // Masa siparişini getir
      .addCase(fetchTableOrder.pending, (state) => {
        state.loading.order = true;
        state.error.order = null;
      })
      .addCase(fetchTableOrder.fulfilled, (state, action) => {
        state.loading.order = false;
        state.activeOrder = action.payload.order;
      })
      .addCase(fetchTableOrder.rejected, (state, action) => {
        state.loading.order = false;
        state.error.order = action.payload?.message || 'Sipariş alınamadı';
      })
      // Sipariş oluştur
      .addCase(createOrder.pending, (state) => {
        state.loading.order = true;
        state.error.order = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading.order = false;
        state.activeOrder = action.payload.order;
        state.cart.items = [];
        state.cart.total = 0;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading.order = false;
        state.error.order = action.payload?.message || 'Sipariş oluşturulamadı';
      })
      // Sipariş güncelle
      .addCase(updateOrder.pending, (state) => {
        state.loading.order = true;
        state.error.order = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading.order = false;
        state.activeOrder = action.payload.order;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading.order = false;
        state.error.order = action.payload?.message || 'Sipariş güncellenemedi';
      })
      // Ödeme ekle
      .addCase(addPayment.pending, (state) => {
        state.loading.payment = true;
        state.error.payment = null;
      })
      .addCase(addPayment.fulfilled, (state, action) => {
        state.loading.payment = false;
        state.activeOrder = action.payload.order;
      })
      .addCase(addPayment.rejected, (state, action) => {
        state.loading.payment = false;
        state.error.payment = action.payload?.message || 'Ödeme eklenemedi';
      });
  }
});

export const {
  selectTable,
  addToCart,
  removeFromCart,
  clearCart,
  updateActiveOrder
} = waiterSlice.actions;

export default waiterSlice.reducer; 