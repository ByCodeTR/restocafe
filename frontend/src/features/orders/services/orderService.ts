import axios from 'axios';
import {
  Order,
  OrderFilters,
  CreateOrderData,
  UpdateOrderItemData,
  CreatePaymentData,
} from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const orderService = {
  async getOrders(filters?: OrderFilters): Promise<Order[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }
    const response = await axios.get(`${API_URL}/orders?${params.toString()}`);
    return response.data;
  },

  async getOrderById(id: number): Promise<Order> {
    const response = await axios.get(`${API_URL}/orders/${id}`);
    return response.data;
  },

  async createOrder(data: CreateOrderData): Promise<Order> {
    const response = await axios.post(`${API_URL}/orders`, data);
    return response.data;
  },

  async updateOrderItem(
    orderId: number,
    itemId: number,
    data: UpdateOrderItemData
  ): Promise<Order> {
    const response = await axios.patch(
      `${API_URL}/orders/${orderId}/items/${itemId}`,
      data
    );
    return response.data;
  },

  async deleteOrderItem(orderId: number, itemId: number): Promise<void> {
    await axios.delete(`${API_URL}/orders/${orderId}/items/${itemId}`);
  },

  async addPayment(orderId: number, data: CreatePaymentData): Promise<Order> {
    const response = await axios.post(
      `${API_URL}/orders/${orderId}/payments`,
      data
    );
    return response.data;
  },

  async cancelOrder(orderId: number): Promise<Order> {
    const response = await axios.patch(`${API_URL}/orders/${orderId}/cancel`);
    return response.data;
  },

  async getDailySummary(): Promise<{
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
  }> {
    const response = await axios.get(`${API_URL}/orders/summary/daily`);
    return response.data;
  },
}; 