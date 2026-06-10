"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Locale } from "./translations";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("vi");

  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale;
    if (savedLocale === "en" || savedLocale === "vi") {
      const timer = setTimeout(() => {
        setLocaleState(savedLocale);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  const t = (key: string, variables?: Record<string, string | number>): string => {
    const keys = key.split(".");
    let value: unknown = translations[locale];
    
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        value = undefined;
        break;
      }
    }

    if (value === undefined) {
      let fbValue: unknown = translations["en"];
      for (const k of keys) {
        if (fbValue && typeof fbValue === "object" && k in fbValue) {
          fbValue = (fbValue as Record<string, unknown>)[k];
        } else {
          fbValue = undefined;
          break;
        }
      }
      value = fbValue ?? key;
    }

    if (typeof value === "string" && variables) {
      return Object.entries(variables).reduce((str, [k, v]) => {
        return str.replace(`{${k}}`, String(v));
      }, value);
    }

    return String(value);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
