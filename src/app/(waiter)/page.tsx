'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Area = 'BAHÇE' | 'SALON' | 'TERAS';
type TableStatus = 'empty' | 'occupied' | 'reserved';

interface Table {
  id: number;
  number: string;
  status: TableStatus;
  time?: string;
  amount?: number;
}

const AREAS: Area[] = ['SALON', 'BAHÇE', 'TERAS'];

const TABLES: Record<Area, Table[]> = {
  SALON: Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    number: `S${i + 1}`,
    status: 'empty',
  })),
  BAHÇE: Array.from({ length: 8 }, (_, i) => ({
    id: i + 13,
    number: `B${i + 1}`,
    status: 'empty',
  })),
  TERAS: Array.from({ length: 6 }, (_, i) => ({
    id: i + 21,
    number: `T${i + 1}`,
    status: 'empty',
  })),
};

// Örnek veriler
TABLES.SALON[0] = { ...TABLES.SALON[0], status: 'occupied', time: '1s 15dk', amount: 245.50 };
TABLES.SALON[3] = { ...TABLES.SALON[3], status: 'reserved', time: '20:00' };
TABLES.BAHÇE[1] = { ...TABLES.BAHÇE[1], status: 'occupied', time: '45dk', amount: 180.00 };

export default function WaiterPage() {
  const [selectedArea, setSelectedArea] = useState<Area>('SALON');
  const router = useRouter();

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Alan Seçimi */}
      <div className="flex space-x-2 mb-6">
        {AREAS.map((area) => (
          <button
            key={area}
            onClick={() => setSelectedArea(area)}
            className={`px-6 py-3 rounded-lg font-medium text-sm transition-colors
              ${selectedArea === area
                ? 'bg-pink-600 text-white'
                : 'bg-white text-gray-700 hover:bg-pink-50'
              }`}
          >
            {area}
          </button>
        ))}
      </div>

      {/* Masa Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {TABLES[selectedArea].map((table) => (
          <button
            key={table.id}
            onClick={() => router.push(`/tables/${table.id}`)}
            className="bg-white rounded-xl p-4 text-left shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium">{table.number}</span>
              <div
                className={`w-3 h-3 rounded-full ${
                  table.status === 'occupied'
                    ? 'bg-green-500'
                    : table.status === 'reserved'
                    ? 'bg-yellow-500'
                    : 'bg-gray-300'
                }`}
              />
            </div>
            
            <div className="space-y-1">
              {table.status === 'occupied' && (
                <>
                  <p className="text-sm text-gray-600">{table.time}</p>
                  <p className="text-sm font-medium text-pink-600">
                    ₺{table.amount?.toFixed(2)}
                  </p>
                </>
              )}
              {table.status === 'reserved' && (
                <p className="text-sm text-yellow-600">
                  Rezervasyon: {table.time}
                </p>
              )}
              {table.status === 'empty' && (
                <p className="text-sm text-gray-500">Boş</p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 