'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  TableIcon,
  PackageIcon,
  ClipboardIcon,
  CalendarIcon,
  UsersIcon,
  ChartIcon,
  SettingsIcon,
} from '@radix-ui/react-icons';

const menuItems = [
  { name: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
  { name: 'Masalar', icon: TableIcon, path: '/dashboard/tables' },
  { name: 'Ürünler', icon: PackageIcon, path: '/dashboard/products' },
  { name: 'Siparişler', icon: ClipboardIcon, path: '/dashboard/orders' },
  { name: 'Rezervasyonlar', icon: CalendarIcon, path: '/dashboard/reservations' },
  { name: 'Müşteriler', icon: UsersIcon, path: '/dashboard/customers' },
  { name: 'Raporlar', icon: ChartIcon, path: '/dashboard/reports' },
  { name: 'Ayarlar', icon: SettingsIcon, path: '/dashboard/settings' },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside className={`bg-white border-r border-gray-200 h-screen transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-64'
    } fixed left-0 top-0 z-30`}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {!isCollapsed && (
            <span className="text-xl font-semibold text-gray-800">RestoCafe</span>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isCollapsed ? "M13 19l9-7-9-7v14zm-2 0L2 12l9-7v14z" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"}
              />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">AA</span>
            </div>
            {!isCollapsed && (
              <div>
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">admin@restocafe.com</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
} 