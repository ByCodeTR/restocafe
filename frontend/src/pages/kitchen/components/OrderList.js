import React from 'react';
import OrderCard from './OrderCard';

const OrderList = ({ orders }) => {
  if (!orders.length) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow">
        <p className="text-xl text-gray-500">
          Aktif sipariş bulunmamaktadır.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {orders.map(order => (
        <OrderCard key={order._id} order={order} />
      ))}
    </div>
  );
};

export default OrderList; 