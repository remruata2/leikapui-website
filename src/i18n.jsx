import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// lang file
import en from "./lang/en.json";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: en,
  },
};

i18n.use(initReactI18next).init({
  react: {
    useSuspense: false,
  },
  resources,
  lng: "en",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
