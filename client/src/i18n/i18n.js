import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import ur from './ur.json';
import sd from './sd.json';

// Supported language definitions with directional configuration
export const LANGUAGES = [
  { code: 'en', name: 'English', dir: 'ltr', fontClass: 'font-sans' },
  { code: 'ur', name: 'اردو', dir: 'rtl', fontClass: 'font-urdu' },
  { code: 'sd', name: 'سنڌي', dir: 'rtl', fontClass: 'font-sindhi' }
];

/**
 * Updates DOM document attributes (dir, lang, and font classes)
 * whenever language changes between English (LTR) and Urdu/Sindhi (RTL).
 */
export function applyLanguageSettings(langCode) {
  const current = LANGUAGES.find(l => l.code === langCode) || LANGUAGES[0];
  document.documentElement.dir = current.dir;
  document.documentElement.lang = current.code;

  // Set appropriate font class on body
  document.body.classList.remove('font-sans', 'font-urdu', 'font-sindhi');
  document.body.classList.add(current.fontClass);
}

const savedLang = localStorage.getItem('sindh_stream_lang') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ur: { translation: ur },
      sd: { translation: sd }
    },
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes XSS
    }
  });

// Apply on initial load
applyLanguageSettings(savedLang);

// Listen to language changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('sindh_stream_lang', lng);
  applyLanguageSettings(lng);
});

export default i18n;
