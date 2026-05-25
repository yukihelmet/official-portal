"use client";

import { useI18n } from "@/i18n";
import { NavBtn } from "./navbtn";
import { Logo } from "@/components/pages/logo/Logo";

export function Header() {
  const { t } = useI18n();

  return (
    <header className="fixed top-0 left-0 right-0 w-full bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="shrink-0 flex items-center gap-2">
            <Logo className="w-10 h-10 scale-x-[-1]" />
            <div className="flex flex-col items-start">
              <span className="text-lg font-semibold text-primary">Yuki</span>
              <span className="text-xs font-normal leading-tight text-gray-700">Helmet</span>
            </div>
          </a>

          <div className="flex-1 max-w-xl mx-8" />

          {/* Icons */}
          <div className="flex items-center gap-6">
                        <NavBtn icon="mdi:account" label={t.common.login} href="/login" />
            <NavBtn icon="mdi:cart" label={t.common.cart} href="/cart" badge={0} />
            <NavBtn icon="mdi:menu" label={t.common.menu} />
          </div>
        </div>
      </div>
    </header>
  );
}