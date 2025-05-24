import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTableOrder } from '../../../../store/slices/waiterSlice';
import OrderHeader from './OrderHeader';
import ActiveOrder from './ActiveOrder';
import NewOrder from './NewOrder';
import Cart from './Cart';

const OrderPanel = ({ table }) => {
  const dispatch = useDispatch();
  const { activeOrder, loading, error } = useSelector(state => state.waiter);

  useEffect(() => {
    if (table) {
      dispatch(fetchTableOrder(table._id));
    }
  }, [dispatch, table]);

  if (loading.order) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error.order) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">{error.order}</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <OrderHeader table={table} />
      
      {activeOrder ? (
        <ActiveOrder order={activeOrder} />
      ) : (
        <>
          <NewOrder table={table} />
          <Cart />
        </>
      )}
    </div>
  );
};

export default OrderPanel; 