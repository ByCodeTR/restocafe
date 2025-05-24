import React from 'react';
import { useDispatch } from 'react-redux';
import { selectTable } from '../../../../store/slices/waiterSlice';
import { FiX, FiUsers } from 'react-icons/fi';

const OrderHeader = ({ table }) => {
  const dispatch = useDispatch();

  return (
    <div className="p-4 border-b">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <h2 className="text-xl font-bold">
            Masa {table.number}
          </h2>
          {table.capacity && (
            <div className="ml-2 flex items-center text-gray-500">
              <FiUsers className="w-4 h-4 mr-1" />
              <span>{table.capacity} kişi</span>
            </div>
          )}
        </div>
        
        <button
          onClick={() => dispatch(selectTable(null))}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      {/* Masa Durumu */}
      <div className="flex items-center space-x-2">
        <span
          className={`
            px-2 py-1 rounded-full text-sm font-medium
            ${table.status === 'available' ? 'bg-green-100 text-green-800' :
              table.status === 'occupied' ? 'bg-orange-100 text-orange-800' :
              table.status === 'reserved' ? 'bg-purple-100 text-purple-800' :
              'bg-gray-100 text-gray-800'}
          `}
        >
          {table.status === 'available' ? 'Müsait' :
           table.status === 'occupied' ? 'Dolu' :
           table.status === 'reserved' ? 'Rezerveli' : 'Bilinmiyor'}
        </span>

        {table.currentOrder?.status === 'waiting_payment' && (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
            Ödeme Bekliyor
          </span>
        )}
      </div>

      {/* Rezervasyon Bilgisi */}
      {table.status === 'reserved' && table.reservation && (
        <div className="mt-2 text-sm text-purple-600">
          <span className="font-medium">Rezervasyon: </span>
          {new Date(table.reservation.time).toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit'
          })}
          {table.reservation.customerName && ` - ${table.reservation.customerName}`}
        </div>
      )}
    </div>
  );
};

export default OrderHeader; 