import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Menu } from '@headlessui/react';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import LanguageSwitcher from '../common/LanguageSwitcher';

const DashboardHeader = () => {
  const user = useSelector(state => state.auth.user);
  const { t } = useTranslation();

  return (
    <header className="bg-white shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              {t('app.name')} {t('app.tagline')}
            </h1>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Notifications */}
            <button
              type="button"
              className="p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <span className="sr-only">{t('common.notifications')}</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <Menu.Button className="flex items-center max-w-xs text-sm rounded-full focus:outline-none">
                <span className="sr-only">{t('common.openUserMenu')}</span>
                <UserCircleIcon className="h-8 w-8 text-gray-400" aria-hidden="true" />
              </Menu.Button>

              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <div className="px-4 py-2">
                      <div className="text-sm font-medium text-gray-900">
                        {user?.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user?.email}
                      </div>
                    </div>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } block px-4 py-2 text-sm text-gray-700`}
                    >
                      {t('common.settings')}
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } block px-4 py-2 text-sm text-gray-700`}
                    >
                      {t('common.logout')}
                    </a>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader; 