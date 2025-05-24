import React from 'react';
import { useDispatch } from 'react-redux';
import { updateOrderItemStatus } from '../../../store/slices/kitchenSlice';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { FiClock, FiUser, FiInfo } from 'react-icons/fi';

const OrderCard = ({ order }) => {
  const dispatch = useDispatch();

  const handleStatusChange = (itemId, status) => {
    dispatch(updateOrderItemStatus({
      orderId: order._id,
      itemId,
      status
    }));
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      preparing: 'bg-orange-100 text-orange-800',
      ready: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusActions = (item) => {
    switch (item.status) {
      case 'pending':
        return (
          <button
            onClick={() => handleStatusChange(item._id, 'preparing')}
            className="px-3 py-1 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Hazırlanmaya Başla
          </button>
        );
      case 'preparing':
        return (
          <button
            onClick={() => handleStatusChange(item._id, 'ready')}
            className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Hazır
          </button>
        );
      case 'ready':
        return (
          <span className="text-sm text-green-600 font-medium">
            Servis için hazır
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Sipariş Başlığı */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">
            Masa {order.table.number}
          </h3>
          <span className="text-sm text-gray-500 flex items-center">
            <FiClock className="mr-1" />
            {formatDistanceToNow(new Date(order.createdAt), {
              addSuffix: true,
              locale: tr
            })}
          </span>
        </div>
        
        {order.customer && (
          <div className="flex items-center text-sm text-gray-600">
            <FiUser className="mr-1" />
            {order.customer.name}
          </div>
        )}
      </div>

      {/* Sipariş Öğeleri */}
      <div className="p-4">
        <ul className="space-y-4">
          {order.items.map(item => (
            <li key={item._id} className="border-b pb-4 last:border-0 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{item.product.name}</h4>
                  <span className="text-sm text-gray-500">
                    {item.quantity} adet
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-lg text-xs ${getStatusColor(item.status)}`}>
                  {item.status === 'pending' && 'Bekliyor'}
                  {item.status === 'preparing' && 'Hazırlanıyor'}
                  {item.status === 'ready' && 'Hazır'}
                </span>
              </div>

              {/* Varyasyonlar */}
              {item.variations && item.variations.length > 0 && (
                <div className="text-sm text-gray-600 mb-2">
                  {item.variations.map((variation, index) => (
                    <span key={index} className="mr-2">
                      {variation.name}: {variation.value}
                    </span>
                  ))}
                </div>
              )}

              {/* Notlar */}
              {item.notes && (
                <div className="flex items-start text-sm text-gray-600 mb-2">
                  <FiInfo className="mr-1 mt-0.5" />
                  <span>{item.notes}</span>
                </div>
              )}

              {/* Aksiyon Butonları */}
              <div className="mt-2">
                {getStatusActions(item)}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderCard; 