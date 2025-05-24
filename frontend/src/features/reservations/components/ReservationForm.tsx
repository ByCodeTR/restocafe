import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useReservation } from '../hooks/useReservation';
import { useTable } from '../../tables/hooks/useTable';
import { CreateReservationData } from '../types';
import { getCurrentDateString, getCurrentTimeString } from '../../../utils/dateUtils';

const ReservationForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tables, fetchTables } = useTable();
  const {
    selectedReservation,
    isLoading,
    error,
    getReservationById,
    createReservation,
    updateReservation,
    checkTableAvailability,
  } = useReservation();

  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

  useEffect(() => {
    fetchTables();
    if (id) {
      getReservationById(Number(id));
    }
  }, [id, fetchTables, getReservationById]);

  const validationSchema = Yup.object({
    customer: Yup.object({
      name: Yup.string().required('Müşteri adı zorunludur'),
      phone: Yup.string().required('Telefon numarası zorunludur'),
      email: Yup.string().email('Geçerli bir e-posta adresi giriniz'),
      notes: Yup.string(),
    }),
    tableId: Yup.number().required('Masa seçimi zorunludur'),
    date: Yup.string().required('Tarih seçimi zorunludur'),
    time: Yup.string().required('Saat seçimi zorunludur'),
    duration: Yup.number()
      .required('Süre zorunludur')
      .min(30, 'Minimum süre 30 dakikadır')
      .max(240, 'Maksimum süre 4 saattir'),
    guestCount: Yup.number()
      .required('Kişi sayısı zorunludur')
      .min(1, 'En az 1 kişi olmalıdır'),
    notes: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      customer: {
        name: selectedReservation?.customer.name || '',
        phone: selectedReservation?.customer.phone || '',
        email: selectedReservation?.customer.email || '',
        notes: selectedReservation?.customer.notes || '',
      },
      tableId: selectedReservation?.tableId || 0,
      date: selectedReservation?.date || getCurrentDateString(),
      time: selectedReservation?.time || getCurrentTimeString(),
      duration: selectedReservation?.duration || 60,
      guestCount: selectedReservation?.guestCount || 1,
      notes: selectedReservation?.notes || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const isAvailable = await checkTableAvailability(
        values.tableId,
        values.date,
        values.time,
        values.duration,
        id ? Number(id) : undefined
      );

      if (!isAvailable) {
        setAvailabilityError('Seçilen masa ve zaman dilimi müsait değil');
        return;
      }

      try {
        if (id) {
          await updateReservation(Number(id), values);
        } else {
          await createReservation(values as CreateReservationData);
        }
        navigate('/reservations');
      } catch (error) {
        console.error('Rezervasyon kaydedilirken hata oluştu:', error);
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Hata</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {id ? 'Rezervasyon Düzenle' : 'Yeni Rezervasyon'}
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <form onSubmit={formik.handleSubmit} className="space-y-6 p-6">
            {/* Müşteri Bilgileri */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="customer.name" className="block text-sm font-medium text-gray-700">
                  Müşteri Adı
                </label>
                <input
                  type="text"
                  id="customer.name"
                  {...formik.getFieldProps('customer.name')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                {formik.touched.customer?.name && formik.errors.customer?.name && (
                  <p className="mt-2 text-sm text-red-600">{formik.errors.customer.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="customer.phone" className="block text-sm font-medium text-gray-700">
                  Telefon
                </label>
                <input
                  type="tel"
                  id="customer.phone"
                  {...formik.getFieldProps('customer.phone')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                {formik.touched.customer?.phone && formik.errors.customer?.phone && (
                  <p className="mt-2 text-sm text-red-600">{formik.errors.customer.phone}</p>
                )}
              </div>

              <div>
                <label htmlFor="customer.email" className="block text-sm font-medium text-gray-700">
                  E-posta
                </label>
                <input
                  type="email"
                  id="customer.email"
                  {...formik.getFieldProps('customer.email')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                {formik.touched.customer?.email && formik.errors.customer?.email && (
                  <p className="mt-2 text-sm text-red-600">{formik.errors.customer.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="guestCount" className="block text-sm font-medium text-gray-700">
                  Kişi Sayısı
                </label>
                <input
                  type="number"
                  id="guestCount"
                  min="1"
                  {...formik.getFieldProps('guestCount')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                {formik.touched.guestCount && formik.errors.guestCount && (
                  <p className="mt-2 text-sm text-red-600">{formik.errors.guestCount}</p>
                )}
              </div>
            </div>

            {/* Rezervasyon Detayları */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="tableId" className="block text-sm font-medium text-gray-700">
                  Masa
                </label>
                <select
                  id="tableId"
                  {...formik.getFieldProps('tableId')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="">Masa Seçin</option>
                  {tables.map((table) => (
                    <option key={table.id} value={table.id}>
                      {table.name}
                    </option>
                  ))}
                </select>
                {formik.touched.tableId && formik.errors.tableId && (
                  <p className="mt-2 text-sm text-red-600">{formik.errors.tableId}</p>
                )}
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Tarih
                </label>
                <input
                  type="date"
                  id="date"
                  {...formik.getFieldProps('date')}
                  min={getCurrentDateString()}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                {formik.touched.date && formik.errors.date && (
                  <p className="mt-2 text-sm text-red-600">{formik.errors.date}</p>
                )}
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                  Saat
                </label>
                <input
                  type="time"
                  id="time"
                  {...formik.getFieldProps('time')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                {formik.touched.time && formik.errors.time && (
                  <p className="mt-2 text-sm text-red-600">{formik.errors.time}</p>
                )}
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                  Süre (Dakika)
                </label>
                <input
                  type="number"
                  id="duration"
                  min="30"
                  max="240"
                  step="30"
                  {...formik.getFieldProps('duration')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                {formik.touched.duration && formik.errors.duration && (
                  <p className="mt-2 text-sm text-red-600">{formik.errors.duration}</p>
                )}
              </div>
            </div>

            {/* Notlar */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notlar
              </label>
              <textarea
                id="notes"
                rows={3}
                {...formik.getFieldProps('notes')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
              {formik.touched.notes && formik.errors.notes && (
                <p className="mt-2 text-sm text-red-600">{formik.errors.notes}</p>
              )}
            </div>

            {availabilityError && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Masa Müsaitlik Hatası</h3>
                    <div className="mt-2 text-sm text-red-700">{availabilityError}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/reservations')}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                İptal
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {id ? 'Güncelle' : 'Oluştur'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReservationForm; 