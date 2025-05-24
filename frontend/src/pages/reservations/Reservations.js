import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReservations, setSelectedDate } from '../../store/slices/reservationSlice';
import ReservationCalendar from './components/ReservationCalendar';
import ReservationList from './components/ReservationList';
import ReservationForm from './components/ReservationForm';
import { FiCalendar, FiList, FiPlus } from 'react-icons/fi';

const Reservations = () => {
  const dispatch = useDispatch();
  const [view, setView] = useState('calendar'); // 'calendar' | 'list'
  const [showForm, setShowForm] = useState(false);
  const { selectedDate, loading, error } = useSelector(state => state.reservations);

  useEffect(() => {
    // Seçili tarihe ait rezervasyonları getir
    dispatch(fetchReservations({
      date: selectedDate,
      status: 'active'
    }));
  }, [dispatch, selectedDate]);

  if (loading.list) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error.list) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-xl">{error.list}</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Rezervasyonlar
        </h1>

        <div className="flex items-center space-x-4">
          {/* Görünüm Değiştirme */}
          <div className="bg-white rounded-lg shadow p-1">
            <button
              onClick={() => setView('calendar')}
              className={`px-4 py-2 rounded-lg ${
                view === 'calendar'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FiCalendar className="inline-block mr-2" />
              Takvim
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-lg ${
                view === 'list'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FiList className="inline-block mr-2" />
              Liste
            </button>
          </div>

          {/* Yeni Rezervasyon */}
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
          >
            <FiPlus className="mr-2" />
            Yeni Rezervasyon
          </button>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="bg-white rounded-lg shadow p-6">
        {view === 'calendar' ? (
          <ReservationCalendar />
        ) : (
          <ReservationList />
        )}
      </div>

      {/* Rezervasyon Formu Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <ReservationForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservations; 