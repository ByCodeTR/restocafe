import React from 'react';
import { useSelector } from 'react-redux';

const KitchenHeader = () => {
  const { activeOrders } = useSelector(state => state.kitchen);
  
  // Sipariş durumlarına göre sayıları hesapla
  const orderStats = activeOrders.reduce((acc, order) => {
    order.items.forEach(item => {
      acc[item.status] = (acc[item.status] || 0) + 1;
    });
    return acc;
  }, {});

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Mutfak Ekranı
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Toplam Sipariş
          </h3>
          <p className="text-2xl font-bold text-blue-600">
            {activeOrders.length}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Bekleyen
          </h3>
          <p className="text-2xl font-bold text-yellow-600">
            {orderStats.pending || 0}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Hazırlanıyor
          </h3>
          <p className="text-2xl font-bold text-orange-600">
            {orderStats.preparing || 0}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Hazır
          </h3>
          <p className="text-2xl font-bold text-green-600">
            {orderStats.ready || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default KitchenHeader; 