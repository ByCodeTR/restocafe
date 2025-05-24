import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CustomerState, CustomerFilters, Customer } from '../types';
import { customerService } from '../services/customerService';

const initialState: CustomerState = {
  customers: [],
  selectedCustomer: null,
  filters: {
    page: 1,
    limit: 10,
    sortBy: 'name',
    sortOrder: 'asc',
  },
  isLoading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
};

export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (filters: CustomerFilters) => {
    return await customerService.getCustomers(filters);
  }
);

export const fetchCustomerById = createAsyncThunk(
  'customers/fetchCustomerById',
  async (id: number) => {
    return await customerService.getCustomerById(id);
  }
);

export const createCustomer = createAsyncThunk(
  'customers/createCustomer',
  async (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await customerService.createCustomer(customer);
  }
);

export const updateCustomer = createAsyncThunk(
  'customers/updateCustomer',
  async ({ id, customer }: { id: number; customer: Partial<Customer> }) => {
    return await customerService.updateCustomer(id, customer);
  }
);

export const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomer',
  async (id: number) => {
    await customerService.deleteCustomer(id);
    return id;
  }
);

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearSelectedCustomer: (state) => {
      state.selectedCustomer = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Müşteri Listesi
      .addCase(fetchCustomers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers = action.payload.customers;
        state.totalPages = action.payload.totalPages;
        state.currentPage = state.filters.page || 1;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Müşteriler yüklenirken bir hata oluştu';
      })

      // Tek Müşteri
      .addCase(fetchCustomerById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedCustomer = action.payload;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Müşteri bilgileri yüklenirken bir hata oluştu';
      })

      // Müşteri Oluşturma
      .addCase(createCustomer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers.push(action.payload);
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Müşteri oluşturulurken bir hata oluştu';
      })

      // Müşteri Güncelleme
      .addCase(updateCustomer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.customers.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
        if (state.selectedCustomer?.id === action.payload.id) {
          state.selectedCustomer = action.payload;
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Müşteri güncellenirken bir hata oluştu';
      })

      // Müşteri Silme
      .addCase(deleteCustomer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers = state.customers.filter((c) => c.id !== action.payload);
        if (state.selectedCustomer?.id === action.payload) {
          state.selectedCustomer = null;
        }
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Müşteri silinirken bir hata oluştu';
      });
  },
});

export const { setFilters, clearSelectedCustomer } = customerSlice.actions;

export default customerSlice.reducer; 