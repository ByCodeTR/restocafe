export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthDate?: string;
  notes?: string;
  loyaltyPoints: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerFilters {
  search?: string;
  sortBy?: keyof Customer;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  filters: CustomerFilters;
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}

export interface LoyaltyActivity {
  id: number;
  customerId: number;
  type: 'earn' | 'redeem';
  points: number;
  description: string;
  createdAt: string;
}

export interface CustomerHistory {
  reservations: {
    id: number;
    date: string;
    status: string;
    tableId: number;
    tableName: string;
    guestCount: number;
  }[];
  orders: {
    id: number;
    date: string;
    total: number;
    status: string;
    items: {
      productName: string;
      quantity: number;
      price: number;
    }[];
  }[];
  loyaltyActivities: LoyaltyActivity[];
} 