import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ReportState, ReportFilters } from '../types';
import { reportService } from '../services/reportService';

const initialState: ReportState = {
  dailySales: null,
  productSales: [],
  waiterPerformance: [],
  tableOccupancy: [],
  filters: {
    dateRange: {
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
    },
  },
  isLoading: false,
  error: null,
};

export const fetchDailySalesReport = createAsyncThunk(
  'reports/fetchDailySales',
  async (filters: ReportFilters) => {
    return await reportService.getDailySalesReport(filters);
  }
);

export const fetchProductSalesReport = createAsyncThunk(
  'reports/fetchProductSales',
  async (filters: ReportFilters) => {
    return await reportService.getProductSalesReport(filters);
  }
);

export const fetchWaiterPerformanceReport = createAsyncThunk(
  'reports/fetchWaiterPerformance',
  async (filters: ReportFilters) => {
    return await reportService.getWaiterPerformanceReport(filters);
  }
);

export const fetchTableOccupancyReport = createAsyncThunk(
  'reports/fetchTableOccupancy',
  async (filters: ReportFilters) => {
    return await reportService.getTableOccupancyReport(filters);
  }
);

export const exportDailySalesReport = createAsyncThunk(
  'reports/exportDailySales',
  async (filters: ReportFilters) => {
    const blob = await reportService.exportDailySalesReport(filters);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gunluk-satis-raporu.xlsx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
);

export const exportProductSalesReport = createAsyncThunk(
  'reports/exportProductSales',
  async (filters: ReportFilters) => {
    const blob = await reportService.exportProductSalesReport(filters);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'urun-satis-raporu.xlsx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
);

export const exportWaiterPerformanceReport = createAsyncThunk(
  'reports/exportWaiterPerformance',
  async (filters: ReportFilters) => {
    const blob = await reportService.exportWaiterPerformanceReport(filters);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'garson-performans-raporu.xlsx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
);

export const exportTableOccupancyReport = createAsyncThunk(
  'reports/exportTableOccupancy',
  async (filters: ReportFilters) => {
    const blob = await reportService.exportTableOccupancyReport(filters);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'masa-doluluk-raporu.xlsx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
);

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearReports: (state) => {
      state.dailySales = null;
      state.productSales = [];
      state.waiterPerformance = [];
      state.tableOccupancy = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Günlük Satış Raporu
      .addCase(fetchDailySalesReport.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDailySalesReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dailySales = action.payload;
      })
      .addCase(fetchDailySalesReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Günlük satış raporu alınamadı';
      })

      // Ürün Satış Raporu
      .addCase(fetchProductSalesReport.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductSalesReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productSales = action.payload;
      })
      .addCase(fetchProductSalesReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ürün satış raporu alınamadı';
      })

      // Garson Performans Raporu
      .addCase(fetchWaiterPerformanceReport.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWaiterPerformanceReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.waiterPerformance = action.payload;
      })
      .addCase(fetchWaiterPerformanceReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Garson performans raporu alınamadı';
      })

      // Masa Doluluk Raporu
      .addCase(fetchTableOccupancyReport.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTableOccupancyReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tableOccupancy = action.payload;
      })
      .addCase(fetchTableOccupancyReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Masa doluluk raporu alınamadı';
      });
  },
});

export const { setFilters, clearReports } = reportSlice.actions;

export default reportSlice.reducer; 