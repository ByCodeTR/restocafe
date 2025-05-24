import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, clearCart, createOrder } from '../../../../store/slices/waiterSlice';
import { FiTrash2, FiInfo } from 'react-icons/fi';

const Cart = () => {
  const dispatch = useDispatch();
  const { cart, selectedTable } = useSelector(state => state.waiter);
  const [customerName, setCustomerName] = useState('');
  const [customerNote, setCustomerNote] = useState('');

  const handleCreateOrder = () => {
    dispatch(createOrder({
      table: selectedTable._id,
      items: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        variations: item.variations,
        notes: item.notes
      })),
      customer: customerName ? { name: customerName } : undefined,
      notes: customerNote
    }));
  };

  if (!cart.items.length) {
    return (
      <div className="p-4 border-t">
        <div className="text-center text-gray-500">
          Sepet boş
        </div>
      </div>
    );
  }

  return (
    <div className="border-t">
      {/* Sepet Öğeleri */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Sepet</h3>
          <button
            onClick={() => dispatch(clearCart())}
            className="text-sm text-red-500 hover:text-red-600"
          >
            Sepeti Temizle
          </button>
        </div>

        <ul className="space-y-4">
          {cart.items.map((item, index) => (
            <li key={index} className="flex items-start justify-between">
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
                  <div className="flex items-start text-sm text-gray-500 mt-1">
                    <FiInfo className="w-4 h-4 mr-1" />
                    <span>{item.notes}</span>
                  </div>
                )}
              </div>

              <div className="flex items-start">
                <div className="text-right mr-4">
                  <div className="font-medium">
                    ₺{(item.quantity * item.product.price).toFixed(2)}
                  </div>
                  {item.variations?.length > 0 && (
                    <div className="text-sm text-gray-500">
                      +₺{(item.quantity * item.variations.reduce((sum, v) => sum + (v.price || 0), 0)).toFixed(2)}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => dispatch(removeFromCart({
                    productId: item.product._id,
                    variations: item.variations
                  }))}
                  className="text-gray-400 hover:text-red-500"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Toplam */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <span className="font-medium">Toplam</span>
          <span className="text-xl font-bold">₺{cart.total.toFixed(2)}</span>
        </div>

        {/* Müşteri Bilgileri */}
        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Müşteri Adı (Opsiyonel)
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Örn: Ahmet Yılmaz"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sipariş Notu (Opsiyonel)
            </label>
            <textarea
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Örn: Özel istek veya not"
            />
          </div>
        </div>

        {/* Sipariş Oluştur */}
        <button
          onClick={handleCreateOrder}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Sipariş Oluştur
        </button>
      </div>
    </div>
  );
};

export default Cart; 