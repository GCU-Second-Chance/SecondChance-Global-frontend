/**
 * i18n Exports
 * Central export point for internationalization utilities
 */

// Export language constants (safe for server-side)
export { type LanguageCode, languages } from "./languages";

// Export client-side components
export { I18nProvider } from "./provider";
export { LanguageSwitcher } from "./LanguageSwitcher";
