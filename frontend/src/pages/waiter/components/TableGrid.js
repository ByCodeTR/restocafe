import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectTable } from '../../../store/slices/waiterSlice';
import { FiUsers, FiClock, FiAlertCircle } from 'react-icons/fi';

const TableCard = ({ table }) => {
  const dispatch = useDispatch();
  const selectedTable = useSelector(state => state.waiter.selectedTable);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 border-green-200';
      case 'occupied':
        return 'bg-orange-100 border-orange-200';
      case 'reserved':
        return 'bg-purple-100 border-purple-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'occupied':
        return <FiUsers className="w-6 h-6 text-orange-500" />;
      case 'reserved':
        return <FiClock className="w-6 h-6 text-purple-500" />;
      case 'waiting_payment':
        return <FiAlertCircle className="w-6 h-6 text-yellow-500" />;
      default:
        return null;
    }
  };

  const isSelected = selectedTable?._id === table._id;

  return (
    <div
      className={`
        relative p-4 rounded-lg border-2 cursor-pointer transition-all
        ${getStatusColor(table.status)}
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
        hover:shadow-lg
      `}
      onClick={() => dispatch(selectTable(table))}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold">
          Masa {table.number}
        </h3>
        {getStatusIcon(table.status)}
      </div>

      <div className="space-y-1 text-sm">
        {table.capacity && (
          <p className="text-gray-600">
            Kapasite: {table.capacity} kişi
          </p>
        )}
        
        {table.currentOrder && (
          <>
            <p className="text-gray-600">
              Sipariş: #{table.currentOrder._id.slice(-4)}
            </p>
            <p className="text-gray-600">
              Tutar: ₺{table.currentOrder.total.toFixed(2)}
            </p>
          </>
        )}

        {table.status === 'reserved' && table.reservation && (
          <p className="text-purple-600 font-medium">
            {new Date(table.reservation.time).toLocaleTimeString('tr-TR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        )}
      </div>

      {/* Ödeme Bekliyor Badge */}
      {table.currentOrder?.status === 'waiting_payment' && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">
          Ödeme Bekliyor
        </div>
      )}
    </div>
  );
};

const TableGrid = ({ tables }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tables.map(table => (
        <TableCard key={table._id} table={table} />
      ))}
    </div>
  );
};

export default TableGrid; 