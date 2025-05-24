import React, { useState } from 'react';
import DailySalesReport from '../components/DailySalesReport';
import ProductSalesReport from '../components/ProductSalesReport';
import WaiterPerformanceReport from '../components/WaiterPerformanceReport';
import TableOccupancyReport from '../components/TableOccupancyReport';

type ReportType = 'daily' | 'product' | 'waiter' | 'table';

const ReportsPage: React.FC = () => {
  const [activeReport, setActiveReport] = useState<ReportType>('daily');

  const renderReport = () => {
    switch (activeReport) {
      case 'daily':
        return <DailySalesReport />;
      case 'product':
        return <ProductSalesReport />;
      case 'waiter':
        return <WaiterPerformanceReport />;
      case 'table':
        return <TableOccupancyReport />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Rapor Seçimi */}
      <div className="mb-8">
        <div className="sm:hidden">
          <select
            value={activeReport}
            onChange={(e) => setActiveReport(e.target.value as ReportType)}
            className="block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="daily">Günlük Satış Raporu</option>
            <option value="product">Ürün Satış Raporu</option>
            <option value="waiter">Garson Performans Raporu</option>
            <option value="table">Masa Doluluk Raporu</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <nav className="flex space-x-4" aria-label="Tabs">
            <button
              onClick={() => setActiveReport('daily')}
              className={`px-3 py-2 font-medium text-sm rounded-md ${
                activeReport === 'daily'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Günlük Satış Raporu
            </button>
            <button
              onClick={() => setActiveReport('product')}
              className={`px-3 py-2 font-medium text-sm rounded-md ${
                activeReport === 'product'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Ürün Satış Raporu
            </button>
            <button
              onClick={() => setActiveReport('waiter')}
              className={`px-3 py-2 font-medium text-sm rounded-md ${
                activeReport === 'waiter'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Garson Performans Raporu
            </button>
            <button
              onClick={() => setActiveReport('table')}
              className={`px-3 py-2 font-medium text-sm rounded-md ${
                activeReport === 'table'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Masa Doluluk Raporu
            </button>
          </nav>
        </div>
      </div>

      {/* Aktif Rapor */}
      {renderReport()}
    </div>
  );
};

export default ReportsPage; 