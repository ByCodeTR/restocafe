import React, { useEffect, useState } from 'react';
import { useTable } from '../../tables/hooks/useTable';
import { useReservation } from '../hooks/useReservation';

interface TableAvailabilityCheckProps {
  selectedTableId?: number;
  date: string;
  time: string;
  duration: number;
  guestCount: number;
  excludeReservationId?: number;
  onTableSelect: (tableId: number) => void;
}

const TableAvailabilityCheck: React.FC<TableAvailabilityCheckProps> = ({
  selectedTableId,
  date,
  time,
  duration,
  guestCount,
  excludeReservationId,
  onTableSelect,
}) => {
  const { tables, fetchTables } = useTable();
  const { checkTableAvailability } = useReservation();
  const [availableTables, setAvailableTables] = useState<{ id: number; isAvailable: boolean }[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  useEffect(() => {
    const checkAvailability = async () => {
      if (!date || !time || !duration || !guestCount) return;

      setIsChecking(true);
      try {
        const availabilityPromises = tables
          .filter((table) => table.capacity >= guestCount)
          .map(async (table) => {
            const isAvailable = await checkTableAvailability(
              table.id,
              date,
              time,
              duration,
              excludeReservationId
            );
            return { id: table.id, isAvailable };
          });

        const results = await Promise.all(availabilityPromises);
        setAvailableTables(results);
      } catch (error) {
        console.error('Error checking table availability:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkAvailability();
  }, [tables, date, time, duration, guestCount, excludeReservationId, checkTableAvailability]);

  const getTableById = (id: number) => {
    return tables.find((table) => table.id === id);
  };

  if (isChecking) {
    return (
      <div className="animate-pulse">
        <label className="block text-sm font-medium text-gray-700">
          Masa müsaitliği kontrol ediliyor...
        </label>
        <div className="mt-1 h-10 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Masa</label>
      <select
        value={selectedTableId || ''}
        onChange={(e) => onTableSelect(Number(e.target.value))}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
      >
        <option value="">Masa Seçin</option>
        {tables
          .filter((table) => table.capacity >= guestCount)
          .map((table) => {
            const availability = availableTables.find((t) => t.id === table.id);
            const isAvailable = availability?.isAvailable;

            return (
              <option
                key={table.id}
                value={table.id}
                disabled={!isAvailable}
                className={!isAvailable ? 'text-gray-400' : ''}
              >
                {table.name} ({table.capacity} kişilik)
                {!isAvailable ? ' - Müsait Değil' : ''}
              </option>
            );
          })}
      </select>
      {selectedTableId && (
        <p className="mt-2 text-sm text-gray-500">
          Seçilen masa: {getTableById(selectedTableId)?.name} (
          {getTableById(selectedTableId)?.capacity} kişilik)
        </p>
      )}
    </div>
  );
};

export default TableAvailabilityCheck; 