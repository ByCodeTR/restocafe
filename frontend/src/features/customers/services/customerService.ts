import axios from 'axios';
import { Customer, CustomerFilters, CustomerHistory, LoyaltyActivity } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const customerService = {
  // Müşteri CRUD işlemleri
  async getCustomers(filters: CustomerFilters): Promise<{ customers: Customer[]; totalPages: number }> {
    const response = await axios.get(`${API_URL}/customers`, { params: filters });
    return response.data;
  },

  async getCustomerById(id: number): Promise<Customer> {
    const response = await axios.get(`${API_URL}/customers/${id}`);
    return response.data;
  },

  async createCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    const response = await axios.post(`${API_URL}/customers`, customer);
    return response.data;
  },

  async updateCustomer(id: number, customer: Partial<Customer>): Promise<Customer> {
    const response = await axios.put(`${API_URL}/customers/${id}`, customer);
    return response.data;
  },

  async deleteCustomer(id: number): Promise<void> {
    await axios.delete(`${API_URL}/customers/${id}`);
  },

  // Müşteri geçmişi ve sadakat programı
  async getCustomerHistory(id: number): Promise<CustomerHistory> {
    const response = await axios.get(`${API_URL}/customers/${id}/history`);
    return response.data;
  },

  async getLoyaltyActivities(id: number): Promise<LoyaltyActivity[]> {
    const response = await axios.get(`${API_URL}/customers/${id}/loyalty-activities`);
    return response.data;
  },

  async addLoyaltyPoints(id: number, points: number, description: string): Promise<LoyaltyActivity> {
    const response = await axios.post(`${API_URL}/customers/${id}/loyalty-points`, {
      points,
      description,
      type: 'earn',
    });
    return response.data;
  },

  async redeemLoyaltyPoints(id: number, points: number, description: string): Promise<LoyaltyActivity> {
    const response = await axios.post(`${API_URL}/customers/${id}/loyalty-points`, {
      points,
      description,
      type: 'redeem',
    });
    return response.data;
  },

  // Müşteri analizi
  async getCustomerSegments(): Promise<{ segment: string; count: number; totalSpent: number }[]> {
    const response = await axios.get(`${API_URL}/customers/segments`);
    return response.data;
  },

  async getCustomerMetrics(id: number): Promise<{
    totalSpent: number;
    averageOrderValue: number;
    visitFrequency: number;
    lastVisit: string;
    favoriteProducts: { productName: string; orderCount: number }[];
  }> {
    const response = await axios.get(`${API_URL}/customers/${id}/metrics`);
    return response.data;
  },
}; 