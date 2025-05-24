'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { title: 'Dashboard', path: '/admin', icon: '📊' },
  { title: 'Masalar', path: '/admin/tables', icon: '🪑' },
  { title: 'Menü', path: '/admin/menu', icon: '🍽️' },
  { title: 'Siparişler', path: '/admin/orders', icon: '📝' },
  { title: 'Personel', path: '/admin/staff', icon: '👥' },
  { title: 'Mutfak', path: '/admin/kitchen', icon: '👨‍🍳' },
  { title: 'Raporlar', path: '/admin/reports', icon: '📈' },
  { title: 'Ayarlar', path: '/admin/settings', icon: '⚙️' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white border-r border-gray-200 w-64`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-bold text-gray-800">RestoCafe</h1>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
            >
              ✕
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  pathname === item.path
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                A
              </div>
              <div>
                <p className="font-medium text-gray-800">Admin</p>
                <p className="text-sm text-gray-500">admin@restocafe.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`p-4 ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        {/* Top Bar */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            ☰
          </button>
        </div>

        {/* Page Content */}
        <main>{children}</main>
      </div>
    </div>
  );
} 