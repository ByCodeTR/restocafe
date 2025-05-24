'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

type CallStatus = 'none' | 'pending' | 'accepted';

export default function CustomerPage() {
  const params = useParams();
  const [callStatus, setCallStatus] = useState<CallStatus>('none');
  const [note, setNote] = useState('');

  const tableId = params.tableId as string;

  const handleCallWaiter = () => {
    // Burada garson çağırma işlemi yapılacak
    setCallStatus('pending');
    setTimeout(() => {
      setCallStatus('accepted');
      setTimeout(() => {
        setCallStatus('none');
        setNote('');
      }, 5000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-lg mx-auto">
        {/* Üst Bilgi */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold">Masa {tableId}</h1>
          <p className="text-gray-500 mt-2">
            Garson çağırmak için aşağıdaki butonu kullanabilirsiniz
          </p>
        </div>

        {/* Garson Çağırma */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="space-y-4">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Garson için not ekleyin (opsiyonel)"
              className="w-full p-3 rounded-lg border border-gray-200 resize-none"
              rows={3}
              disabled={callStatus !== 'none'}
            />
            
            {callStatus === 'none' && (
              <button
                onClick={handleCallWaiter}
                className="w-full bg-pink-600 text-white py-4 rounded-lg font-medium hover:bg-pink-700 flex items-center justify-center space-x-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span>Garson Çağır</span>
              </button>
            )}

            {callStatus === 'pending' && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600 mx-auto mb-2" />
                <p className="text-gray-600">Garson çağrınız iletiliyor...</p>
              </div>
            )}

            {callStatus === 'accepted' && (
              <div className="text-center py-4 text-green-600">
                <svg className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Garsonunuz en kısa sürede masanıza gelecek</p>
              </div>
            )}
          </div>
        </div>

        {/* Menü Kartı */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Menü</h2>
          <div className="space-y-4">
            <button className="w-full bg-gray-100 text-gray-800 py-4 rounded-lg font-medium hover:bg-gray-200 flex items-center justify-center space-x-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Menüyü Görüntüle</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 