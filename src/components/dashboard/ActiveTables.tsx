interface TableData {
  id: number;
  name: string;
  status: 'empty' | 'occupied' | 'reserved';
  time?: string;
  amount?: number;
}

export default function ActiveTables() {
  const tables: TableData[] = [
    { id: 1, name: 'Masa 1', status: 'occupied', time: '1s 30dk', amount: 450.50 },
    { id: 2, name: 'Masa 4', status: 'occupied', time: '45dk', amount: 280.00 },
    { id: 3, name: 'Masa 7', status: 'reserved', time: '20:00' },
    { id: 4, name: 'Masa 12', status: 'empty' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Aktif Masalar</h2>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          Tümünü Gör
        </button>
      </div>
      
      <div className="space-y-4">
        {tables.map((table) => (
          <div
            key={table.id}
            className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  table.status === 'occupied'
                    ? 'bg-green-500'
                    : table.status === 'reserved'
                    ? 'bg-yellow-500'
                    : 'bg-gray-300'
                }`}
              />
              <div>
                <p className="font-medium text-gray-900">{table.name}</p>
                <p className="text-sm text-gray-500">
                  {table.status === 'occupied'
                    ? `${table.time} - ₺${table.amount?.toFixed(2)}`
                    : table.status === 'reserved'
                    ? `Rezervasyon: ${table.time}`
                    : 'Boş'}
                </p>
              </div>
            </div>
            
            <button className="p-2 hover:bg-white rounded-lg transition-colors">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 