import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createReservation, checkAvailableTables } from '../../../store/slices/reservationSlice';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';

const ReservationForm = ({ onClose, initialData }) => {
  const dispatch = useDispatch();
  const { loading, error, availableTables } = useSelector(state => state.reservations);
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '12:00',
    partySize: 2,
    notes: '',
    ...initialData
  });

  const [step, setStep] = useState(1); // 1: Müşteri Bilgileri, 2: Masa Seçimi

  useEffect(() => {
    if (step === 2) {
      dispatch(checkAvailableTables({
        date: formData.date,
        time: formData.time,
        partySize: formData.partySize
      }));
    }
  }, [dispatch, step, formData.date, formData.time, formData.partySize]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      setStep(2);
      return;
    }

    if (!formData.tableId) {
      alert('Lütfen bir masa seçin');
      return;
    }

    const success = await dispatch(createReservation({
      ...formData,
      time: `${formData.date}T${formData.time}`
    }));

    if (success) {
      onClose();
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {step === 1 ? 'Yeni Rezervasyon' : 'Masa Seçimi'}
        </h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      {error.create && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
          <FiAlertCircle className="w-5 h-5 mr-2" />
          {error.create}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {step === 1 ? (
          <div className="space-y-4">
            {/* Müşteri Bilgileri */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Müşteri Adı *
              </label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  customerName: e.target.value
                }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefon
              </label>
              <input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  customerPhone: e.target.value
                }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-posta
              </label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  customerEmail: e.target.value
                }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Rezervasyon Detayları */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tarih *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    date: e.target.value
                  }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Saat *
                </label>
                <select
                  required
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    time: e.target.value
                  }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[...Array(12)].map((_, i) => {
                    const hour = i + 10; // 10:00'dan başla
                    return (
                      <option key={hour} value={`${hour}:00`}>
                        {hour}:00
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kişi Sayısı *
              </label>
              <input
                type="number"
                required
                min="1"
                max="20"
                value={formData.partySize}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  partySize: parseInt(e.target.value)
                }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notlar
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  notes: e.target.value
                }))}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        ) : (
          <div>
            {/* Müsait Masalar */}
            <div className="mb-4">
              <h3 className="font-medium text-gray-700 mb-2">
                Müsait Masalar
              </h3>
              {loading.check ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                </div>
              ) : availableTables.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {availableTables.map(table => (
                    <button
                      key={table._id}
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        tableId: table._id
                      }))}
                      className={`
                        p-4 rounded-lg border text-center
                        ${formData.tableId === table._id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-500'}
                      `}
                    >
                      <div className="font-medium">Masa {table.number}</div>
                      <div className="text-sm text-gray-500">
                        {table.capacity} kişilik
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  Seçilen tarih ve saatte müsait masa bulunamadı
                </div>
              )}
            </div>

            {/* Seçilen Rezervasyon Özeti */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-medium text-gray-700 mb-2">
                Rezervasyon Özeti
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Müşteri: </span>
                  {formData.customerName}
                </div>
                <div>
                  <span className="font-medium">Tarih: </span>
                  {format(new Date(`${formData.date}T${formData.time}`), 'PPp', { locale: tr })}
                </div>
                <div>
                  <span className="font-medium">Kişi Sayısı: </span>
                  {formData.partySize} kişi
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4 mt-6">
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Geri
            </button>
          )}
          <button
            type="submit"
            disabled={loading.create || (step === 2 && !formData.tableId)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {step === 1 ? 'Devam Et' : 'Rezervasyon Oluştur'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReservationForm; 