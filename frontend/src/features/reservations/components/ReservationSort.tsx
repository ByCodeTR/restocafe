import React from 'react';
import { ReservationSortOptions } from '../types';

interface ReservationSortProps {
  currentSort: ReservationSortOptions;
  onSortChange: (sort: ReservationSortOptions) => void;
}

const ReservationSort: React.FC<ReservationSortProps> = ({
  currentSort,
  onSortChange,
}) => {
  const sortOptions = [
    { field: 'date', label: 'Tarih' },
    { field: 'time', label: 'Saat' },
    { field: 'guestCount', label: 'Kişi Sayısı' },
    { field: 'status', label: 'Durum' },
    { field: 'createdAt', label: 'Oluşturulma Tarihi' },
  ] as const;

  const handleSortFieldChange = (field: ReservationSortOptions['field']) => {
    if (field === currentSort.field) {
      // Aynı alan seçildiğinde sıralama yönünü değiştir
      onSortChange({
        field,
        direction: currentSort.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      // Farklı alan seçildiğinde varsayılan olarak artan sıralama
      onSortChange({
        field,
        direction: 'asc',
      });
    }
  };

  return (
    <div className="flex items-center space-x-4 mb-4">
      <span className="text-sm font-medium text-gray-700">Sırala:</span>
      <div className="flex flex-wrap gap-2">
        {sortOptions.map((option) => (
          <button
            key={option.field}
            onClick={() => handleSortFieldChange(option.field)}
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              currentSort.field === option.field
                ? 'bg-primary-100 text-primary-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {option.label}
            {currentSort.field === option.field && (
              <span className="ml-1">
                {currentSort.direction === 'asc' ? '↑' : '↓'}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReservationSort; 