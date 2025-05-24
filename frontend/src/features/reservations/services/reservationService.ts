import axios from 'axios';
import {
  Reservation,
  ReservationFilters,
  CreateReservationData,
  UpdateReservationData,
  ReservationListParams,
  ReservationSortOptions
} from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const reservationService = {
  async getReservations(params?: ReservationListParams): Promise<{
    items: Reservation[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }> {
    const queryParams = new URLSearchParams();

    if (params?.filters) {
      const { dateRange, status, tableId, searchTerm, guestCountRange } = params.filters;
      
      if (dateRange) {
        queryParams.append('startDate', dateRange.startDate);
        queryParams.append('endDate', dateRange.endDate);
      }
      
      if (status?.length) {
        status.forEach(s => queryParams.append('status', s));
      }
      
      if (tableId) {
        queryParams.append('tableId', tableId.toString());
      }
      
      if (searchTerm) {
        queryParams.append('search', searchTerm);
      }
      
      if (guestCountRange) {
        if (guestCountRange.min) queryParams.append('minGuests', guestCountRange.min.toString());
        if (guestCountRange.max) queryParams.append('maxGuests', guestCountRange.max.toString());
      }
    }

    if (params?.sort) {
      queryParams.append('sortField', params.sort.field);
      queryParams.append('sortDirection', params.sort.direction);
    }

    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }

    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    const response = await axios.get(`${API_URL}/reservations?${queryParams.toString()}`);
    return response.data;
  },

  async getReservationById(id: number): Promise<Reservation> {
    const response = await axios.get(`${API_URL}/reservations/${id}`);
    return response.data;
  },

  async createReservation(data: CreateReservationData): Promise<Reservation> {
    const response = await axios.post(`${API_URL}/reservations`, data);
    return response.data;
  },

  async updateReservation(id: number, data: UpdateReservationData): Promise<Reservation> {
    const response = await axios.patch(`${API_URL}/reservations/${id}`, data);
    return response.data;
  },

  async deleteReservation(id: number): Promise<void> {
    await axios.delete(`${API_URL}/reservations/${id}`);
  },

  async updateReservationStatus(id: number, status: string): Promise<Reservation> {
    const response = await axios.patch(`${API_URL}/reservations/${id}/status`, { status });
    return response.data;
  },

  async checkTableAvailability(
    tableId: number,
    date: string,
    time: string,
    duration: number,
    excludeReservationId?: number
  ): Promise<boolean> {
    const queryParams = new URLSearchParams({
      tableId: tableId.toString(),
      date,
      time,
      duration: duration.toString(),
    });

    if (excludeReservationId) {
      queryParams.append('excludeReservationId', excludeReservationId.toString());
    }

    const response = await axios.get(
      `${API_URL}/reservations/check-availability?${queryParams.toString()}`
    );
    return response.data.available;
  },

  async getFilterOptions(): Promise<{
    statuses: string[];
    tables: { id: number; name: string }[];
    maxGuestCount: number;
  }> {
    const response = await axios.get(`${API_URL}/reservations/filter-options`);
    return response.data;
  }
}; 