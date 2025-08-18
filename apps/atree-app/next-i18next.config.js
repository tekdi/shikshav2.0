const path = require('path');

/**
 * @type {import('next-i18next').UserConfig}
 */
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'hi'],
    localeDetection: false,
  },
  fallbackLng: {
    default: ['en'],
    hi: ['en'],
  },
  defaultNS: 'common',
  localePath: path.resolve('./public/locales'),
  ns: ['common'],
  debug: process.env.NODE_ENV === 'development',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
  load: 'languageOnly',
  preload: ['en', 'hi'],
  returnEmptyString: false,
  returnNull: false,
  returnObjects: false,
  saveMissing: true,
  saveMissingTo: 'all',
  detection: {
    order: ['localStorage', 'navigator'],
    caches: ['localStorage'],
    lookupLocalStorage: 'selectedLanguage',
  },
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json',
  },
  serializeConfig: false,
  use: [],
};
