import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Rezervasyonları getir
export const fetchReservations = createAsyncThunk(
  'reservation/fetchReservations',
  async ({ date, status }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/reservations', {
        params: { date, status }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Yeni rezervasyon oluştur
export const createReservation = createAsyncThunk(
  'reservation/createReservation',
  async (reservationData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/reservations', reservationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Rezervasyon güncelle
export const updateReservation = createAsyncThunk(
  'reservation/updateReservation',
  async ({ id, reservationData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/reservations/${id}`, reservationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Rezervasyon iptal et
export const cancelReservation = createAsyncThunk(
  'reservation/cancelReservation',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/reservations/${id}/cancel`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Müsait masaları kontrol et
export const checkAvailableTables = createAsyncThunk(
  'reservation/checkAvailableTables',
  async ({ date, time, partySize }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/tables/available', {
        params: { date, time, partySize }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  reservations: [],
  selectedDate: new Date(),
  availableTables: [],
  loading: {
    list: false,
    create: false,
    update: false,
    check: false
  },
  error: {
    list: null,
    create: null,
    update: null,
    check: null
  }
};

const reservationSlice = createSlice({
  name: 'reservation',
  initialState,
  reducers: {
    // Seçili tarihi güncelle
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    // Rezervasyon listesini filtrele
    filterReservations: (state, action) => {
      const { status, search } = action.payload;
      let filtered = [...state.reservations];
      
      if (status) {
        filtered = filtered.filter(res => res.status === status);
      }
      
      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(res =>
          res.customerName.toLowerCase().includes(searchLower) ||
          res.customerPhone?.toLowerCase().includes(searchLower) ||
          res.customerEmail?.toLowerCase().includes(searchLower)
        );
      }
      
      state.filteredReservations = filtered;
    },
    // Yeni rezervasyon ekle (socket.io event'lerinden)
    addReservation: (state, action) => {
      state.reservations.push(action.payload);
    },
    // Rezervasyon güncelle (socket.io event'lerinden)
    updateReservationState: (state, action) => {
      const index = state.reservations.findIndex(r => r._id === action.payload._id);
      if (index !== -1) {
        state.reservations[index] = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Rezervasyonları getir
      .addCase(fetchReservations.pending, (state) => {
        state.loading.list = true;
        state.error.list = null;
      })
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.loading.list = false;
        state.reservations = action.payload.reservations;
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.loading.list = false;
        state.error.list = action.payload?.message || 'Rezervasyonlar alınamadı';
      })
      // Yeni rezervasyon oluştur
      .addCase(createReservation.pending, (state) => {
        state.loading.create = true;
        state.error.create = null;
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.loading.create = false;
        state.reservations.push(action.payload.reservation);
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.loading.create = false;
        state.error.create = action.payload?.message || 'Rezervasyon oluşturulamadı';
      })
      // Rezervasyon güncelle
      .addCase(updateReservation.pending, (state) => {
        state.loading.update = true;
        state.error.update = null;
      })
      .addCase(updateReservation.fulfilled, (state, action) => {
        state.loading.update = false;
        const index = state.reservations.findIndex(r => r._id === action.payload.reservation._id);
        if (index !== -1) {
          state.reservations[index] = action.payload.reservation;
        }
      })
      .addCase(updateReservation.rejected, (state, action) => {
        state.loading.update = false;
        state.error.update = action.payload?.message || 'Rezervasyon güncellenemedi';
      })
      // Müsait masaları kontrol et
      .addCase(checkAvailableTables.pending, (state) => {
        state.loading.check = true;
        state.error.check = null;
      })
      .addCase(checkAvailableTables.fulfilled, (state, action) => {
        state.loading.check = false;
        state.availableTables = action.payload.tables;
      })
      .addCase(checkAvailableTables.rejected, (state, action) => {
        state.loading.check = false;
        state.error.check = action.payload?.message || 'Müsait masalar kontrol edilemedi';
      });
  }
});

export const {
  setSelectedDate,
  filterReservations,
  addReservation,
  updateReservationState
} = reservationSlice.actions;

export default reservationSlice.reducer; 