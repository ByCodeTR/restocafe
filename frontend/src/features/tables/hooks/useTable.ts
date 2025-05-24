import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import {
  fetchTables,
  fetchTableById,
  createTable,
  updateTable,
  deleteTable,
  updateTableStatus,
  assignWaiter,
  removeWaiter,
  setFilters,
  clearSelectedTable,
} from '../store/tableSlice';
import { TableFilters, CreateTableData, UpdateTableStatusData, AssignWaiterData } from '../types';

export const useTable = () => {
  const dispatch = useDispatch();
  const { tables, selectedTable, filters, isLoading, error } = useSelector(
    (state: RootState) => state.tables
  );

  const handleFetchTables = async (filters?: TableFilters) => {
    return await dispatch(fetchTables(filters)).unwrap();
  };

  const handleFetchTableById = async (id: number) => {
    return await dispatch(fetchTableById(id)).unwrap();
  };

  const handleCreateTable = async (data: CreateTableData) => {
    return await dispatch(createTable(data)).unwrap();
  };

  const handleUpdateTable = async (id: number, data: Partial<CreateTableData>) => {
    return await dispatch(updateTable({ id, data })).unwrap();
  };

  const handleDeleteTable = async (id: number) => {
    return await dispatch(deleteTable(id)).unwrap();
  };

  const handleUpdateTableStatus = async (id: number, data: UpdateTableStatusData) => {
    return await dispatch(updateTableStatus({ id, data })).unwrap();
  };

  const handleAssignWaiter = async (id: number, data: AssignWaiterData) => {
    return await dispatch(assignWaiter({ id, data })).unwrap();
  };

  const handleRemoveWaiter = async (id: number) => {
    return await dispatch(removeWaiter(id)).unwrap();
  };

  const handleSetFilters = (filters: TableFilters) => {
    dispatch(setFilters(filters));
  };

  const handleClearSelectedTable = () => {
    dispatch(clearSelectedTable());
  };

  return {
    tables,
    selectedTable,
    filters,
    isLoading,
    error,
    fetchTables: handleFetchTables,
    fetchTableById: handleFetchTableById,
    createTable: handleCreateTable,
    updateTable: handleUpdateTable,
    deleteTable: handleDeleteTable,
    updateTableStatus: handleUpdateTableStatus,
    assignWaiter: handleAssignWaiter,
    removeWaiter: handleRemoveWaiter,
    setFilters: handleSetFilters,
    clearSelectedTable: handleClearSelectedTable,
  };
}; 