import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useOrder } from '../hooks/useOrder';
import { useTable } from '../../tables/hooks/useTable';
import { CreateOrderData } from '../types';

interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  category?: string;
}

const validationSchema = Yup.object({
  tableId: Yup.number().required('Masa seçimi zorunludur'),
  items: Yup.array()
    .of(
      Yup.object({
        productId: Yup.number().required('Ürün seçimi zorunludur'),
        quantity: Yup.number()
          .required('Adet zorunludur')
          .min(1, 'Adet en az 1 olmalıdır'),
        notes: Yup.string(),
      })
    )
    .min(1, 'En az bir ürün seçmelisiniz'),
  notes: Yup.string(),
});

const OrderForm: React.FC = () => {
  const navigate = useNavigate();
  const { createOrder } = useOrder();
  const { tables, fetchTables } = useTable();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchTables();
    // TODO: Fetch products from API
    setProducts([
      { id: 1, name: 'Ürün 1', price: 10.99, category: 'Kategori 1' },
      { id: 2, name: 'Ürün 2', price: 15.99, category: 'Kategori 1' },
      { id: 3, name: 'Ürün 3', price: 8.99, category: 'Kategori 2' },
    ]);
  }, [fetchTables]);

  const formik = useFormik<CreateOrderData>({
    initialValues: {
      tableId: 0,
      items: [
        {
          productId: 0,
          quantity: 1,
          notes: '',
        },
      ],
      notes: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await createOrder(values);
        navigate('/orders');
      } catch (error) {
        console.error('Order creation failed:', error);
      }
    },
  });

  const handleAddItem = () => {
    formik.setFieldValue('items', [
      ...formik.values.items,
      {
        productId: 0,
        quantity: 1,
        notes: '',
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    const items = [...formik.values.items];
    items.splice(index, 1);
    formik.setFieldValue('items', items);
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Yeni Sipariş
          </h3>
          <div className="mt-5">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="tableId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Masa
                </label>
                <div className="mt-1">
                  <select
                    id="tableId"
                    {...formik.getFieldProps('tableId')}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Masa Seçin</option>
                    {tables.map((table) => (
                      <option key={table.id} value={table.id}>
                        {table.name}
                      </option>
                    ))}
                  </select>
                  {formik.touched.tableId && formik.errors.tableId && (
                    <p className="mt-2 text-sm text-red-600">
                      {formik.errors.tableId}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ürünler
                </label>
                <div className="mt-1 space-y-4">
                  {formik.values.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="flex-1">
                        <select
                          {...formik.getFieldProps(`items.${index}.productId`)}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="">Ürün Seçin</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} - {product.price.toFixed(2)} ₺
                            </option>
                          ))}
                        </select>
                        {formik.touched.items?.[index]?.productId &&
                          formik.errors.items?.[index]?.productId && (
                            <p className="mt-2 text-sm text-red-600">
                              {formik.errors.items[index].productId}
                            </p>
                          )}
                      </div>
                      <div className="w-24">
                        <input
                          type="number"
                          min="1"
                          {...formik.getFieldProps(`items.${index}.quantity`)}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                        {formik.touched.items?.[index]?.quantity &&
                          formik.errors.items?.[index]?.quantity && (
                            <p className="mt-2 text-sm text-red-600">
                              {formik.errors.items[index].quantity}
                            </p>
                          )}
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Not"
                          {...formik.getFieldProps(`items.${index}.notes`)}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <svg
                      className="-ml-0.5 mr-2 h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Ürün Ekle
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700"
                >
                  Notlar
                </label>
                <div className="mt-1">
                  <textarea
                    id="notes"
                    rows={3}
                    {...formik.getFieldProps('notes')}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/orders')}
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

export default OrderForm; 