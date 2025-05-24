import React from 'react';
import { useTranslation } from 'react-i18next';
import { Menu } from '@headlessui/react';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

const languages = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' }
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-gray-500">
        <GlobeAltIcon className="h-5 w-5" aria-hidden="true" />
        <span className="ml-2">{currentLanguage.flag}</span>
      </Menu.Button>

      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        {languages.map((language) => (
          <Menu.Item key={language.code}>
            {({ active }) => (
              <button
                onClick={() => changeLanguage(language.code)}
                className={`${
                  active ? 'bg-gray-100' : ''
                } ${
                  i18n.language === language.code ? 'bg-gray-50' : ''
                } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
              >
                <span className="mr-2">{language.flag}</span>
                {language.name}
              </button>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
};

export default LanguageSwitcher; 