import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCustomer } from '../hooks/useCustomer';
import { CustomerHistory, LoyaltyActivity } from '../types';
import { formatDate, formatCurrency } from '../../../utils/formatters';

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedCustomer,
    getCustomerById,
    getCustomerHistory,
    getLoyaltyActivities,
    getCustomerMetrics,
    addLoyaltyPoints,
    redeemLoyaltyPoints,
    isLoading,
    error,
  } = useCustomer();

  const [history, setHistory] = useState<CustomerHistory | null>(null);
  const [loyaltyActivities, setLoyaltyActivities] = useState<LoyaltyActivity[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [pointsInput, setPointsInput] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (id) {
      const customerId = Number(id);
      getCustomerById(customerId);
      loadCustomerData(customerId);
    }
  }, [id, getCustomerById]);

  const loadCustomerData = async (customerId: number) => {
    try {
      const [historyData, loyaltyData, metricsData] = await Promise.all([
        getCustomerHistory(customerId),
        getLoyaltyActivities(customerId),
        getCustomerMetrics(customerId),
      ]);
      setHistory(historyData);
      setLoyaltyActivities(loyaltyData);
      setMetrics(metricsData);
    } catch (error) {
      console.error('Error loading customer data:', error);
    }
  };

  const handleLoyaltyPoints = async (type: 'earn' | 'redeem') => {
    if (!id || !pointsInput || !description) return;

    const points = Number(pointsInput);
    if (isNaN(points) || points <= 0) return;

    try {
      if (type === 'earn') {
        await addLoyaltyPoints(Number(id), points, description);
      } else {
        await redeemLoyaltyPoints(Number(id), points, description);
      }
      await loadCustomerData(Number(id));
      setPointsInput('');
      setDescription('');
    } catch (error) {
      console.error('Error managing loyalty points:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !selectedCustomer) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Hata</h3>
            <div className="mt-2 text-sm text-red-700">{error || 'Müşteri bulunamadı'}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Üst Başlık */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{selectedCustomer.name}</h2>
        <button
          onClick={() => navigate(`/customers/${id}/edit`)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
        >
          Düzenle
        </button>
      </div>

      {/* Müşteri Bilgileri */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Temel Bilgiler</h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">E-posta</dt>
                <dd className="text-sm text-gray-900">{selectedCustomer.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Telefon</dt>
                <dd className="text-sm text-gray-900">{selectedCustomer.phone}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Doğum Tarihi</dt>
                <dd className="text-sm text-gray-900">
                  {selectedCustomer.birthDate ? formatDate(selectedCustomer.birthDate) : '-'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Sadakat Puanı</dt>
                <dd className="text-sm text-gray-900">{selectedCustomer.loyaltyPoints} puan</dd>
              </div>
            </dl>
          </div>

          {metrics && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Müşteri Metrikleri</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Toplam Harcama</dt>
                  <dd className="text-sm text-gray-900">{formatCurrency(metrics.totalSpent)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Ortalama Sipariş Tutarı</dt>
                  <dd className="text-sm text-gray-900">{formatCurrency(metrics.averageOrderValue)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Ziyaret Sıklığı</dt>
                  <dd className="text-sm text-gray-900">{metrics.visitFrequency} gün</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Son Ziyaret</dt>
                  <dd className="text-sm text-gray-900">{formatDate(metrics.lastVisit)}</dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      </div>

      {/* Sadakat Programı */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sadakat Programı</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Puan İşlemleri</h4>
            <div className="space-y-3">
              <input
                type="number"
                value={pointsInput}
                onChange={(e) => setPointsInput(e.target.value)}
                placeholder="Puan miktarı"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Açıklama"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => handleLoyaltyPoints('earn')}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  Puan Ekle
                </button>
                <button
                  onClick={() => handleLoyaltyPoints('redeem')}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Puan Kullan
                </button>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Son İşlemler</h4>
            <div className="space-y-2">
              {loyaltyActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex justify-between items-center text-sm"
                >
                  <div>
                    <span className="font-medium">
                      {activity.type === 'earn' ? '+' : '-'}
                      {activity.points} puan
                    </span>
                    <span className="text-gray-500 ml-2">{activity.description}</span>
                  </div>
                  <span className="text-gray-500">
                    {formatDate(activity.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sipariş Geçmişi */}
      {history && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sipariş Geçmişi</h3>
          <div className="space-y-4">
            {history.orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-medium">Sipariş #{order.id}</span>
                    <span className="text-gray-500 ml-2">{formatDate(order.date)}</span>
                  </div>
                  <span className="font-medium text-primary-600">
                    {formatCurrency(order.total)}
                  </span>
                </div>
                <div className="space-y-1">
                  {order.items.map((item, index) => (
                    <div key={index} className="text-sm text-gray-600 flex justify-between">
                      <span>{item.productName} x {item.quantity}</span>
                      <span>{formatCurrency(item.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rezervasyon Geçmişi */}
      {history && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Rezervasyon Geçmişi</h3>
          <div className="space-y-4">
            {history.reservations.map((reservation) => (
              <div key={reservation.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">Masa {reservation.tableName}</span>
                    <span className="text-gray-500 ml-2">{formatDate(reservation.date)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{reservation.guestCount} Kişi</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      reservation.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : reservation.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {reservation.status === 'completed'
                        ? 'Tamamlandı'
                        : reservation.status === 'cancelled'
                        ? 'İptal Edildi'
                        : 'Beklemede'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetail; 