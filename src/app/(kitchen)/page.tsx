'use client';

import { useState } from 'react';
import { OrderStatus } from '@/components/waiter/OrderStatusModal';

interface KitchenOrder {
  id: number;
  tableNumber: string;
  items: {
    id: number;
    name: string;
    quantity: number;
    notes?: string;
    isReady?: boolean;
  }[];
  status: OrderStatus;
  time: string;
  waitTime: string;
}

// Örnek veri
const SAMPLE_ORDERS: KitchenOrder[] = [
  {
    id: 1,
    tableNumber: 'S4',
    items: [
      { id: 1, name: 'Karışık Pizza', quantity: 1, notes: 'Acısız' },
      { id: 2, name: 'Tavuk Şiş', quantity: 2 },
    ],
    status: 'preparing',
    time: '19:30',
    waitTime: '12dk',
  },
  {
    id: 2,
    tableNumber: 'B2',
    items: [
      { id: 3, name: 'Köfte', quantity: 1 },
      { id: 4, name: 'Patates Kızartması', quantity: 1 },
    ],
    status: 'preparing',
    time: '19:45',
    waitTime: '5dk',
  },
];

export default function KitchenPage() {
  const [orders, setOrders] = useState<KitchenOrder[]>(SAMPLE_ORDERS);

  const handleItemReady = (orderId: number, itemId: number) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      
      const updatedItems = order.items.map(item =>
        item.id === itemId ? { ...item, isReady: true } : item
      );
      
      // Tüm ürünler hazırsa siparişi hazır durumuna getir
      const allItemsReady = updatedItems.every(item => item.isReady);
      
      return {
        ...order,
        items: updatedItems,
        status: allItemsReady ? 'ready' : order.status,
      };
    }));
  };

  const handleOrderCancel = (orderId: number) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId
        ? { ...order, status: 'cancelled' }
        : order
    ));
  };

  const activeOrders = orders.filter(order => 
    order.status === 'preparing' || order.status === 'ready'
  );

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Üst Bilgi */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Mutfak Ekranı</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-sm">Hazırlanıyor</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm">Hazır</span>
          </div>
        </div>
      </div>

      {/* Siparişler Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeOrders.map((order) => (
          <div
            key={order.id}
            className={`bg-white rounded-xl shadow-sm overflow-hidden
              ${order.status === 'ready' ? 'border-2 border-blue-500' : ''}`}
          >
            {/* Sipariş Başlık */}
            <div className="p-4 bg-gray-50 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-semibold">Masa {order.tableNumber}</h2>
                  <p className="text-sm text-gray-500">
                    Sipariş: {order.time} ({order.waitTime})
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium
                    ${order.status === 'preparing'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                    }`}
                >
                  {order.status === 'preparing' ? 'Hazırlanıyor' : 'Hazır'}
                </span>
              </div>
            </div>

            {/* Sipariş İçeriği */}
            <div className="p-4">
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-2 rounded-lg
                      ${item.isReady ? 'bg-green-50' : 'bg-gray-50'}`}
                  >
                    <div>
                      <p className="font-medium">
                        {item.quantity}x {item.name}
                      </p>
                      {item.notes && (
                        <p className="text-sm text-gray-500">Not: {item.notes}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleItemReady(order.id, item.id)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium
                        ${item.isReady
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                    >
                      {item.isReady ? 'Hazır' : 'Hazırla'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Alt Butonlar */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleOrderCancel(order.id)}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200"
                >
                  İptal Et
                </button>
                {order.status === 'preparing' && order.items.every(item => item.isReady) && (
                  <button
                    onClick={() => handleItemReady(order.id, order.items[0].id)}
                    className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
                  >
                    Tümünü Hazırla
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 