import React from 'react';
import { useSelector } from 'react-redux';
import { FiCoffee, FiUsers, FiAlertCircle, FiClock } from 'react-icons/fi';

const WaiterHeader = () => {
  const { tables } = useSelector(state => state.waiter);
  
  // Masa istatistiklerini hesapla
  const stats = tables.reduce((acc, table) => {
    if (table.status === 'occupied') {
      acc.occupied++;
      if (table.currentOrder?.status === 'waiting_payment') {
        acc.waitingPayment++;
      }
    } else if (table.status === 'reserved') {
      acc.reserved++;
    }
    return acc;
  }, {
    occupied: 0,
    reserved: 0,
    waitingPayment: 0
  });

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Garson Ekranı
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Toplam Masa
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {tables.length}
              </p>
            </div>
            <FiCoffee className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Dolu Masa
              </h3>
              <p className="text-2xl font-bold text-orange-600">
                {stats.occupied}
              </p>
            </div>
            <FiUsers className="w-8 h-8 text-orange-200" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Ödeme Bekleyen
              </h3>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.waitingPayment}
              </p>
            </div>
            <FiAlertCircle className="w-8 h-8 text-yellow-200" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Rezerveli
              </h3>
              <p className="text-2xl font-bold text-purple-600">
                {stats.reserved}
              </p>
            </div>
            <FiClock className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaiterHeader; 