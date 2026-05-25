"use client";

import { createContext, useContext, useEffect, useState } from "react";
import ja from "../messages/ja.json";
import zhTW from "../messages/zh-TW.json";

const allMessages = { ja, "zh-TW": zhTW } as const;
type Locale = keyof typeof allMessages;
type Messages = (typeof allMessages)[Locale];

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Messages;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("zh-TW");
  const [messages, setMessages] = useState<Messages>(zhTW);

  const setLocale = (_newLocale: Locale) => {
    // Language is fixed to zh-TW
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: messages }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}