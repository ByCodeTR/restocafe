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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

const WaiterPerformanceReport: React.FC = () => {
  const {
    waiterPerformance,
    filters,
    isLoading,
    error,
    getWaiterPerformanceReport,
    exportWaiterPerformance,
    updateFilters,
  } = useReport();

  useEffect(() => {
    getWaiterPerformanceReport(filters);
  }, [filters, getWaiterPerformanceReport]);

  const prepareRadarData = (waiter: any) => [
    {
      subject: 'Sipariş Sayısı',
      value: waiter.totalOrders,
      fullMark: Math.max(...waiterPerformance.map((w) => w.totalOrders)),
    },
    {
      subject: 'Toplam Satış',
      value: waiter.totalSales,
      fullMark: Math.max(...waiterPerformance.map((w) => w.totalSales)),
    },
    {
      subject: 'Ortalama Sipariş',
      value: waiter.averageOrderValue,
      fullMark: Math.max(...waiterPerformance.map((w) => w.averageOrderValue)),
    },
    {
      subject: 'Servis Hızı',
      value: 100 - waiter.serviceSpeed, // Düşük süre daha iyi
      fullMark: 100,
    },
    {
      subject: 'Müşteri Puanı',
      value: waiter.customerRating * 20, // 5 üzerinden puanı 100'lük sisteme çevir
      fullMark: 100,
    },
    {
      subject: 'Masa Devir Hızı',
      value: waiter.tableTurnoverRate * 10, // Devir hızını 100'lük sisteme çevir
      fullMark: 100,
    },
  ];

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
        <h2 className="text-2xl font-bold text-gray-900">Garson Performans Raporu</h2>
        <button
          onClick={() => exportWaiterPerformance(filters)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Excel'e Aktar
        </button>
      </div>

      <ReportFilters
        filters={filters}
        onFiltersChange={updateFilters}
        showWaiterFilter
      />

      {waiterPerformance && waiterPerformance.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Satış Performansı Grafiği */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Satış Performansı</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waiterPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="waiterName" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    formatter={(value, name) =>
                      name === 'totalSales'
                        ? formatCurrency(value as number)
                        : value
                    }
                  />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="totalOrders"
                    name="Sipariş Sayısı"
                    fill="#0088FE"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="totalSales"
                    name="Toplam Satış"
                    fill="#00C49F"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detaylı Performans Radar Grafiği */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Detaylı Performans</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={prepareRadarData(waiterPerformance[0])}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar
                    name="Performans"
                    dataKey="value"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detaylı Tablo */}
          <div className="col-span-1 lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Garson
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Sipariş Sayısı
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Toplam Satış
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Ortalama Sipariş
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Servis Süresi
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Müşteri Puanı
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Masa Devir Hızı
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {waiterPerformance.map((waiter) => (
                    <tr key={waiter.waiterId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {waiter.waiterName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {waiter.totalOrders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(waiter.totalSales)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(waiter.averageOrderValue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {waiter.serviceSpeed} dk
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {waiter.customerRating.toFixed(1)}/5
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {waiter.tableTurnoverRate.toFixed(1)}/saat
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaiterPerformanceReport; 