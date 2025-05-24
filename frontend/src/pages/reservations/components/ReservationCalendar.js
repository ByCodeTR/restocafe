import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedDate } from '../../../store/slices/reservationSlice';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import { FiClock, FiUser, FiUsers } from 'react-icons/fi';

const TimeSlot = ({ time, reservations }) => {
  const slotsForTime = reservations.filter(res => 
    format(new Date(res.time), 'HH:mm') === time
  );

  return (
    <div className="min-h-[100px] border-t p-2">
      <div className="text-sm font-medium text-gray-500 mb-2">
        {time}
      </div>
      <div className="space-y-2">
        {slotsForTime.map(reservation => (
          <div
            key={reservation._id}
            className={`
              p-2 rounded-lg text-sm
              ${reservation.status === 'confirmed' ? 'bg-green-100' :
                reservation.status === 'pending' ? 'bg-yellow-100' :
                'bg-gray-100'}
            `}
          >
            <div className="font-medium">{reservation.customerName}</div>
            <div className="flex items-center text-gray-500 space-x-2">
              <div className="flex items-center">
                <FiUsers className="w-4 h-4 mr-1" />
                {reservation.partySize} kişi
              </div>
              <div className="flex items-center">
                <FiClock className="w-4 h-4 mr-1" />
                {format(new Date(reservation.time), 'HH:mm')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ReservationCalendar = () => {
  const dispatch = useDispatch();
  const { selectedDate, reservations } = useSelector(state => state.reservations);
  
  // Haftanın günlerini oluştur
  const startDate = startOfWeek(selectedDate, { locale: tr });
  const weekDays = [...Array(7)].map((_, i) => addDays(startDate, i));

  // Saat dilimleri
  const timeSlots = [
    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
    '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
  ];

  return (
    <div>
      {/* Hafta Seçimi */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDays.map(day => (
          <button
            key={day.toString()}
            onClick={() => dispatch(setSelectedDate(day))}
            className={`
              p-4 rounded-lg text-center
              ${isSameDay(day, selectedDate)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-50 hover:bg-gray-100'}
            `}
          >
            <div className="text-sm font-medium">
              {format(day, 'EEEE', { locale: tr })}
            </div>
            <div className="text-lg font-bold">
              {format(day, 'd', { locale: tr })}
            </div>
          </button>
        ))}
      </div>

      {/* Rezervasyon Takvimi */}
      <div className="overflow-auto max-h-[calc(100vh-300px)]">
        {timeSlots.map(time => (
          <TimeSlot
            key={time}
            time={time}
            reservations={reservations.filter(res =>
              isSameDay(new Date(res.time), selectedDate)
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default ReservationCalendar; 