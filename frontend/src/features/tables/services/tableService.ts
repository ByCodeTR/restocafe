import axios from 'axios';
import { Table, TableFilters, CreateTableData, UpdateTableStatusData, AssignWaiterData } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const tableService = {
  async getTables(filters?: TableFilters): Promise<Table[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }
    const response = await axios.get(`${API_URL}/tables?${params.toString()}`);
    return response.data;
  },

  async getTableById(id: number): Promise<Table> {
    const response = await axios.get(`${API_URL}/tables/${id}`);
    return response.data;
  },

  async getAvailableTables(filters?: Partial<TableFilters>): Promise<Table[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }
    const response = await axios.get(`${API_URL}/tables/available?${params.toString()}`);
    return response.data;
  },

  async createTable(data: CreateTableData): Promise<Table> {
    const response = await axios.post(`${API_URL}/tables`, data);
    return response.data;
  },

  async updateTable(id: number, data: Partial<CreateTableData>): Promise<Table> {
    const response = await axios.put(`${API_URL}/tables/${id}`, data);
    return response.data;
  },

  async deleteTable(id: number): Promise<void> {
    await axios.delete(`${API_URL}/tables/${id}`);
  },

  async updateTableStatus(id: number, data: UpdateTableStatusData): Promise<Table> {
    const response = await axios.patch(`${API_URL}/tables/${id}/status`, data);
    return response.data;
  },

  async assignWaiter(id: number, data: AssignWaiterData): Promise<Table> {
    const response = await axios.post(`${API_URL}/tables/${id}/waiter`, data);
    return response.data;
  },

  async removeWaiter(id: number): Promise<Table> {
    const response = await axios.delete(`${API_URL}/tables/${id}/waiter`);
    return response.data;
  },

  async generateQRCode(id: number): Promise<{ qrCode: string }> {
    const response = await axios.post(`${API_URL}/tables/${id}/qr-code`);
    return response.data;
  },

  async verifyQRCode(id: number, secret: string): Promise<boolean> {
    const response = await axios.post(`${API_URL}/tables/${id}/verify-qr`, { secret });
    return response.data.valid;
  }
}; 