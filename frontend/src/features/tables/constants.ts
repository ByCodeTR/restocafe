import { TableStatus } from './types';

export const statusColors: Record<TableStatus, string> = {
  available: 'bg-green-100 text-green-800',
  occupied: 'bg-red-100 text-red-800',
  reserved: 'bg-yellow-100 text-yellow-800',
  maintenance: 'bg-gray-100 text-gray-800',
};

export const statusText: Record<TableStatus, string> = {
  available: 'Müsait',
  occupied: 'Dolu',
  reserved: 'Rezerve',
  maintenance: 'Bakımda',
}; 