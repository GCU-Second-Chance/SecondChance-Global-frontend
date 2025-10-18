"use client";

/**
 * I18n Provider Component
 * Initializes i18next for the application
 */

import { type ReactNode, useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { initializeI18n } from "./config";

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [i18nInstance, setI18nInstance] = useState<ReturnType<typeof initializeI18n> | null>(null);

  useEffect(() => {
    // Initialize i18n only on client side
    const instance = initializeI18n();
    setI18nInstance(instance);
  }, []);

  if (!i18nInstance) {
    return null; // or a loading spinner
  }

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
}
