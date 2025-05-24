import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActiveOrders } from '../../store/slices/kitchenSlice';
import KitchenHeader from './components/KitchenHeader';
import KitchenFilters from './components/KitchenFilters';
import OrderList from './components/OrderList';
import socketService from '../../services/socketService';

const Kitchen = () => {
  const dispatch = useDispatch();
  const { loading, error, filteredOrders } = useSelector(state => state.kitchen);

  useEffect(() => {
    // Aktif siparişleri getir
    dispatch(fetchActiveOrders());

    // Socket.io mutfak odasına katıl
    socketService.joinKitchen();

    // 30 saniyede bir siparişleri güncelle
    const interval = setInterval(() => {
      dispatch(fetchActiveOrders());
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <KitchenHeader />
      <KitchenFilters />
      <OrderList orders={filteredOrders} />
    </div>
  );
};

export default Kitchen; 