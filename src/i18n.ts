import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { detectInitialLanguage } from './utils/helpers';
import { SUPPORTED_LANGUAGES } from './utils/constants';
import { Language } from './types';
import kkTranslations from './locales/kk.json';
import ruTranslations from './locales/ru.json';
import enTranslations from './locales/en.json';

// Detect language from URL path first (e.g., /kk/..., /ru/..., /en/...) then fallback to detector
function getInitialLanguageFromUrlOrStorage(): Language {
  if (typeof window !== 'undefined') {
    const segments = window.location.pathname.split('/').filter(Boolean);
    if (segments.length > 0 && SUPPORTED_LANGUAGES.includes(segments[0] as Language)) {
      return segments[0] as Language;
    }
  }
  return detectInitialLanguage();
}

const initialLang = getInitialLanguageFromUrlOrStorage();

i18n
  .use(initReactI18next)
  .init({
    resources: {
      kk: { translation: kkTranslations },
      ru: { translation: ruTranslations },
      en: { translation: enTranslations },
    },
    lng: initialLang,
    fallbackLng: ['kk', 'ru', 'en'],
    debug: process.env.NODE_ENV === 'development',
    saveMissing: false,
    returnNull: false,
    returnEmptyString: false,
    missingKeyHandler: (lngs, _ns, key, fallbackValue) => {
      if (typeof console !== 'undefined' && console.warn) {
        console.warn(
          `⚠️ [ChemLab i18n Missing Key] Key "${key}" not found in language(s): [${
            Array.isArray(lngs) ? lngs.join(', ') : lngs
          }]. Fallback: "${fallbackValue || key}"`
        );
      }
    },
    parseMissingKeyHandler: (key) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`⚠️ [ChemLab i18n Missing Key]: "${key}"`);
      }
      return key;
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

// Update html lang attribute whenever language changes
i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
  }
});

// Set initial html lang attribute
if (typeof document !== 'undefined') {
  document.documentElement.lang = initialLang;
}

export default i18n;
