import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchReports,
  generateQuickReport,
  deleteReport,
  refreshReport,
  setFilters
} from '../../store/slices/reportSlice';
import {
  ChartBarIcon,
  ArrowPathIcon,
  TrashIcon,
  PlusIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const Reports = () => {
  const dispatch = useDispatch();
  const { reports, loading, error, filters } = useSelector((state) => state.reports);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchReports(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleQuickReport = async (type) => {
    await dispatch(generateQuickReport({
      type,
      timeRange: filters.timeRange
    }));
  };

  const handleRefresh = async (reportId) => {
    await dispatch(refreshReport(reportId));
  };

  const handleDelete = async (reportId) => {
    if (window.confirm('Bu raporu silmek istediğinizden emin misiniz?')) {
      await dispatch(deleteReport(reportId));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filters
          </button>
          <button
            onClick={() => handleQuickReport('sales')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Quick Report
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white shadow sm:rounded-lg p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                value={filters.type || ''}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">All</option>
                <option value="sales">Sales</option>
                <option value="products">Products</option>
                <option value="categories">Categories</option>
                <option value="waiters">Waiters</option>
                <option value="customers">Customers</option>
                <option value="reservations">Reservations</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Time Range
              </label>
              <select
                value={filters.timeRange}
                onChange={(e) => handleFilterChange('timeRange', e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="error">Error</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Reports List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {reports.map((report) => (
            <li key={report._id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ChartBarIcon className="h-6 w-6 text-gray-400" />
                    <p className="ml-2 text-sm font-medium text-indigo-600 truncate">
                      {report.name}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleRefresh(report._id)}
                      className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <ArrowPathIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(report._id)}
                      className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Type: {report.type}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      Range: {report.config.timeRange}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p className="capitalize">
                      Status: {report.status}
                    </p>
                  </div>
                </div>
                {report.error && (
                  <div className="mt-2">
                    <p className="text-sm text-red-600">
                      Error: {report.error.message}
                    </p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Reports; 