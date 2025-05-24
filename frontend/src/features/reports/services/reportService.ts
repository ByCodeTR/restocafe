import axios from 'axios';
import {
  DailySalesReport,
  ProductSalesReport,
  WaiterPerformanceReport,
  TableOccupancyReport,
  ReportFilters,
} from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const reportService = {
  async getDailySalesReport(filters: ReportFilters): Promise<DailySalesReport> {
    const response = await axios.get(`${API_URL}/reports/daily-sales`, {
      params: {
        startDate: filters.dateRange.startDate,
        endDate: filters.dateRange.endDate,
        paymentMethods: filters.paymentMethods?.join(','),
      },
    });
    return response.data;
  },

  async getProductSalesReport(filters: ReportFilters): Promise<ProductSalesReport[]> {
    const response = await axios.get(`${API_URL}/reports/product-sales`, {
      params: {
        startDate: filters.dateRange.startDate,
        endDate: filters.dateRange.endDate,
        categories: filters.categories?.join(','),
      },
    });
    return response.data;
  },

  async getWaiterPerformanceReport(filters: ReportFilters): Promise<WaiterPerformanceReport[]> {
    const response = await axios.get(`${API_URL}/reports/waiter-performance`, {
      params: {
        startDate: filters.dateRange.startDate,
        endDate: filters.dateRange.endDate,
        waiters: filters.waiters?.join(','),
      },
    });
    return response.data;
  },

  async getTableOccupancyReport(filters: ReportFilters): Promise<TableOccupancyReport[]> {
    const response = await axios.get(`${API_URL}/reports/table-occupancy`, {
      params: {
        startDate: filters.dateRange.startDate,
        endDate: filters.dateRange.endDate,
        tables: filters.tables?.join(','),
      },
    });
    return response.data;
  },

  async exportDailySalesReport(filters: ReportFilters): Promise<Blob> {
    const response = await axios.get(`${API_URL}/reports/daily-sales/export`, {
      params: {
        startDate: filters.dateRange.startDate,
        endDate: filters.dateRange.endDate,
        paymentMethods: filters.paymentMethods?.join(','),
      },
      responseType: 'blob',
    });
    return response.data;
  },

  async exportProductSalesReport(filters: ReportFilters): Promise<Blob> {
    const response = await axios.get(`${API_URL}/reports/product-sales/export`, {
      params: {
        startDate: filters.dateRange.startDate,
        endDate: filters.dateRange.endDate,
        categories: filters.categories?.join(','),
      },
      responseType: 'blob',
    });
    return response.data;
  },

  async exportWaiterPerformanceReport(filters: ReportFilters): Promise<Blob> {
    const response = await axios.get(`${API_URL}/reports/waiter-performance/export`, {
      params: {
        startDate: filters.dateRange.startDate,
        endDate: filters.dateRange.endDate,
        waiters: filters.waiters?.join(','),
      },
      responseType: 'blob',
    });
    return response.data;
  },

  async exportTableOccupancyReport(filters: ReportFilters): Promise<Blob> {
    const response = await axios.get(`${API_URL}/reports/table-occupancy/export`, {
      params: {
        startDate: filters.dateRange.startDate,
        endDate: filters.dateRange.endDate,
        tables: filters.tables?.join(','),
      },
      responseType: 'blob',
    });
    return response.data;
  },
}; 