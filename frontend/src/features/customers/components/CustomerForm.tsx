import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCustomer } from '../hooks/useCustomer';
import { Customer } from '../types';

const validationSchema = Yup.object({
  name: Yup.string().required('Ad Soyad zorunludur'),
  email: Yup.string().email('Geçerli bir e-posta adresi giriniz').required('E-posta zorunludur'),
  phone: Yup.string().required('Telefon zorunludur'),
  birthDate: Yup.date().nullable(),
  notes: Yup.string(),
});

const CustomerForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { selectedCustomer, getCustomerById, addCustomer, editCustomer, isLoading, error } = useCustomer();

  useEffect(() => {
    if (id) {
      getCustomerById(Number(id));
    }
  }, [id, getCustomerById]);

  const formik = useFormik({
    initialValues: {
      name: selectedCustomer?.name || '',
      email: selectedCustomer?.email || '',
      phone: selectedCustomer?.phone || '',
      birthDate: selectedCustomer?.birthDate || '',
      notes: selectedCustomer?.notes || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (id) {
          await editCustomer(Number(id), values);
        } else {
          await addCustomer(values as Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'loyaltyPoints'>);
        }
        navigate('/customers');
      } catch (error) {
        console.error('Form submission error:', error);
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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {id ? 'Müşteri Düzenle' : 'Yeni Müşteri'}
        </h2>

        {error && (
          <div className="bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Hata</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Ad Soyad
            </label>
            <input
              type="text"
              id="name"
              {...formik.getFieldProps('name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              E-posta
            </label>
            <input
              type="email"
              id="email"
              {...formik.getFieldProps('email')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Telefon
            </label>
            <input
              type="tel"
              id="phone"
              {...formik.getFieldProps('phone')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.phone}</p>
            )}
          </div>

          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
              Doğum Tarihi
            </label>
            <input
              type="date"
              id="birthDate"
              {...formik.getFieldProps('birthDate')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
            {formik.touched.birthDate && formik.errors.birthDate && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.birthDate}</p>
            )}
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notlar
            </label>
            <textarea
              id="notes"
              rows={4}
              {...formik.getFieldProps('notes')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
            {formik.touched.notes && formik.errors.notes && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.notes}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/customers')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={!formik.isValid || formik.isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300"
            >
              {id ? 'Güncelle' : 'Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm; 