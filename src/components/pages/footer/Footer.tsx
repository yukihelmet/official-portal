"use client";

import { useI18n } from "@/i18n";
import { Logo } from "@/components/pages/logo/Logo";
import { Icon } from "@iconify/react";

export function Footer() {
  const { t } = useI18n();
  const tf = t.footer as Record<string, string>;

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4">
              <Logo className="w-10 h-10 scale-x-[-1]" />
              <div className="flex flex-col items-start">
                <span className="text-lg font-semibold text-white">Yuki</span>
                <span className="text-xs font-normal leading-tight text-gray-400">Helmet</span>
              </div>
            </a>
            <p className="text-sm text-gray-400">{tf.brand}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">{tf.quickLinks}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/" className="hover:text-white transition-colors">{t.common.home}</a></li>
              <li><a href="/products" className="hover:text-white transition-colors">{t.common.products}</a></li>
              <li><a href="/cart" className="hover:text-white transition-colors">{t.common.cart}</a></li>
              <li><a href="/login" className="hover:text-white transition-colors">{t.common.login}</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-4">{tf.customerService}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/about" className="hover:text-white transition-colors">{tf.aboutUs}</a></li>
              <li><a href="/privacy" className="hover:text-white transition-colors">{tf.privacyPolicy}</a></li>
              <li><a href="/terms" className="hover:text-white transition-colors">{tf.termsOfService}</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4">{tf.followUs}</h3>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Icon icon="mdi:facebook" className="w-6 h-6" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Icon icon="mdi:instagram" className="w-6 h-6" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Icon icon="mdi:twitter" className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Yuki Helmet. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}