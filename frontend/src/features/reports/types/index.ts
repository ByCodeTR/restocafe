export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface DailySalesReport {
  date: string;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  paymentMethods: {
    method: string;
    amount: number;
    count: number;
  }[];
  hourlyDistribution: {
    hour: number;
    sales: number;
    orders: number;
  }[];
}

export interface ProductSalesReport {
  productId: number;
  productName: string;
  categoryName: string;
  quantity: number;
  totalSales: number;
  averagePrice: number;
  returnCount: number;
}

export interface WaiterPerformanceReport {
  waiterId: number;
  waiterName: string;
  totalOrders: number;
  totalSales: number;
  averageOrderValue: number;
  serviceSpeed: number; // dakika cinsinden ortalama servis süresi
  customerRating: number;
  tableTurnoverRate: number;
}

export interface TableOccupancyReport {
  tableId: number;
  tableName: string;
  totalReservations: number;
  totalOrders: number;
  occupancyRate: number; // yüzde olarak
  averageDuration: number; // dakika cinsinden
  peakHours: {
    hour: number;
    occupancyRate: number;
  }[];
  revenue: number;
}

export interface ReportFilters {
  dateRange: DateRange;
  categories?: number[];
  waiters?: number[];
  tables?: number[];
  paymentMethods?: string[];
}

export interface ReportState {
  dailySales: DailySalesReport | null;
  productSales: ProductSalesReport[];
  waiterPerformance: WaiterPerformanceReport[];
  tableOccupancy: TableOccupancyReport[];
  filters: ReportFilters;
  isLoading: boolean;
  error: string | null;
} 