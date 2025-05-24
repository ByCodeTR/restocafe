import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TableState, TableFilters, CreateTableData, UpdateTableStatusData, AssignWaiterData } from '../types';
import { tableService } from '../services/tableService';

const initialState: TableState = {
  tables: [],
  selectedTable: null,
  filters: {},
  isLoading: false,
  error: null,
};

export const fetchTables = createAsyncThunk(
  'tables/fetchTables',
  async (filters?: TableFilters) => {
    const response = await tableService.getTables(filters);
    return response;
  }
);

export const fetchTableById = createAsyncThunk(
  'tables/fetchTableById',
  async (id: number) => {
    const response = await tableService.getTableById(id);
    return response;
  }
);

export const createTable = createAsyncThunk(
  'tables/createTable',
  async (data: CreateTableData) => {
    const response = await tableService.createTable(data);
    return response;
  }
);

export const updateTable = createAsyncThunk(
  'tables/updateTable',
  async ({ id, data }: { id: number; data: Partial<CreateTableData> }) => {
    const response = await tableService.updateTable(id, data);
    return response;
  }
);

export const deleteTable = createAsyncThunk(
  'tables/deleteTable',
  async (id: number) => {
    await tableService.deleteTable(id);
    return id;
  }
);

export const updateTableStatus = createAsyncThunk(
  'tables/updateTableStatus',
  async ({ id, data }: { id: number; data: UpdateTableStatusData }) => {
    const response = await tableService.updateTableStatus(id, data);
    return response;
  }
);

export const assignWaiter = createAsyncThunk(
  'tables/assignWaiter',
  async ({ id, data }: { id: number; data: AssignWaiterData }) => {
    const response = await tableService.assignWaiter(id, data);
    return response;
  }
);

export const removeWaiter = createAsyncThunk(
  'tables/removeWaiter',
  async (id: number) => {
    const response = await tableService.removeWaiter(id);
    return response;
  }
);

const tableSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearSelectedTable: (state) => {
      state.selectedTable = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tables
      .addCase(fetchTables.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTables.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tables = action.payload;
      })
      .addCase(fetchTables.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Masalar yüklenirken bir hata oluştu';
      })
      // Fetch Table By Id
      .addCase(fetchTableById.fulfilled, (state, action) => {
        state.selectedTable = action.payload;
      })
      // Create Table
      .addCase(createTable.fulfilled, (state, action) => {
        state.tables.push(action.payload);
      })
      // Update Table
      .addCase(updateTable.fulfilled, (state, action) => {
        const index = state.tables.findIndex(table => table.id === action.payload.id);
        if (index !== -1) {
          state.tables[index] = action.payload;
        }
        if (state.selectedTable?.id === action.payload.id) {
          state.selectedTable = action.payload;
        }
      })
      // Delete Table
      .addCase(deleteTable.fulfilled, (state, action) => {
        state.tables = state.tables.filter(table => table.id !== action.payload);
        if (state.selectedTable?.id === action.payload) {
          state.selectedTable = null;
        }
      })
      // Update Table Status
      .addCase(updateTableStatus.fulfilled, (state, action) => {
        const index = state.tables.findIndex(table => table.id === action.payload.id);
        if (index !== -1) {
          state.tables[index] = action.payload;
        }
        if (state.selectedTable?.id === action.payload.id) {
          state.selectedTable = action.payload;
        }
      })
      // Assign/Remove Waiter
      .addCase(assignWaiter.fulfilled, (state, action) => {
        const index = state.tables.findIndex(table => table.id === action.payload.id);
        if (index !== -1) {
          state.tables[index] = action.payload;
        }
        if (state.selectedTable?.id === action.payload.id) {
          state.selectedTable = action.payload;
        }
      })
      .addCase(removeWaiter.fulfilled, (state, action) => {
        const index = state.tables.findIndex(table => table.id === action.payload.id);
        if (index !== -1) {
          state.tables[index] = action.payload;
        }
        if (state.selectedTable?.id === action.payload.id) {
          state.selectedTable = action.payload;
        }
      });
  },
});

export const { setFilters, clearSelectedTable } = tableSlice.actions;
export default tableSlice.reducer; 