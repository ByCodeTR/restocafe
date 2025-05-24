import React, { useEffect, useState } from 'react';
import { useReservation } from '../hooks/useReservation';
import { ReservationFilters as ReservationFiltersType, ReservationStatus } from '../types';
import { useTable } from '../../tables/hooks/useTable';

interface ReservationFiltersProps {
  onFiltersChange: (filters: ReservationFiltersType) => void;
  currentFilters: ReservationFiltersType;
}

const ReservationFilters: React.FC<ReservationFiltersProps> = ({
  onFiltersChange,
  currentFilters,
}) => {
  const { tables, fetchTables } = useTable();
  const [localFilters, setLocalFilters] = useState<ReservationFiltersType>(currentFilters);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  const handleInputChange = (
    field: keyof ReservationFiltersType,
    value: any
  ) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleDateRangeChange = (field: 'startDate' | 'endDate', value: string) => {
    const dateRange = {
      ...localFilters.dateRange,
      [field]: value,
    };
    handleInputChange('dateRange', dateRange);
  };

  const handleGuestCountChange = (field: 'min' | 'max', value: string) => {
    const guestCountRange = {
      ...localFilters.guestCountRange,
      [field]: value ? parseInt(value) : undefined,
    };
    handleInputChange('guestCountRange', guestCountRange);
  };

  const handleStatusChange = (status: ReservationStatus) => {
    const currentStatuses = localFilters.status || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter((s) => s !== status)
      : [...currentStatuses, status];
    handleInputChange('status', newStatuses);
  };

  const statusOptions: { value: ReservationStatus; label: string }[] = [
    { value: 'pending', label: 'Beklemede' },
    { value: 'confirmed', label: 'Onaylandı' },
    { value: 'cancelled', label: 'İptal Edildi' },
    { value: 'completed', label: 'Tamamlandı' },
    { value: 'no_show', label: 'Gelmedi' },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Tarih Aralığı */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tarih Aralığı</label>
          <div className="flex space-x-2">
            <input
              type="date"
              value={localFilters.dateRange?.startDate || ''}
              onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
            <input
              type="date"
              value={localFilters.dateRange?.endDate || ''}
              onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Masa Seçimi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Masa</label>
          <select
            value={localFilters.tableId || ''}
            onChange={(e) => handleInputChange('tableId', e.target.value ? Number(e.target.value) : undefined)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="">Tüm Masalar</option>
            {tables.map((table) => (
              <option key={table.id} value={table.id}>
                {table.name}
              </option>
            ))}
          </select>
        </div>

        {/* Kişi Sayısı Aralığı */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kişi Sayısı</label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={localFilters.guestCountRange?.min || ''}
              onChange={(e) => handleGuestCountChange('min', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
            <input
              type="number"
              placeholder="Max"
              value={localFilters.guestCountRange?.max || ''}
              onChange={(e) => handleGuestCountChange('max', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Arama */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Arama</label>
          <input
            type="text"
            placeholder="Müşteri adı, telefon..."
            value={localFilters.searchTerm || ''}
            onChange={(e) => handleInputChange('searchTerm', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>

        {/* Durum Filtreleri */}
        <div className="col-span-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStatusChange(option.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  localFilters.status?.includes(option.value)
                    ? 'bg-primary-100 text-primary-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationFilters; 