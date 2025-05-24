import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addPayment } from '../../../../store/slices/waiterSlice';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { FiClock, FiCreditCard, FiDollarSign } from 'react-icons/fi';

const ActiveOrder = ({ order }) => {
  const dispatch = useDispatch();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentType, setPaymentType] = useState('cash');

  const handlePayment = (e) => {
    e.preventDefault();
    
    dispatch(addPayment({
      orderId: order._id,
      paymentData: {
        amount: parseFloat(paymentAmount),
        type: paymentType
      }
    }));

    setShowPaymentForm(false);
    setPaymentAmount('');
    setPaymentType('cash');
  };

  const remainingAmount = order.total - (order.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0);

  return (
    <div className="flex-1 overflow-auto">
      {/* Sipariş Başlığı */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">
            Sipariş #{order._id.slice(-4)}
          </span>
          <div className="flex items-center text-sm text-gray-500">
            <FiClock className="w-4 h-4 mr-1" />
            {formatDistanceToNow(new Date(order.createdAt), {
              addSuffix: true,
              locale: tr
            })}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-lg font-bold">
            Toplam: ₺{order.total.toFixed(2)}
          </div>
          <div className="text-sm">
            Kalan: ₺{remainingAmount.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Sipariş Öğeleri */}
      <div className="p-4">
        <h3 className="font-medium mb-4">Sipariş Detayı</h3>
        <ul className="space-y-4">
          {order.items.map(item => (
            <li key={item._id} className="flex items-start justify-between">
              <div>
                <div className="font-medium">{item.product.name}</div>
                <div className="text-sm text-gray-500">
                  {item.quantity} adet × ₺{item.product.price.toFixed(2)}
                </div>
                
                {item.variations?.length > 0 && (
                  <div className="text-sm text-gray-500 mt-1">
                    {item.variations.map((variation, index) => (
                      <span key={index} className="mr-2">
                        {variation.name}: {variation.value}
                        {variation.price > 0 && ` (+₺${variation.price.toFixed(2)})`}
                      </span>
                    ))}
                  </div>
                )}

                {item.notes && (
                  <div className="text-sm text-gray-500 mt-1">
                    Not: {item.notes}
                  </div>
                )}
              </div>
              
              <div className="text-right">
                <div className="font-medium">
                  ₺{(item.quantity * item.product.price).toFixed(2)}
                </div>
                {item.variations?.length > 0 && (
                  <div className="text-sm text-gray-500">
                    +₺{(item.quantity * item.variations.reduce((sum, v) => sum + (v.price || 0), 0)).toFixed(2)}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Ödemeler */}
      {order.payments?.length > 0 && (
        <div className="p-4 border-t">
          <h3 className="font-medium mb-4">Ödemeler</h3>
          <ul className="space-y-2">
            {order.payments.map(payment => (
              <li key={payment._id} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  {payment.type === 'cash' ? (
                    <FiDollarSign className="w-4 h-4 mr-2 text-green-500" />
                  ) : (
                    <FiCreditCard className="w-4 h-4 mr-2 text-blue-500" />
                  )}
                  <span>
                    {payment.type === 'cash' ? 'Nakit' : 'Kredi Kartı'}
                  </span>
                </div>
                <span>₺{payment.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Ödeme Formu */}
      {showPaymentForm ? (
        <div className="p-4 border-t">
          <form onSubmit={handlePayment}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ödeme Tutarı
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ödeme Tipi
                </label>
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="cash">Nakit</option>
                  <option value="credit_card">Kredi Kartı</option>
                </select>
              </div>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Ödeme Al
                </button>
                <button
                  type="button"
                  onClick={() => setShowPaymentForm(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  İptal
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="p-4 border-t">
          <button
            onClick={() => setShowPaymentForm(true)}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Ödeme Ekle
          </button>
        </div>
      )}
    </div>
  );
};

export default ActiveOrder; 