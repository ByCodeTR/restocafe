export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'partial' | 'completed' | 'refunded';
export type PaymentMethod = 'cash' | 'credit_card' | 'debit_card' | 'mobile_payment';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  status: OrderStatus;
}

export interface Payment {
  id: number;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  createdAt: string;
}

export interface Order {
  id: number;
  tableId: number;
  tableName: string;
  waiterId: number;
  waiterName: string;
  status: OrderStatus;
  items: OrderItem[];
  payments: Payment[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  tableId?: number;
  waiterId?: number;
  startDate?: string;
  endDate?: string;
}

export interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  filters: OrderFilters;
  isLoading: boolean;
  error: string | null;
}

export interface CreateOrderItem {
  productId: number;
  quantity: number;
  notes?: string;
}

export interface CreateOrderData {
  tableId: number;
  items: CreateOrderItem[];
  notes?: string;
}

export interface UpdateOrderItemData {
  quantity?: number;
  notes?: string;
  status?: OrderStatus;
}

export interface CreatePaymentData {
  amount: number;
  method: PaymentMethod;
} 