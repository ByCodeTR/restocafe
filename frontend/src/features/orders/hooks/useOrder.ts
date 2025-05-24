import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import {
  fetchOrders,
  fetchOrderById,
  createOrder,
  updateOrderItem,
  deleteOrderItem,
  addPayment,
  cancelOrder,
  setFilters,
  clearSelectedOrder,
} from '../store/orderSlice';
import {
  OrderFilters,
  CreateOrderData,
  UpdateOrderItemData,
  CreatePaymentData,
} from '../types';

export const useOrder = () => {
  const dispatch = useDispatch();
  const { orders, selectedOrder, filters, isLoading, error } = useSelector(
    (state: RootState) => state.orders
  );

  const handleFetchOrders = async (filters?: OrderFilters) => {
    return await dispatch(fetchOrders(filters)).unwrap();
  };

  const handleFetchOrderById = async (id: number) => {
    return await dispatch(fetchOrderById(id)).unwrap();
  };

  const handleCreateOrder = async (data: CreateOrderData) => {
    return await dispatch(createOrder(data)).unwrap();
  };

  const handleUpdateOrderItem = async (
    orderId: number,
    itemId: number,
    data: UpdateOrderItemData
  ) => {
    return await dispatch(updateOrderItem({ orderId, itemId, data })).unwrap();
  };

  const handleDeleteOrderItem = async (orderId: number, itemId: number) => {
    return await dispatch(deleteOrderItem({ orderId, itemId })).unwrap();
  };

  const handleAddPayment = async (orderId: number, data: CreatePaymentData) => {
    return await dispatch(addPayment({ orderId, data })).unwrap();
  };

  const handleCancelOrder = async (orderId: number) => {
    return await dispatch(cancelOrder(orderId)).unwrap();
  };

  const handleSetFilters = (filters: OrderFilters) => {
    dispatch(setFilters(filters));
  };

  const handleClearSelectedOrder = () => {
    dispatch(clearSelectedOrder());
  };

  return {
    orders,
    selectedOrder,
    filters,
    isLoading,
    error,
    fetchOrders: handleFetchOrders,
    fetchOrderById: handleFetchOrderById,
    createOrder: handleCreateOrder,
    updateOrderItem: handleUpdateOrderItem,
    deleteOrderItem: handleDeleteOrderItem,
    addPayment: handleAddPayment,
    cancelOrder: handleCancelOrder,
    setFilters: handleSetFilters,
    clearSelectedOrder: handleClearSelectedOrder,
  };
}; 