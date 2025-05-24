'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import OrderStatusModal, { OrderStatus } from '@/components/waiter/OrderStatusModal';
import TableManageModal from '@/components/waiter/TableManageModal';

interface Order {
  id: number;
  items: OrderItem[];
  status: OrderStatus;
  time: string;
}

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

// Örnek veri
const SAMPLE_ORDERS: Order[] = [
  {
    id: 1,
    items: [
      { id: 1, name: 'Karışık Pizza', quantity: 1, price: 120.00, notes: 'Acısız' },
      { id: 2, name: 'Kola', quantity: 2, price: 15.00 },
    ],
    status: 'served',
    time: '19:30',
  },
  {
    id: 2,
    items: [
      { id: 3, name: 'Tavuk Şiş', quantity: 1, price: 85.00 },
      { id: 4, name: 'Ayran', quantity: 1, price: 10.00 },
    ],
    status: 'preparing',
    time: '19:45',
  },
];

// Örnek masa verileri
const SAMPLE_TABLES = [
  { id: '1', number: 'S1', status: 'occupied' as const },
  { id: '2', number: 'S2', status: 'occupied' as const },
  { id: '3', number: 'S3', status: 'empty' as const },
  { id: '4', number: 'S4', status: 'reserved' as const },
];

export default function TableDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  const tableId = params.id as string;
  const totalAmount = orders.reduce((sum, order) => 
    sum + order.items.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0)
  , 0);

  const handleStatusUpdate = (orderId: number, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId
        ? { ...order, status: newStatus }
        : order
    ));
    setSelectedOrder(null);
  };

  const handleMergeTables = (targetTableId: string) => {
    // Burada masa birleştirme işlemi yapılacak
    console.log('Masalar birleştirildi:', tableId, targetTableId);
  };

  const handleSplitBill = (items: number[]) => {
    // Burada hesap bölme işlemi yapılacak
    console.log('Hesap bölündü:', items);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* Üst Bilgi */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold">Masa {tableId}</h1>
        <button
          onClick={() => setIsManageModalOpen(true)}
          className="text-gray-600 hover:text-gray-800"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </button>
      </div>

      {/* Masa Bilgileri */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600">Toplam Süre</p>
            <p className="text-2xl font-semibold">1s 45dk</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600">Toplam Tutar</p>
            <p className="text-2xl font-semibold text-pink-600">₺{totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Siparişler */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">{order.time}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium
                    ${order.status === 'preparing'
                      ? 'bg-yellow-100 text-yellow-800'
                      : order.status === 'ready'
                      ? 'bg-blue-100 text-blue-800'
                      : order.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                    }`}
                >
                  {order.status === 'preparing'
                    ? 'Hazırlanıyor'
                    : order.status === 'ready'
                    ? 'Hazır'
                    : order.status === 'cancelled'
                    ? 'İptal Edildi'
                    : 'Servis Edildi'}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(order)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {item.notes && (
                      <p className="text-sm text-gray-500">Not: {item.notes}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {item.quantity}x ₺{item.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      ₺{(item.quantity * item.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Alt Butonlar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <div className="max-w-3xl mx-auto flex space-x-4">
          <button
            onClick={() => router.push(`/tables/${tableId}/new-order`)}
            className="flex-1 bg-pink-600 text-white py-3 rounded-lg font-medium hover:bg-pink-700"
          >
            Yeni Sipariş
          </button>
          <button
            onClick={() => router.push(`/tables/${tableId}/payment`)}
            className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-200"
          >
            Hesap İşlemleri
          </button>
        </div>
      </div>

      {/* Sipariş Durumu Modal */}
      {selectedOrder && (
        <OrderStatusModal
          isOpen={true}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={(status) => handleStatusUpdate(selectedOrder.id, status)}
          currentStatus={selectedOrder.status}
          orderTime={selectedOrder.time}
          orderItems={selectedOrder.items.map(item => ({
            name: item.name,
            quantity: item.quantity,
          }))}
        />
      )}

      {/* Masa Yönetimi Modal */}
      <TableManageModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        onMergeTables={handleMergeTables}
        onSplitBill={handleSplitBill}
        currentTableId={tableId}
        availableTables={SAMPLE_TABLES}
        billItems={orders.flatMap(order => order.items)}
      />
    </div>
  );
} 