"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";
import { Logo } from "@/components/pages/logo/Logo";
import { Icon } from "@iconify/react";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Logo className="w-10 h-10 scale-x-[-1]" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/yukihelmet.svg" alt="結城安全帽" className="h-10 w-auto" />
            </Link>
            <p className="text-sm text-gray-400">{t("footer.brand")}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-white transition-colors">{t("common.home")}</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">{t("common.products")}</Link></li>
              <li><Link href="/cart" className="hover:text-white transition-colors">{t("common.cart")}</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">{t("common.login")}</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-4">{t("footer.customerService")}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">{t("footer.aboutUs")}</Link></li>
              <li><Link href="/company-info" className="hover:text-white transition-colors">{t("footer.companyInfo")}</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">{t("footer.privacyPolicy")}</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">{t("footer.termsOfService")}</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4">{t("footer.followUs")}</h3>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/yuki.helmet/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Icon icon="mdi:instagram" className="w-6 h-6" />
              </a>
              <a href="https://www.threads.com/@yuki.helmet" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Icon icon="ri:threads-line" className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} 結城安全帽. All rights reserved.</p>
          <p className="mt-1 text-xs text-gray-600">{process.env.NEXT_PUBLIC_APP_VERSION}</p>
        </div>
      </div>
    </footer>
  );
}