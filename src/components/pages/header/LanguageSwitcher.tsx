"use client";

import { useState } from "react";
import { useI18n } from "@/i18n";
import { Icon } from "@iconify/react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const languages: { code: "ja" | "zh-TW"; label: string }[] = [
    { code: "ja", label: "日本語" },
    { code: "zh-TW", label: "中文" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col items-center text-gray-700 hover:text-gray-900"
      >
        <Icon icon="mdi:translate" className="w-6 h-6" />
        <span className="text-xs mt-1">{locale === "ja" ? "JA" : "ZHTW"}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-25">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLocale(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${
                  locale === lang.code
                    ? "font-semibold text-primary"
                    : "text-gray-600"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}