"use client";

/**
 * Language Switcher Component
 * Dropdown component for changing the application language
 */

import { useTranslation } from "react-i18next";
import { type LanguageCode, languages } from "./languages";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (langCode: LanguageCode) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <div className="relative inline-block text-left">
      <select
        value={i18n.language}
        onChange={(e) => handleLanguageChange(e.target.value as LanguageCode)}
        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Select language"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeName}
          </option>
        ))}
      </select>
    </div>
  );
}
