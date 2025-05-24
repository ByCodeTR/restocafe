import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filterReservations, cancelReservation } from '../../../store/slices/reservationSlice';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { FiSearch, FiFilter, FiClock, FiUsers, FiPhone, FiMail, FiTrash2 } from 'react-icons/fi';

const ReservationList = () => {
  const dispatch = useDispatch();
  const { reservations, loading } = useSelector(state => state.reservations);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    dispatch(filterReservations({
      status: statusFilter,
      search: searchTerm
    }));
  }, [dispatch, searchTerm, statusFilter]);

  const handleCancel = (id) => {
    if (window.confirm('Bu rezervasyonu iptal etmek istediğinize emin misiniz?')) {
      dispatch(cancelReservation(id));
    }
  };

  return (
    <div>
      {/* Filtreler */}
      <div className="flex items-center space-x-4 mb-6">
        {/* Arama */}
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Müşteri adı, telefon veya e-posta ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Durum Filtresi */}
        <div className="relative">
          <FiFilter className="absolute left-3 top-3 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
          >
            <option value="">Tüm Durumlar</option>
            <option value="pending">Beklemede</option>
            <option value="confirmed">Onaylandı</option>
            <option value="cancelled">İptal Edildi</option>
          </select>
        </div>
      </div>

      {/* Rezervasyon Listesi */}
      <div className="space-y-4">
        {reservations.map(reservation => (
          <div
            key={reservation._id}
            className={`
              p-4 rounded-lg border
              ${reservation.status === 'confirmed' ? 'border-green-200 bg-green-50' :
                reservation.status === 'pending' ? 'border-yellow-200 bg-yellow-50' :
                reservation.status === 'cancelled' ? 'border-red-200 bg-red-50' :
                'border-gray-200 bg-gray-50'}
            `}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium">{reservation.customerName}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                  {reservation.customerPhone && (
                    <div className="flex items-center">
                      <FiPhone className="w-4 h-4 mr-1" />
                      {reservation.customerPhone}
                    </div>
                  )}
                  {reservation.customerEmail && (
                    <div className="flex items-center">
                      <FiMail className="w-4 h-4 mr-1" />
                      {reservation.customerEmail}
                    </div>
                  )}
                </div>
              </div>

              {reservation.status !== 'cancelled' && (
                <button
                  onClick={() => handleCancel(reservation._id)}
                  className="text-red-500 hover:text-red-600"
                  disabled={loading.update}
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="flex items-center space-x-4 mt-4 text-sm">
              <div className="flex items-center">
                <FiClock className="w-4 h-4 mr-1 text-gray-500" />
                {format(new Date(reservation.time), 'PPp', { locale: tr })}
              </div>
              <div className="flex items-center">
                <FiUsers className="w-4 h-4 mr-1 text-gray-500" />
                {reservation.partySize} kişi
              </div>
              <div className={`
                px-2 py-1 rounded-full text-xs font-medium
                ${reservation.status === 'confirmed' ? 'bg-green-200 text-green-800' :
                  reservation.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                  'bg-red-200 text-red-800'}
              `}>
                {reservation.status === 'confirmed' ? 'Onaylandı' :
                 reservation.status === 'pending' ? 'Beklemede' :
                 'İptal Edildi'}
              </div>
            </div>

            {reservation.notes && (
              <div className="mt-2 text-sm text-gray-600">
                Not: {reservation.notes}
              </div>
            )}
          </div>
        ))}

        {reservations.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Rezervasyon bulunamadı
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationList; 