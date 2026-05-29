'use client';

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useI18n } from "@/i18n";
import { Icon } from "@iconify/react";

export default function PaymentSuccessPage() {
  const { clearCart } = useCart();
  const { t } = useI18n();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center flex flex-col items-center">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
        <Icon icon="lucide:check" className="w-10 h-10 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold mb-3">{t("payment.success.title")}</h1>
      <p className="text-gray-500 mb-2">{t("payment.success.desc")}</p>
      <p className="text-gray-400 text-sm mb-10">{t("payment.success.hint")}</p>
      <Link
        href="/products"
        className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
      >
        {t("payment.success.continueShopping")}
      </Link>
    </div>
  );
}
