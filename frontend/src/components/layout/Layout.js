import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  HomeIcon,
  TableCellsIcon,
  ClipboardDocumentListIcon,
  FireIcon,
  CubeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { logout } from '../../store/slices/authSlice';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon, roles: ['admin', 'waiter', 'kitchen', 'cashier'] },
    { name: 'Masalar', href: '/tables', icon: TableCellsIcon, roles: ['admin', 'waiter', 'cashier'] },
    { name: 'Siparişler', href: '/orders', icon: ClipboardDocumentListIcon, roles: ['admin', 'waiter', 'cashier'] },
    { name: 'Mutfak', href: '/kitchen', icon: FireIcon, roles: ['admin', 'kitchen'] },
    { name: 'Ürünler', href: '/products', icon: CubeIcon, roles: ['admin'] },
    { name: 'Raporlar', href: '/reports', icon: ChartBarIcon, roles: ['admin'] },
    { name: 'Ayarlar', href: '/settings', icon: Cog6ToothIcon, roles: ['admin'] },
  ];

  const filteredNavigation = navigation.filter(item => item.roles.includes(user?.role));

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 bg-blue-600">
            <h1 className="text-xl font-bold text-white">RestoCafe</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-blue-600 group"
              >
                <item.icon className="w-6 h-6 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-margin duration-300 ease-in-out`}>
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed bottom-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isSidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          )}
        </svg>
      </button>
    </div>
  );
};

export default Layout; 