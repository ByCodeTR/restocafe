import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrder } from '../hooks/useOrder';
import { OrderStatus, PaymentMethod } from '../types';

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  preparing: 'bg-blue-100 text-blue-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusText: Record<OrderStatus, string> = {
  pending: 'Bekliyor',
  preparing: 'Hazırlanıyor',
  ready: 'Hazır',
  delivered: 'Teslim Edildi',
  cancelled: 'İptal Edildi',
};

const paymentMethodText: Record<PaymentMethod, string> = {
  cash: 'Nakit',
  credit_card: 'Kredi Kartı',
  debit_card: 'Banka Kartı',
  mobile_payment: 'Mobil Ödeme',
};

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedOrder,
    isLoading,
    error,
    fetchOrderById,
    updateOrderItem,
    deleteOrderItem,
    addPayment,
    cancelOrder,
  } = useOrder();

  useEffect(() => {
    if (id) {
      fetchOrderById(Number(id));
    }
  }, [id, fetchOrderById]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Hata</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedOrder) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Sipariş bulunamadı</h3>
      </div>
    );
  }

  const handleStatusChange = async (itemId: number, status: OrderStatus) => {
    try {
      await updateOrderItem(selectedOrder.id, itemId, { status });
    } catch (error) {
      console.error('Status update failed:', error);
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      try {
        await deleteOrderItem(selectedOrder.id, itemId);
      } catch (error) {
        console.error('Item deletion failed:', error);
      }
    }
  };

  const handleAddPayment = async (method: PaymentMethod) => {
    const remainingAmount = selectedOrder.total - selectedOrder.payments.reduce((sum, payment) => sum + payment.amount, 0);
    if (remainingAmount <= 0) {
      alert('Sipariş ödemesi tamamlanmış');
      return;
    }

    try {
      await addPayment(selectedOrder.id, {
        amount: remainingAmount,
        method,
      });
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  const handleCancelOrder = async () => {
    if (window.confirm('Siparişi iptal etmek istediğinizden emin misiniz?')) {
      try {
        await cancelOrder(selectedOrder.id);
        navigate('/orders');
      } catch (error) {
        console.error('Order cancellation failed:', error);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Sipariş Detayları
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Sipariş bilgileri ve yönetimi
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Sipariş No</dt>
              <dd className="mt-1 text-sm text-gray-900">#{selectedOrder.id}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Masa</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedOrder.tableName}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Garson</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedOrder.waiterName}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Tarih</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(selectedOrder.createdAt).toLocaleString('tr-TR')}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Ürünler</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Ürün
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Adet
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Birim Fiyat
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Toplam
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Durum
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">İşlemler</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.productName}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.unitPrice.toFixed(2)} ₺
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.totalPrice.toFixed(2)} ₺
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <select
                              value={item.status}
                              onChange={(e) => handleStatusChange(item.id, e.target.value as OrderStatus)}
                              className={`rounded-full px-2 text-xs font-semibold leading-5 ${statusColors[item.status]}`}
                            >
                              {Object.entries(statusText).map(([value, label]) => (
                                <option key={value} value={value}>
                                  {label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Sil
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Ödemeler</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Tutar
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Yöntem
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Tarih
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {selectedOrder.payments.map((payment) => (
                        <tr key={payment.id}>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {payment.amount.toFixed(2)} ₺
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {paymentMethodText[payment.method]}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {new Date(payment.createdAt).toLocaleString('tr-TR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Toplam</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Ara Toplam:</span>
                    <span>{selectedOrder.subtotal.toFixed(2)} ₺</span>
                  </div>
                  <div className="flex justify-between">
                    <span>KDV:</span>
                    <span>{selectedOrder.tax.toFixed(2)} ₺</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Genel Toplam:</span>
                    <span>{selectedOrder.total.toFixed(2)} ₺</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Ödenen:</span>
                    <span>
                      {selectedOrder.payments
                        .reduce((sum, payment) => sum + payment.amount, 0)
                        .toFixed(2)} ₺
                    </span>
                  </div>
                  <div className="flex justify-between text-red-600 font-semibold">
                    <span>Kalan:</span>
                    <span>
                      {(
                        selectedOrder.total -
                        selectedOrder.payments.reduce((sum, payment) => sum + payment.amount, 0)
                      ).toFixed(2)} ₺
                    </span>
                  </div>
                </div>
              </dd>
            </div>
          </dl>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="flex justify-between items-center">
            <div className="space-x-3">
              <button
                onClick={() => handleAddPayment('cash')}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Nakit Ödeme
              </button>
              <button
                onClick={() => handleAddPayment('credit_card')}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Kredi Kartı
              </button>
            </div>
            <button
              onClick={handleCancelOrder}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Siparişi İptal Et
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail; 