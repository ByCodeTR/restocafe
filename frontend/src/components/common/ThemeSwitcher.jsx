import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Menu } from '@headlessui/react';
import { SwatchIcon } from '@heroicons/react/24/outline';
import { setTheme } from '../../store/slices/themeSlice';

const ThemeSwitcher = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { currentTheme, availableThemes } = useSelector((state) => state.theme);

  const handleThemeChange = (themeId) => {
    dispatch(setTheme(themeId));
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-gray-500">
        <SwatchIcon className="h-5 w-5" aria-hidden="true" />
        <span className="ml-2">{currentTheme.name}</span>
      </Menu.Button>

      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        {Object.entries(availableThemes).map(([themeId, theme]) => (
          <Menu.Item key={themeId}>
            {({ active }) => (
              <button
                onClick={() => handleThemeChange(themeId)}
                className={`${
                  active ? 'bg-gray-100' : ''
                } ${
                  currentTheme.id === themeId ? 'bg-gray-50' : ''
                } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
              >
                <span
                  className="mr-2 h-4 w-4 rounded-full"
                  style={{ backgroundColor: theme.colors.primary }}
                />
                {theme.name}
              </button>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
};

export default ThemeSwitcher; 