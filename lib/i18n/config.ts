/**
 * i18n Configuration (Client-side only)
 * This file should only be imported in client components
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources, type LanguageCode } from "./languages";

// Get browser language or fallback to English
const getBrowserLanguage = (): LanguageCode => {
  if (typeof window === "undefined") return "en";

  const browserLang = navigator.language.split("-")[0];
  if (!browserLang) return "en";
  return (browserLang in resources ? browserLang : "en") as LanguageCode;
};

// Get saved language from localStorage or browser
const getSavedLanguage = (): LanguageCode => {
  if (typeof window === "undefined") return "en";

  const saved = localStorage.getItem("i18nextLng");
  if (saved && saved in resources) {
    return saved as LanguageCode;
  }

  return getBrowserLanguage();
};

// Initialize i18n - this function should only be called on client side
export const initializeI18n = () => {
  if (i18n.isInitialized) {
    return i18n;
  }

  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: getSavedLanguage(),
      fallbackLng: "en",
      interpolation: {
        escapeValue: false,
      },
      saveMissing: false,
      debug: process.env.NODE_ENV === "development",
    });

  i18n.on("languageChanged", (lng) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("i18nextLng", lng);
      document.documentElement.lang = lng;
    }
  });

  return i18n;
};

export default i18n;
