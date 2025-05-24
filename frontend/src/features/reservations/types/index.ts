export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
}

export interface Reservation {
  id: number;
  customerId: number;
  customer: Customer;
  tableId: number;
  tableName: string;
  date: string;
  time: string;
  duration: number; // in minutes
  guestCount: number;
  status: ReservationStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationData {
  customer: {
    name: string;
    phone: string;
    email?: string;
    notes?: string;
  };
  tableId: number;
  date: string;
  time: string;
  duration: number;
  guestCount: number;
  notes?: string;
}

export interface UpdateReservationData {
  tableId?: number;
  date?: string;
  time?: string;
  duration?: number;
  guestCount?: number;
  status?: ReservationStatus;
  notes?: string;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface ReservationFilters {
  dateRange?: DateRange;
  status?: ReservationStatus[];
  tableId?: number;
  searchTerm?: string;
  guestCountRange?: {
    min?: number;
    max?: number;
  };
}

export interface ReservationSortOptions {
  field: 'date' | 'time' | 'guestCount' | 'status' | 'createdAt';
  direction: 'asc' | 'desc';
}

export interface ReservationListParams {
  filters?: ReservationFilters;
  sort?: ReservationSortOptions;
  page?: number;
  limit?: number;
}

export interface ReservationState {
  items: Reservation[];
  selectedReservation: Reservation | null;
  filters: ReservationFilters;
  sort: ReservationSortOptions;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  isLoading: boolean;
  error: string | null;
} 