import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  fetchCustomers,
  fetchCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  setFilters,
  clearSelectedCustomer,
} from '../store/customerSlice';
import { Customer, CustomerFilters } from '../types';
import { customerService } from '../services/customerService';

export const useCustomer = () => {
  const dispatch = useAppDispatch();
  const {
    customers,
    selectedCustomer,
    filters,
    isLoading,
    error,
    totalPages,
    currentPage,
  } = useAppSelector((state) => state.customers);

  // Temel CRUD işlemleri
  const getCustomers = useCallback(
    async (filters: CustomerFilters) => {
      await dispatch(fetchCustomers(filters));
    },
    [dispatch]
  );

  const getCustomerById = useCallback(
    async (id: number) => {
      await dispatch(fetchCustomerById(id));
    },
    [dispatch]
  );

  const addCustomer = useCallback(
    async (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
      await dispatch(createCustomer(customer));
    },
    [dispatch]
  );

  const editCustomer = useCallback(
    async (id: number, customer: Partial<Customer>) => {
      await dispatch(updateCustomer({ id, customer }));
    },
    [dispatch]
  );

  const removeCustomer = useCallback(
    async (id: number) => {
      await dispatch(deleteCustomer(id));
    },
    [dispatch]
  );

  // Filtre işlemleri
  const updateFilters = useCallback(
    (newFilters: CustomerFilters) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  const resetSelectedCustomer = useCallback(() => {
    dispatch(clearSelectedCustomer());
  }, [dispatch]);

  // Müşteri geçmişi ve sadakat programı
  const getCustomerHistory = useCallback(async (id: number) => {
    return await customerService.getCustomerHistory(id);
  }, []);

  const getLoyaltyActivities = useCallback(async (id: number) => {
    return await customerService.getLoyaltyActivities(id);
  }, []);

  const addLoyaltyPoints = useCallback(async (id: number, points: number, description: string) => {
    return await customerService.addLoyaltyPoints(id, points, description);
  }, []);

  const redeemLoyaltyPoints = useCallback(async (id: number, points: number, description: string) => {
    return await customerService.redeemLoyaltyPoints(id, points, description);
  }, []);

  // Müşteri analizi
  const getCustomerSegments = useCallback(async () => {
    return await customerService.getCustomerSegments();
  }, []);

  const getCustomerMetrics = useCallback(async (id: number) => {
    return await customerService.getCustomerMetrics(id);
  }, []);

  return {
    // State
    customers,
    selectedCustomer,
    filters,
    isLoading,
    error,
    totalPages,
    currentPage,

    // CRUD işlemleri
    getCustomers,
    getCustomerById,
    addCustomer,
    editCustomer,
    removeCustomer,

    // Filtre işlemleri
    updateFilters,
    resetSelectedCustomer,

    // Müşteri geçmişi ve sadakat programı
    getCustomerHistory,
    getLoyaltyActivities,
    addLoyaltyPoints,
    redeemLoyaltyPoints,

    // Müşteri analizi
    getCustomerSegments,
    getCustomerMetrics,
  };
}; 