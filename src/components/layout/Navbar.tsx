'use client';

import { useState } from 'react';
import {
  BellIcon,
  MagnifyingGlassIcon,
  ExitIcon,
} from '@radix-ui/react-icons';

export default function Navbar() {
  const [notifications] = useState([
    { id: 1, text: 'Yeni sipariş: Masa 5', time: '2 dk önce' },
    { id: 2, text: 'Stok uyarısı: Kola', time: '5 dk önce' },
    { id: 3, text: 'Yeni rezervasyon', time: '10 dk önce' },
  ]);

  return (
    <nav className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-20">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Ara..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <BellIcon className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* Notifications Dropdown */}
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 hidden">
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Bildirimler</h3>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-gray-800">{notification.text}</p>
                        <p className="text-xs text-gray-500">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <ExitIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </nav>
  );
} 