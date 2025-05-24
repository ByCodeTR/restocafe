import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  ChartBarIcon,
  UsersIcon,
  CalendarIcon,
  TableCellsIcon,
  DocumentChartBarIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Overview', to: '/dashboard', icon: HomeIcon },
  { name: 'Analytics', to: '/dashboard/analytics', icon: ChartBarIcon },
  { name: 'Reports', to: '/dashboard/reports', icon: DocumentChartBarIcon },
  { name: 'Customers', to: '/dashboard/customers', icon: UsersIcon },
  { name: 'Reservations', to: '/dashboard/reservations', icon: CalendarIcon },
  { name: 'Tables', to: '/dashboard/tables', icon: TableCellsIcon },
  { name: 'Orders', to: '/dashboard/orders', icon: ClipboardDocumentListIcon },
  { name: 'Finance', to: '/dashboard/finance', icon: CurrencyDollarIcon }
];

const DashboardSidebar = () => {
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        {/* Sidebar component */}
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r border-gray-200">
          <div className="flex items-center flex-shrink-0 px-4">
            <img
              className="w-auto h-8"
              src="/logo.png"
              alt="RestoCafe"
            />
          </div>
          <div className="flex flex-col flex-grow mt-5">
            <nav className="flex-1 px-2 space-y-1 bg-white">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <item.icon
                    className={({ isActive }) =>
                      `mr-3 flex-shrink-0 h-6 w-6 ${
                        isActive
                          ? 'text-gray-500'
                          : 'text-gray-400 group-hover:text-gray-500'
                      }`
                    }
                    aria-hidden="true"
                  />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar; 