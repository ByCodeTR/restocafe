import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFilters } from '../../../store/slices/kitchenSlice';
import { FiSearch, FiFilter, FiClock, FiGrid } from 'react-icons/fi';

const KitchenFilters = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector(state => state.kitchen);

  const handleFilterChange = (key, value) => {
    dispatch(updateFilters({ [key]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Arama */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Sipariş ara..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        {/* Durum Filtresi */}
        <div className="relative">
          <FiFilter className="absolute left-3 top-3 text-gray-400" />
          <select
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">Tüm Durumlar</option>
            <option value="pending">Bekleyen</option>
            <option value="preparing">Hazırlanıyor</option>
            <option value="ready">Hazır</option>
          </select>
        </div>

        {/* Sıralama Tipi */}
        <div className="relative">
          <FiClock className="absolute left-3 top-3 text-gray-400" />
          <select
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="time">Zamana Göre</option>
            <option value="table">Masa Numarasına Göre</option>
          </select>
        </div>

        {/* Sıralama Yönü */}
        <div className="relative">
          <FiGrid className="absolute left-3 top-3 text-gray-400" />
          <select
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            value={filters.sortOrder}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
          >
            <option value="asc">Artan</option>
            <option value="desc">Azalan</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default KitchenFilters; 