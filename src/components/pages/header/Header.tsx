"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n";
import { NavBtn } from "./navbtn";
import { Logo } from "@/components/pages/logo/Logo";
import { Icon } from "@iconify/react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

export function Header() {
  const { t } = useI18n();
  const { isAuthenticated, profile, clearAccessToken } = useAuth();
  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    clearAccessToken();
    setShowDropdown(false);
  }

  return (
    <header className="fixed top-0 left-0 right-0 w-full bg-white border-b border-primary z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-2">
            <Logo className="w-10 h-10 scale-x-[-1]" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/yukihelmet.svg" alt="結城安全帽" className="h-8 w-auto md:h-10" />
          </Link>

          <div className="flex-1 max-w-xl mx-8" />

          {/* Icons - desktop */}
          <div className="hidden md:flex items-center gap-6">
            <NavBtn icon="mdi:cart" label={t("common.cart")} href="/cart" badge={cartCount} />
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="group relative flex flex-col items-center text-primary hover:text-[#1A1A1A] bg-transparent"
                >
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground group-hover:bg-[#1A1A1A] group-hover:text-white flex items-center justify-center text-xs font-bold transition-colors">
                    {profile?.email?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <span className="absolute top-full mt-1 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">
                    {t("common.account")}
                  </span>
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg py-1">
                    <Link
                      href="/orders"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Icon icon="lucide:package" className="w-4 h-4" />
                      {t("header.orders")}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Icon icon="mdi:logout" className="w-4 h-4" />
                      {t("common.logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavBtn icon="mdi:account" label={t("common.login")} href="/login" />
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-primary hover:text-[#1A1A1A]"
          >
            <Icon
              icon={mobileMenuOpen ? "lucide:x" : "lucide:menu"}
              className="w-6 h-6"
            />
          </button>
        </div>

        {/* Mobile Accordion */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-2">
            <Link
              href="/cart"
              className="flex items-center gap-3 py-2 text-sm text-gray-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Icon icon="mdi:cart" className="w-5 h-5" />
              {t("common.cart")}
              {cartCount > 0 && (
                <span className="ml-auto bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  href="/orders"
                  className="flex items-center gap-3 py-2 text-sm text-gray-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon icon="lucide:package" className="w-5 h-5" />
                  {t("header.orders")}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 py-2 text-sm text-gray-600 w-full"
                >
                  <Icon icon="mdi:logout" className="w-5 h-5" />
                  {t("common.logout")}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-3 py-2 text-sm text-gray-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon icon="mdi:account" className="w-5 h-5" />
                {t("common.login")}
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}