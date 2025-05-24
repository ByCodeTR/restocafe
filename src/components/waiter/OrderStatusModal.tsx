interface OrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (status: OrderStatus, note?: string) => void;
  currentStatus: OrderStatus;
  orderTime: string;
  orderItems: { name: string; quantity: number }[];
}

export type OrderStatus = 'preparing' | 'ready' | 'served' | 'cancelled';

export default function OrderStatusModal({
  isOpen,
  onClose,
  onStatusUpdate,
  currentStatus,
  orderTime,
  orderItems,
}: OrderStatusModalProps) {
  if (!isOpen) return null;

  const statusOptions: { value: OrderStatus; label: string; color: string }[] = [
    { value: 'preparing', label: 'Hazırlanıyor', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'ready', label: 'Hazır', color: 'bg-blue-100 text-blue-800' },
    { value: 'served', label: 'Servis Edildi', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'İptal Edildi', color: 'bg-red-100 text-red-800' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-lg">
        {/* Modal Başlık */}
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Sipariş Durumu</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">Sipariş Saati: {orderTime}</p>
        </div>

        {/* Sipariş İçeriği */}
        <div className="p-4 border-b">
          <h3 className="font-medium mb-2">Sipariş Detayı</h3>
          <div className="space-y-1">
            {orderItems.map((item, index) => (
              <p key={index} className="text-sm">
                {item.quantity}x {item.name}
              </p>
            ))}
          </div>
        </div>

        {/* Durum Seçenekleri */}
        <div className="p-4 space-y-2">
          <h3 className="font-medium mb-3">Yeni Durum</h3>
          {statusOptions.map((status) => (
            <button
              key={status.value}
              onClick={() => onStatusUpdate(status.value)}
              className={`w-full p-3 rounded-lg text-left transition-colors ${
                currentStatus === status.value
                  ? 'border-2 border-pink-600'
                  : 'border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{status.label}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${status.color}`}>
                  {status.label}
                </span>
              </div>
            </button>
          ))}
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
              onClick={() => onStatusUpdate(currentStatus)}
              className="flex-1 bg-pink-600 text-white py-2 rounded-lg font-medium hover:bg-pink-700"
            >
              Güncelle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 