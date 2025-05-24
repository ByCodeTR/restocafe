import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  fetchReservations,
  fetchReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
  fetchFilterOptions,
  setFilters,
  setSort,
  setPage,
  clearFilters,
  clearSelectedReservation,
} from '../store/reservationSlice';
import {
  CreateReservationData,
  UpdateReservationData,
  ReservationFilters,
  ReservationSortOptions,
  ReservationListParams,
} from '../types';
import { reservationService } from '../services/reservationService';

export const useReservation = () => {
  const dispatch = useAppDispatch();
  const {
    items,
    selectedReservation,
    filters,
    sort,
    pagination,
    isLoading,
    error
  } = useAppSelector((state) => state.reservations);

  // Rezervasyonları getir
  const getReservations = useCallback(async () => {
    const params: ReservationListParams = {
      filters,
      sort,
      page: pagination.currentPage,
      limit: pagination.itemsPerPage
    };
    await dispatch(fetchReservations(params));
  }, [dispatch, filters, sort, pagination.currentPage, pagination.itemsPerPage]);

  // Tek bir rezervasyon getir
  const getReservationById = useCallback(
    async (id: number) => {
      await dispatch(fetchReservationById(id));
    },
    [dispatch]
  );

  // Yeni rezervasyon oluştur
  const createNewReservation = useCallback(
    async (data: CreateReservationData) => {
      await dispatch(createReservation(data));
    },
    [dispatch]
  );

  // Rezervasyon güncelle
  const updateExistingReservation = useCallback(
    async (id: number, data: UpdateReservationData) => {
      await dispatch(updateReservation({ id, data }));
    },
    [dispatch]
  );

  // Rezervasyon sil
  const removeReservation = useCallback(
    async (id: number) => {
      await dispatch(deleteReservation(id));
    },
    [dispatch]
  );

  // Masa müsaitliğini kontrol et
  const checkTableAvailability = useCallback(
    async (
      tableId: number,
      date: string,
      time: string,
      duration: number,
      excludeReservationId?: number
    ) => {
      return await reservationService.checkTableAvailability(
        tableId,
        date,
        time,
        duration,
        excludeReservationId
      );
    },
    []
  );

  // Filtreleme seçeneklerini getir
  const getFilterOptions = useCallback(async () => {
    await dispatch(fetchFilterOptions());
  }, [dispatch]);

  // Filtreleri güncelle
  const updateFilters = useCallback(
    (newFilters: ReservationFilters) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  // Sıralamayı güncelle
  const updateSort = useCallback(
    (newSort: ReservationSortOptions) => {
      dispatch(setSort(newSort));
    },
    [dispatch]
  );

  // Sayfa numarasını güncelle
  const updatePage = useCallback(
    (pageNumber: number) => {
      dispatch(setPage(pageNumber));
    },
    [dispatch]
  );

  // Filtreleri temizle
  const resetFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  // Seçili rezervasyonu temizle
  const resetSelectedReservation = useCallback(() => {
    dispatch(clearSelectedReservation());
  }, [dispatch]);

  return {
    // State
    reservations: items,
    selectedReservation,
    filters,
    sort,
    pagination,
    isLoading,
    error,

    // Actions
    getReservations,
    getReservationById,
    createReservation: createNewReservation,
    updateReservation: updateExistingReservation,
    deleteReservation: removeReservation,
    checkTableAvailability,
    getFilterOptions,
    updateFilters,
    updateSort,
    updatePage,
    resetFilters,
    resetSelectedReservation,
  };
}; 