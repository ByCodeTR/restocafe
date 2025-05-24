export type TableStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';

export interface Table {
  id: number;
  number: string;
  name: string;
  capacity: number;
  section: string;
  floor: number;
  status: TableStatus;
  waiterId?: number;
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TableFilters {
  status?: TableStatus;
  section?: string;
  floor?: number;
  capacity?: number;
  waiterId?: number;
}

export interface TableState {
  tables: Table[];
  selectedTable: Table | null;
  filters: TableFilters;
  isLoading: boolean;
  error: string | null;
}

export interface CreateTableData {
  number: string;
  name: string;
  capacity: number;
  section: string;
  floor: number;
}

export interface UpdateTableStatusData {
  status: TableStatus;
  waiterId?: number;
}

export interface AssignWaiterData {
  waiterId: number;
} 