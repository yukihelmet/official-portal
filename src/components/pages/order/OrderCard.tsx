'use client';

import { useState } from "react";
import { Order } from "@/lib/official-portal-api";
import { Icon } from "@iconify/react";
import { useI18n } from "@/i18n";

interface OrderCardProps {
  order: Order;
  currencyKey: "jpy" | "twd";
}

const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
  pending: { label: "order.status.pending", color: "text-yellow-600", icon: "lucide:clock" },
  paid: { label: "order.status.paid", color: "text-blue-600", icon: "lucide:credit-card" },
  complete: { label: "order.status.complete", color: "text-green-600", icon: "lucide:check-circle" },
  cancelled: { label: "order.status.cancelled", color: "text-gray-500", icon: "lucide:x-circle" },
};

const shippingStatusConfig: Record<string, { label: string; color: string; icon: string }> = {
  pending: { label: "order.shippingStatus.pending", color: "text-yellow-600", icon: "lucide:clock" },
  not_shipped: { label: "order.shippingStatus.notShipped", color: "text-gray-500", icon: "lucide:package" },
  shipped: { label: "order.shippingStatus.shipped", color: "text-green-600", icon: "lucide:truck" },
};

export function OrderCard({ order, currencyKey }: OrderCardProps) {
  const { t, locale } = useI18n();
  const [copied, setCopied] = useState(false);
  const symbol = currencyKey === "jpy" ? "¥" : "$";

  const status = statusConfig[order.status] ?? { label: `order.status.${order.status}`, color: "text-gray-600", icon: "lucide:circle" };
  const shippingStatus = shippingStatusConfig[order.shipping_status] ?? { label: `order.shippingStatus.${order.shipping_status}`, color: "text-gray-600", icon: "lucide:package" };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === "ja" ? "ja-JP" : "zh-TW");
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col md:grid md:grid-cols-7 gap-2 p-4 border-b border-gray-200 last:border-b-0">
      {/* Order Number & Date */}
      <div className="md:col-span-1 flex justify-between md:block">
        <div className="flex items-center gap-1">
          <p className="font-mono font-semibold text-sm">{order.public_id.slice(0, 8)}</p>
          <button
            onClick={() => handleCopy(order.public_id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <Icon icon={copied ? "lucide:check" : "lucide:copy"} className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 md:hidden">{formatDate(order.created_at)}</p>
      </div>

      {/* Items Details */}
      <div className="md:col-span-2">
        <ul className="space-y-0.5 list-disc list-inside">
          {order.items.map((item, i) => (
            <li key={i} className="text-sm text-gray-600">
              {item.name} x{item.quantity}
              <span className="ml-1 text-xs text-gray-400">
                {symbol}{item.price.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Payment Status */}
      <div className="flex items-center gap-1.5">
        <span className="md:hidden text-xs text-gray-400 shrink-0">{t("order.paymentStatus")}</span>
        <span className="md:hidden flex items-center gap-1.5 ml-auto">
          <Icon icon={status.icon} className={`w-4 h-4 ${status.color}`} />
          <span className={`text-sm font-medium ${status.color}`}>{t(status.label)}</span>
        </span>
        <span className="hidden md:flex items-center gap-1.5">
          <Icon icon={status.icon} className={`w-4 h-4 ${status.color}`} />
          <span className={`text-sm font-medium ${status.color}`}>{t(status.label)}</span>
        </span>
      </div>

      {/* Shipping Status */}
      <div className="flex items-center gap-1.5">
        <span className="md:hidden text-xs text-gray-400 shrink-0">{t("order.shippingStatusHeader")}</span>
        <span className="md:hidden flex items-center gap-1.5 ml-auto">
          <Icon icon={shippingStatus.icon} className={`w-4 h-4 ${shippingStatus.color}`} />
          <span className={`text-sm font-medium ${shippingStatus.color}`}>{t(shippingStatus.label)}</span>
        </span>
        <span className="hidden md:flex items-center gap-1.5">
          <Icon icon={shippingStatus.icon} className={`w-4 h-4 ${shippingStatus.color}`} />
          <span className={`text-sm font-medium ${shippingStatus.color}`}>{t(shippingStatus.label)}</span>
        </span>
      </div>

      {/* Shipping Desc */}
      <div className="text-sm text-gray-500 wrap-break-word whitespace-pre-wrap">
        {order.shipping_desc}
      </div>

      {/* Total Amount */}
      <div className="text-right md:text-right">
        <span className="text-lg font-bold">
          {symbol}{order.total_amount.toLocaleString()}
        </span>
      </div>
    </div>
  );
}