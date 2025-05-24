import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTable } from '../hooks/useTable';
import { CreateTableData } from '../types';

const validationSchema = Yup.object({
  number: Yup.string().required('Masa numarası zorunludur'),
  name: Yup.string().required('Masa adı zorunludur'),
  capacity: Yup.number()
    .required('Kapasite zorunludur')
    .min(1, 'Kapasite en az 1 olmalıdır'),
  section: Yup.string().required('Bölüm zorunludur'),
  floor: Yup.number().required('Kat zorunludur'),
});

const TableForm: React.FC = () => {
  const navigate = useNavigate();
  const { createTable } = useTable();

  const formik = useFormik<CreateTableData>({
    initialValues: {
      number: '',
      name: '',
      capacity: 1,
      section: '',
      floor: 0,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await createTable(values);
        navigate('/tables');
      } catch (error) {
        console.error('Table creation failed:', error);
      }
    },
  });

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Yeni Masa Ekle
          </h3>
          <div className="mt-5">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="number"
                  className="block text-sm font-medium text-gray-700"
                >
                  Masa Numarası
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="number"
                    {...formik.getFieldProps('number')}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  {formik.touched.number && formik.errors.number && (
                    <p className="mt-2 text-sm text-red-600">
                      {formik.errors.number}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Masa Adı
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="name"
                    {...formik.getFieldProps('name')}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="mt-2 text-sm text-red-600">
                      {formik.errors.name}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="capacity"
                  className="block text-sm font-medium text-gray-700"
                >
                  Kapasite
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    id="capacity"
                    min="1"
                    {...formik.getFieldProps('capacity')}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  {formik.touched.capacity && formik.errors.capacity && (
                    <p className="mt-2 text-sm text-red-600">
                      {formik.errors.capacity}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="section"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bölüm
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="section"
                    {...formik.getFieldProps('section')}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  {formik.touched.section && formik.errors.section && (
                    <p className="mt-2 text-sm text-red-600">
                      {formik.errors.section}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="floor"
                  className="block text-sm font-medium text-gray-700"
                >
                  Kat
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    id="floor"
                    {...formik.getFieldProps('floor')}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  {formik.touched.floor && formik.errors.floor && (
                    <p className="mt-2 text-sm text-red-600">
                      {formik.errors.floor}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/tables')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableForm; 