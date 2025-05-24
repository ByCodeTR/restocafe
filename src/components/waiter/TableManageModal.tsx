import { useState } from 'react';

interface TableManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMergeTables: (targetTableId: string) => void;
  onSplitBill: (items: number[]) => void;
  currentTableId: string;
  availableTables: {
    id: string;
    number: string;
    status: 'empty' | 'occupied' | 'reserved';
  }[];
  billItems: {
    id: number;
    name: string;
    quantity: number;
    price: number;
  }[];
}

type ManageAction = 'merge' | 'split';

export default function TableManageModal({
  isOpen,
  onClose,
  onMergeTables,
  onSplitBill,
  currentTableId,
  availableTables,
  billItems,
}: TableManageModalProps) {
  const [action, setAction] = useState<ManageAction>('merge');
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  if (!isOpen) return null;

  const nearbyTables = availableTables.filter(table => 
    table.id !== currentTableId && table.status === 'occupied'
  );

  const handleAction = () => {
    if (action === 'merge' && selectedTable) {
      onMergeTables(selectedTable);
    } else if (action === 'split' && selectedItems.length > 0) {
      onSplitBill(selectedItems);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-lg">
        {/* Modal Başlık */}
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Masa Yönetimi</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* İşlem Seçimi */}
        <div className="p-4 border-b">
          <div className="flex space-x-4">
            <button
              onClick={() => setAction('merge')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm
                ${action === 'merge'
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
            >
              Masa Birleştir
            </button>
            <button
              onClick={() => setAction('split')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm
                ${action === 'split'
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
            >
              Hesap Böl
            </button>
          </div>
        </div>

        {/* İşlem İçeriği */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {action === 'merge' ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-500 mb-4">
                Birleştirmek istediğiniz masayı seçin
              </p>
              {nearbyTables.map((table) => (
                <button
                  key={table.id}
                  onClick={() => setSelectedTable(table.id)}
                  className={`w-full p-3 rounded-lg text-left transition-colors
                    ${selectedTable === table.id
                      ? 'bg-pink-50 border-2 border-pink-600'
                      : 'border border-gray-200 hover:bg-gray-50'
                    }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Masa {table.number}</span>
                    <span className="text-sm text-gray-500">Dolu</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-500 mb-4">
                Bölünecek hesap kalemlerini seçin
              </p>
              {billItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItems(prev =>
                    prev.includes(item.id)
                      ? prev.filter(id => id !== item.id)
                      : [...prev, item.id]
                  )}
                  className={`w-full p-3 rounded-lg text-left transition-colors
                    ${selectedItems.includes(item.id)
                      ? 'bg-pink-50 border-2 border-pink-600'
                      : 'border border-gray-200 hover:bg-gray-50'
                    }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        {item.quantity}x {item.name}
                      </p>
                    </div>
                    <p className="font-medium">₺{(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Alt Butonlar */}
        <div className="p-4 border-t">
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-200"
            >
              İptal
            </button>
            <button
              onClick={handleAction}
              disabled={
                (action === 'merge' && !selectedTable) ||
                (action === 'split' && selectedItems.length === 0)
              }
              className="flex-1 bg-pink-600 text-white py-2 rounded-lg font-medium hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {action === 'merge' ? 'Birleştir' : 'Böl'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 