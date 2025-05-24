import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunks
export const fetchReports = createAsyncThunk(
  'reports/fetchReports',
  async ({ type, timeRange, status } = {}) => {
    const params = { type, timeRange, status };
    const response = await axios.get('/api/reports', { params });
    return response.data.reports;
  }
);

export const fetchReport = createAsyncThunk(
  'reports/fetchReport',
  async (reportId) => {
    const response = await axios.get(`/api/reports/${reportId}`);
    return response.data.report;
  }
);

export const createReport = createAsyncThunk(
  'reports/createReport',
  async (reportData) => {
    const response = await axios.post('/api/reports', reportData);
    return response.data.report;
  }
);

export const updateReport = createAsyncThunk(
  'reports/updateReport',
  async ({ reportId, reportData }) => {
    const response = await axios.patch(`/api/reports/${reportId}`, reportData);
    return response.data.report;
  }
);

export const deleteReport = createAsyncThunk(
  'reports/deleteReport',
  async (reportId) => {
    await axios.delete(`/api/reports/${reportId}`);
    return reportId;
  }
);

export const generateQuickReport = createAsyncThunk(
  'reports/generateQuickReport',
  async ({ type, timeRange, customRange }) => {
    const response = await axios.post('/api/reports/quick', {
      type,
      timeRange,
      customRange
    });
    return response.data.report;
  }
);

export const refreshReport = createAsyncThunk(
  'reports/refreshReport',
  async (reportId) => {
    const response = await axios.post(`/api/reports/${reportId}/refresh`);
    return response.data.report;
  }
);

// Initial State
const initialState = {
  reports: [],
  currentReport: null,
  quickReport: null,
  loading: false,
  error: null,
  filters: {
    type: null,
    timeRange: 'daily',
    status: 'active'
  }
};

// Slice
const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentReport: (state) => {
      state.currentReport = null;
    },
    clearQuickReport: (state) => {
      state.quickReport = null;
    }
  },
  extraReducers: (builder) => {
    // fetchReports
    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // fetchReport
    builder
      .addCase(fetchReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReport.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReport = action.payload;
      })
      .addCase(fetchReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // createReport
    builder
      .addCase(createReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reports.push(action.payload);
      })
      .addCase(createReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // updateReport
    builder
      .addCase(updateReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReport.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reports.findIndex(
          (report) => report._id === action.payload._id
        );
        if (index !== -1) {
          state.reports[index] = action.payload;
        }
        if (state.currentReport?._id === action.payload._id) {
          state.currentReport = action.payload;
        }
      })
      .addCase(updateReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // deleteReport
    builder
      .addCase(deleteReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = state.reports.filter(
          (report) => report._id !== action.payload
        );
        if (state.currentReport?._id === action.payload) {
          state.currentReport = null;
        }
      })
      .addCase(deleteReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // generateQuickReport
    builder
      .addCase(generateQuickReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateQuickReport.fulfilled, (state, action) => {
        state.loading = false;
        state.quickReport = action.payload;
      })
      .addCase(generateQuickReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // refreshReport
    builder
      .addCase(refreshReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshReport.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reports.findIndex(
          (report) => report._id === action.payload._id
        );
        if (index !== -1) {
          state.reports[index] = action.payload;
        }
        if (state.currentReport?._id === action.payload._id) {
          state.currentReport = action.payload;
        }
      })
      .addCase(refreshReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { setFilters, clearCurrentReport, clearQuickReport } = reportSlice.actions;

export default reportSlice.reducer; 