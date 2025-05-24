import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  ReservationState,
  Reservation,
  CreateReservationData,
  UpdateReservationData,
  ReservationFilters,
  ReservationSortOptions,
  ReservationListParams
} from '../types';
import { reservationService } from '../services/reservationService';

const initialState: ReservationState = {
  items: [],
  selectedReservation: null,
  filters: {},
  sort: {
    field: 'date',
    direction: 'asc'
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  },
  isLoading: false,
  error: null,
};

export const fetchReservations = createAsyncThunk(
  'reservations/fetchReservations',
  async (params: ReservationListParams) => {
    return await reservationService.getReservations(params);
  }
);

export const fetchReservationById = createAsyncThunk(
  'reservations/fetchReservationById',
  async (id: number) => {
    return await reservationService.getReservationById(id);
  }
);

export const createReservation = createAsyncThunk(
  'reservations/createReservation',
  async (data: CreateReservationData) => {
    return await reservationService.createReservation(data);
  }
);

export const updateReservation = createAsyncThunk(
  'reservations/updateReservation',
  async ({ id, data }: { id: number; data: UpdateReservationData }) => {
    return await reservationService.updateReservation(id, data);
  }
);

export const deleteReservation = createAsyncThunk(
  'reservations/deleteReservation',
  async (id: number) => {
    await reservationService.deleteReservation(id);
    return id;
  }
);

export const fetchFilterOptions = createAsyncThunk(
  'reservations/fetchFilterOptions',
  async () => {
    return await reservationService.getFilterOptions();
  }
);

const reservationSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<ReservationFilters>) => {
      state.filters = action.payload;
      state.pagination.currentPage = 1;
    },
    setSort: (state, action: PayloadAction<ReservationSortOptions>) => {
      state.sort = action.payload;
      state.pagination.currentPage = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
      state.pagination.currentPage = 1;
    },
    clearSelectedReservation: (state) => {
      state.selectedReservation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Reservations
      .addCase(fetchReservations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.totalItems,
          itemsPerPage: state.pagination.itemsPerPage
        };
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Rezervasyonlar yüklenirken bir hata oluştu';
      })

      // Fetch Single Reservation
      .addCase(fetchReservationById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReservationById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedReservation = action.payload;
      })
      .addCase(fetchReservationById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Rezervasyon detayları yüklenirken bir hata oluştu';
      })

      // Create Reservation
      .addCase(createReservation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = [action.payload, ...state.items];
        state.pagination.totalItems += 1;
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Rezervasyon oluşturulurken bir hata oluştu';
      })

      // Update Reservation
      .addCase(updateReservation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateReservation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.map(item =>
          item.id === action.payload.id ? action.payload : item
        );
        if (state.selectedReservation?.id === action.payload.id) {
          state.selectedReservation = action.payload;
        }
      })
      .addCase(updateReservation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Rezervasyon güncellenirken bir hata oluştu';
      })

      // Delete Reservation
      .addCase(deleteReservation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteReservation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        state.pagination.totalItems -= 1;
        if (state.selectedReservation?.id === action.payload) {
          state.selectedReservation = null;
        }
      })
      .addCase(deleteReservation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Rezervasyon silinirken bir hata oluştu';
      });
  },
});

export const {
  setFilters,
  setSort,
  setPage,
  clearFilters,
  clearSelectedReservation,
} = reservationSlice.actions;

export default reservationSlice.reducer; 