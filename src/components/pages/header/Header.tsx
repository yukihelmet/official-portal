"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n";
import { NavBtn } from "./navbtn";
import { Logo } from "@/components/pages/logo/Logo";
import { Icon } from "@iconify/react";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const { t } = useI18n();
  const { isAuthenticated, profile, clearAccessToken } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
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
            <div className="flex flex-col items-start">
              <span className="text-lg font-semibold text-primary">Yuki</span>
              <span className="text-xs font-normal leading-tight text-gray-700">Helmet</span>
            </div>
          </Link>

          <div className="flex-1 max-w-xl mx-8" />

          {/* Icons */}
          <div className="flex items-center gap-6">
            <NavBtn icon="mdi:cart" label={t.common.cart} href="/cart" badge={0} />
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
                    Account
                  </span>
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg py-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Icon icon="mdi:logout" className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavBtn icon="mdi:account" label={t.common.login} href="/login" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}