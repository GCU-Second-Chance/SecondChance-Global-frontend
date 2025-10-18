"use client";

/**
 * I18n Provider Component
 * Initializes i18next for the application
 */

import { type ReactNode, useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "./config";

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Ensure i18n is initialized on client side
    if (!i18n.isInitialized) {
      i18n.init().then(() => setIsInitialized(true));
    } else {
      setIsInitialized(true);
    }
  }, []);

  if (!isInitialized) {
    return null; // or a loading spinner
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
