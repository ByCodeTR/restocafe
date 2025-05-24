'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface WaiterCall {
  id: number;
  tableNumber: string;
  time: string;
  note?: string;
  status: 'pending' | 'accepted' | 'completed';
  acceptedBy?: string;
}

// Örnek veri
const SAMPLE_CALLS: WaiterCall[] = [
  {
    id: 1,
    tableNumber: 'S4',
    time: '19:45',
    note: 'Hesap alabilir miyiz?',
    status: 'pending',
  },
  {
    id: 2,
    tableNumber: 'B2',
    time: '19:42',
    status: 'accepted',
    acceptedBy: 'Ahmet',
  },
  {
    id: 3,
    tableNumber: 'T1',
    time: '19:30',
    status: 'completed',
    acceptedBy: 'Mehmet',
  },
];

export default function NotificationsPage() {
  const router = useRouter();
  const [calls, setCalls] = useState<WaiterCall[]>(SAMPLE_CALLS);

  const handleAcceptCall = (callId: number) => {
    setCalls(prev => prev.map(call =>
      call.id === callId
        ? { ...call, status: 'accepted', acceptedBy: 'Siz' }
        : call
    ));
  };

  const handleCompleteCall = (callId: number) => {
    setCalls(prev => prev.map(call =>
      call.id === callId
        ? { ...call, status: 'completed' }
        : call
    ));
  };

  const activeCalls = calls.filter(call => call.status !== 'completed');
  const completedCalls = calls.filter(call => call.status === 'completed');

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* Üst Bilgi */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Bildirimler</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-sm">Bekleyen</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm">Kabul Edildi</span>
          </div>
        </div>
      </div>

      {/* Aktif Çağrılar */}
      <div className="space-y-4 mb-8">
        <h2 className="font-medium text-gray-500">Aktif Çağrılar</h2>
        {activeCalls.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center text-gray-500">
            Aktif çağrı bulunmuyor
          </div>
        ) : (
          activeCalls.map((call) => (
            <div
              key={call.id}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium">Masa {call.tableNumber}</h3>
                  <p className="text-sm text-gray-500">{call.time}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium
                    ${call.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                    }`}
                >
                  {call.status === 'pending' ? 'Bekliyor' : 'Kabul Edildi'}
                </span>
              </div>

              {call.note && (
                <p className="text-sm text-gray-600 mb-4">
                  Not: {call.note}
                </p>
              )}

              <div className="flex space-x-2">
                {call.status === 'pending' ? (
                  <button
                    onClick={() => handleAcceptCall(call.id)}
                    className="flex-1 bg-pink-600 text-white py-2 rounded-lg font-medium hover:bg-pink-700"
                  >
                    Kabul Et
                  </button>
                ) : (
                  <button
                    onClick={() => handleCompleteCall(call.id)}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700"
                  >
                    Tamamla
                  </button>
                )}
                <button
                  onClick={() => router.push(`/tables/${call.tableNumber}`)}
                  className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200"
                >
                  Masaya Git
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tamamlanan Çağrılar */}
      {completedCalls.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-medium text-gray-500">Tamamlanan Çağrılar</h2>
          {completedCalls.map((call) => (
            <div
              key={call.id}
              className="bg-white rounded-xl p-4 shadow-sm opacity-60"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Masa {call.tableNumber}</h3>
                  <p className="text-sm text-gray-500">{call.time}</p>
                  {call.acceptedBy && (
                    <p className="text-sm text-gray-500">
                      İlgilenen: {call.acceptedBy}
                    </p>
                  )}
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Tamamlandı
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 