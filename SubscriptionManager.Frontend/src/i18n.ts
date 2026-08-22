import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "header": {
        "title": "SaaS Subscription Manager"
      }
    }
  },
  hi: {
    translation: {
      "header": {
        "title": "सास सब्सक्रिप्शन मैनेजर"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
