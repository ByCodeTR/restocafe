import React, { useEffect } from 'react';
import { useReport } from '../hooks/useReport';
import ReportFilters from './ReportFilters';
import { formatCurrency } from '../../../utils/formatters';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DailySalesReport: React.FC = () => {
  const {
    dailySales,
    filters,
    isLoading,
    error,
    getDailySalesReport,
    exportDailySales,
    updateFilters,
  } = useReport();

  useEffect(() => {
    getDailySalesReport(filters);
  }, [filters, getDailySalesReport]);

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Günlük Satış Raporu</h2>
        <button
          onClick={() => exportDailySales(filters)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Excel'e Aktar
        </button>
      </div>

      <ReportFilters
        filters={filters}
        onFiltersChange={updateFilters}
        showPaymentMethodFilter
      />

      {dailySales && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Özet Kartları */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Toplam Satış</h3>
            <p className="mt-2 text-3xl font-bold text-primary-600">
              {formatCurrency(dailySales.totalSales)}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Toplam Sipariş</h3>
            <p className="mt-2 text-3xl font-bold text-primary-600">
              {dailySales.totalOrders}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Ortalama Sipariş Tutarı</h3>
            <p className="mt-2 text-3xl font-bold text-primary-600">
              {formatCurrency(dailySales.averageOrderValue)}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Ödeme Yöntemi Dağılımı</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dailySales.paymentMethods}
                    dataKey="amount"
                    nameKey="method"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    label={({ method }) =>
                      method === 'cash'
                        ? 'Nakit'
                        : method === 'credit_card'
                        ? 'Kredi Kartı'
                        : 'Banka Kartı'
                    }
                  >
                    {dailySales.paymentMethods.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(value as number)}
                    labelFormatter={(label) =>
                      label === 'cash'
                        ? 'Nakit'
                        : label === 'credit_card'
                        ? 'Kredi Kartı'
                        : 'Banka Kartı'
                    }
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Saatlik Dağılım Grafiği */}
          <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Saatlik Satış Dağılımı</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailySales.hourlyDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    formatter={(value, name) =>
                      name === 'sales'
                        ? formatCurrency(value as number)
                        : `${value} sipariş`
                    }
                  />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="sales"
                    name="Satış"
                    fill="#0088FE"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="orders"
                    name="Sipariş"
                    fill="#00C49F"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailySalesReport; 