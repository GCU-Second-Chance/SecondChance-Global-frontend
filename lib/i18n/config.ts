/**
 * i18n Configuration
 * Internationalization setup using i18next and react-i18next
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import ja from "./locales/ja.json";
import ko from "./locales/ko.json";
import zh from "./locales/zh.json";

// Language resources
const resources = {
  en: { translation: en },
  ko: { translation: ko },
  ja: { translation: ja },
  zh: { translation: zh },
} as const;

// Supported languages
export const languages = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "zh", name: "Chinese", nativeName: "简体中文" },
] as const;

export type LanguageCode = keyof typeof resources;

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

i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    lng: getSavedLanguage(),
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    // Save language preference to localStorage
    saveMissing: false,
    debug: process.env.NODE_ENV === "development",
  });

// Save language changes to localStorage
i18n.on("languageChanged", (lng) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("i18nextLng", lng);
    document.documentElement.lang = lng;
  }
});

export default i18n;
