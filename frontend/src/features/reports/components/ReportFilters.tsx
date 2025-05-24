import React from 'react';
import { ReportFilters as ReportFiltersType } from '../types';
import { useCategory } from '../../categories/hooks/useCategory';
import { useTable } from '../../tables/hooks/useTable';
import { useUser } from '../../users/hooks/useUser';

interface ReportFiltersProps {
  filters: ReportFiltersType;
  onFiltersChange: (filters: ReportFiltersType) => void;
  showCategoryFilter?: boolean;
  showWaiterFilter?: boolean;
  showTableFilter?: boolean;
  showPaymentMethodFilter?: boolean;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({
  filters,
  onFiltersChange,
  showCategoryFilter = false,
  showWaiterFilter = false,
  showTableFilter = false,
  showPaymentMethodFilter = false,
}) => {
  const { categories } = useCategory();
  const { tables } = useTable();
  const { users: waiters } = useUser();

  const handleDateRangeChange = (field: 'startDate' | 'endDate', value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value,
      },
    });
  };

  const handleMultiSelectChange = (field: keyof ReportFiltersType, value: string) => {
    const currentValues = filters[field] as number[] || [];
    const numericValue = parseInt(value);
    
    const newValues = currentValues.includes(numericValue)
      ? currentValues.filter((v) => v !== numericValue)
      : [...currentValues, numericValue];

    onFiltersChange({
      ...filters,
      [field]: newValues,
    });
  };

  const handlePaymentMethodChange = (method: string) => {
    const currentMethods = filters.paymentMethods || [];
    const newMethods = currentMethods.includes(method)
      ? currentMethods.filter((m) => m !== method)
      : [...currentMethods, method];

    onFiltersChange({
      ...filters,
      paymentMethods: newMethods,
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Tarih Aralığı */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tarih Aralığı
          </label>
          <div className="flex space-x-2">
            <input
              type="date"
              value={filters.dateRange.startDate}
              onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
            <input
              type="date"
              value={filters.dateRange.endDate}
              onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Kategori Filtresi */}
        {showCategoryFilter && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategoriler
            </label>
            <select
              multiple
              value={(filters.categories || []).map(String)}
              onChange={(e) => handleMultiSelectChange('categories', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Garson Filtresi */}
        {showWaiterFilter && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Garsonlar
            </label>
            <select
              multiple
              value={(filters.waiters || []).map(String)}
              onChange={(e) => handleMultiSelectChange('waiters', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              {waiters
                .filter((user) => user.role === 'waiter')
                .map((waiter) => (
                  <option key={waiter.id} value={waiter.id}>
                    {waiter.name}
                  </option>
                ))}
            </select>
          </div>
        )}

        {/* Masa Filtresi */}
        {showTableFilter && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Masalar
            </label>
            <select
              multiple
              value={(filters.tables || []).map(String)}
              onChange={(e) => handleMultiSelectChange('tables', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              {tables.map((table) => (
                <option key={table.id} value={table.id}>
                  {table.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Ödeme Yöntemi Filtresi */}
        {showPaymentMethodFilter && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ödeme Yöntemleri
            </label>
            <div className="flex flex-wrap gap-2">
              {['cash', 'credit_card', 'debit_card'].map((method) => (
                <button
                  key={method}
                  onClick={() => handlePaymentMethodChange(method)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    filters.paymentMethods?.includes(method)
                      ? 'bg-primary-100 text-primary-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {method === 'cash'
                    ? 'Nakit'
                    : method === 'credit_card'
                    ? 'Kredi Kartı'
                    : 'Banka Kartı'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportFilters; 