import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWaiterTables } from '../../store/slices/waiterSlice';
import WaiterHeader from './components/WaiterHeader';
import TableGrid from './components/TableGrid';
import OrderPanel from './components/OrderPanel';
import socketService from '../../services/socketService';

const Waiter = () => {
  const dispatch = useDispatch();
  const { loading, error, tables, selectedTable } = useSelector(state => state.waiter);

  useEffect(() => {
    // Garsonun masalarını getir
    dispatch(fetchWaiterTables());

    // Her 30 saniyede bir masaları güncelle
    const interval = setInterval(() => {
      dispatch(fetchWaiterTables());
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [dispatch]);

  // Seçili masa değiştiğinde socket.io odasına katıl
  useEffect(() => {
    if (selectedTable) {
      socketService.joinTable(selectedTable._id);
    }
  }, [selectedTable]);

  if (loading.tables) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error.tables) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-xl">{error.tables}</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sol Panel - Masa Grid */}
      <div className="flex-1 p-4 overflow-auto">
        <WaiterHeader />
        <TableGrid tables={tables} />
      </div>

      {/* Sağ Panel - Sipariş Paneli */}
      {selectedTable && (
        <div className="w-96 bg-white border-l shadow-lg overflow-auto">
          <OrderPanel table={selectedTable} />
        </div>
      )}
    </div>
  );
};

export default Waiter; 