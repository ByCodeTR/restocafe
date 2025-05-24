import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  fetchDailySalesReport,
  fetchProductSalesReport,
  fetchWaiterPerformanceReport,
  fetchTableOccupancyReport,
  exportDailySalesReport,
  exportProductSalesReport,
  exportWaiterPerformanceReport,
  exportTableOccupancyReport,
  setFilters,
  clearReports,
} from '../store/reportSlice';
import { ReportFilters } from '../types';

export const useReport = () => {
  const dispatch = useAppDispatch();
  const {
    dailySales,
    productSales,
    waiterPerformance,
    tableOccupancy,
    filters,
    isLoading,
    error,
  } = useAppSelector((state) => state.reports);

  // Günlük Satış Raporu
  const getDailySalesReport = useCallback(
    async (filters: ReportFilters) => {
      await dispatch(fetchDailySalesReport(filters));
    },
    [dispatch]
  );

  const exportDailySales = useCallback(
    async (filters: ReportFilters) => {
      await dispatch(exportDailySalesReport(filters));
    },
    [dispatch]
  );

  // Ürün Satış Raporu
  const getProductSalesReport = useCallback(
    async (filters: ReportFilters) => {
      await dispatch(fetchProductSalesReport(filters));
    },
    [dispatch]
  );

  const exportProductSales = useCallback(
    async (filters: ReportFilters) => {
      await dispatch(exportProductSalesReport(filters));
    },
    [dispatch]
  );

  // Garson Performans Raporu
  const getWaiterPerformanceReport = useCallback(
    async (filters: ReportFilters) => {
      await dispatch(fetchWaiterPerformanceReport(filters));
    },
    [dispatch]
  );

  const exportWaiterPerformance = useCallback(
    async (filters: ReportFilters) => {
      await dispatch(exportWaiterPerformanceReport(filters));
    },
    [dispatch]
  );

  // Masa Doluluk Raporu
  const getTableOccupancyReport = useCallback(
    async (filters: ReportFilters) => {
      await dispatch(fetchTableOccupancyReport(filters));
    },
    [dispatch]
  );

  const exportTableOccupancy = useCallback(
    async (filters: ReportFilters) => {
      await dispatch(exportTableOccupancyReport(filters));
    },
    [dispatch]
  );

  // Filtre İşlemleri
  const updateFilters = useCallback(
    (newFilters: ReportFilters) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  const resetReports = useCallback(() => {
    dispatch(clearReports());
  }, [dispatch]);

  return {
    // State
    dailySales,
    productSales,
    waiterPerformance,
    tableOccupancy,
    filters,
    isLoading,
    error,

    // Actions
    getDailySalesReport,
    exportDailySales,
    getProductSalesReport,
    exportProductSales,
    getWaiterPerformanceReport,
    exportWaiterPerformance,
    getTableOccupancyReport,
    exportTableOccupancy,
    updateFilters,
    resetReports,
  };
}; 