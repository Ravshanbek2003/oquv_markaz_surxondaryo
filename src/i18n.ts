import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

const initializeI18n = () => {
  const supportedLanguages = ["en", "ru", "uz"];
  const savedLanguage = localStorage.getItem("language");
  let language = savedLanguage;

  if (!language) {
    const detectedLanguage = navigator.language.split("-")[0];

    if (supportedLanguages.includes(detectedLanguage)) {
      language = detectedLanguage;
    } else {
      language = "en";
    }
  }

  i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
      lng: language,
      fallbackLng: "en",
      debug: false,
      interpolation: {
        escapeValue: false,
      },
    });
};

initializeI18n();

export default i18n;
