import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTable } from '../hooks/useTable';
import { statusText, statusColors } from '../constants';

const TableDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedTable,
    isLoading,
    error,
    fetchTableById,
    updateTableStatus,
    assignWaiter,
    removeWaiter,
    deleteTable,
  } = useTable();

  useEffect(() => {
    if (id) {
      fetchTableById(Number(id));
    }
  }, [id, fetchTableById]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Hata</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedTable) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Masa bulunamadı</h3>
      </div>
    );
  }

  const handleStatusChange = async (status: string) => {
    try {
      await updateTableStatus(selectedTable.id, { status: status as any });
    } catch (error) {
      console.error('Status update failed:', error);
    }
  };

  const handleWaiterAssignment = async (waiterId: number) => {
    try {
      await assignWaiter(selectedTable.id, { waiterId });
    } catch (error) {
      console.error('Waiter assignment failed:', error);
    }
  };

  const handleWaiterRemoval = async () => {
    try {
      await removeWaiter(selectedTable.id);
    } catch (error) {
      console.error('Waiter removal failed:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Bu masayı silmek istediğinizden emin misiniz?')) {
      try {
        await deleteTable(selectedTable.id);
        navigate('/tables');
      } catch (error) {
        console.error('Table deletion failed:', error);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Masa Detayları
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Masa bilgileri ve yönetimi
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Masa Numarası</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedTable.number}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Masa Adı</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedTable.name}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Bölüm</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedTable.section}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Kat</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedTable.floor}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Kapasite</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedTable.capacity}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Durum</dt>
              <dd className="mt-1 text-sm">
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${statusColors[selectedTable.status]}`}>
                  {statusText[selectedTable.status]}
                </span>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">QR Kod</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {selectedTable.qrCode ? (
                  <img
                    src={selectedTable.qrCode}
                    alt="QR Code"
                    className="h-32 w-32"
                  />
                ) : (
                  <span className="text-gray-500">QR kod henüz oluşturulmadı</span>
                )}
              </dd>
            </div>
          </dl>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="flex justify-between items-center">
            <div className="space-x-3">
              <button
                onClick={() => handleStatusChange('available')}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Müsait
              </button>
              <button
                onClick={() => handleStatusChange('occupied')}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Dolu
              </button>
              <button
                onClick={() => handleStatusChange('reserved')}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Rezerve
              </button>
              <button
                onClick={() => handleStatusChange('maintenance')}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Bakım
              </button>
            </div>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Masayı Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableDetail; 