'use client';

import { useState } from "react";
import { Order } from "@/lib/official-portal-api";
import { Icon } from "@iconify/react";
import { useI18n } from "@/i18n";

interface MgntOrderCardProps {
  order: Order;
  currencyKey: "jpy" | "twd";
  onEdit: (order: Order) => void;
  forceMobileLayout?: boolean;
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


export function MgntOrderCard({ order, currencyKey, onEdit, forceMobileLayout }: MgntOrderCardProps) {
  const { t, locale } = useI18n();
  const [copied, setCopied] = useState(false);
  const symbol = currencyKey === "jpy" ? "¥" : "$";

  const status = statusConfig[order.status] ?? { label: `order.status.${order.status}`, color: "text-gray-600", icon: "lucide:circle" };
  const shippingStatus = shippingStatusConfig[order.shipping_status] ?? { label: `order.shippingStatus.${order.shipping_status}`, color: "text-gray-600", icon: "lucide:package" };

  const formatDate = (date: string | Date) => {
    if (!date) return "—";
    const d = typeof date === "string" ? new Date(date) : date;
    const pad = (n: number) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const MM = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const HH = pad(d.getHours());
    const mm = pad(d.getMinutes());
    return `${yyyy}/${MM}/${dd} ${HH}:${mm}`;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const rootClass = forceMobileLayout
    ? "flex flex-col gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
    : "flex flex-col md:grid md:grid-cols-11 gap-2 p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50";

  return (
    <div className={rootClass}>
      {/* Order Number & Date & User ID */}
      <div className={forceMobileLayout ? "flex items-start justify-between" : "md:col-span-1 flex flex-col gap-1 md:block"}>
        <div className="flex items-center gap-1">
          <p className="font-mono font-semibold text-sm">{order.public_id?.slice(0, 8)}</p>
          <button
            onClick={() => handleCopy(order.public_id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <Icon icon={copied ? "lucide:check" : "lucide:copy"} className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center justify-between md:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 break-all" title={order.user_id}>
              {order.user_id}
            </span>
          </div>
        </div>
        <div className="hidden md:block">
          <span className="text-xs text-gray-600 break-all" title={order.user_id}>
            {order.user_id}
          </span>
        </div>
      </div>

      {/* Items Details */}
      <div className={forceMobileLayout ? "space-y-3" : "md:col-span-2"}>
        <ul className="space-y-2">
          {order.items.map((item, i) => (
            <li key={i} className="text-sm text-gray-600 space-y-0.5">
              <a href={item.item_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline">
                {item.name}
              </a>
              <div className="space-y-0.5 text-right text-xs text-gray-400">
                {item.size && <div>Size: {item.size}</div>}
                {item.quantity && <div>x{item.quantity}</div>}
                <div>{symbol}{item.price.toLocaleString()}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Payment Status */}
      <div className={forceMobileLayout ? "flex items-center gap-2" : "flex items-center gap-1.5"}>
        {!forceMobileLayout && <span className="md:hidden text-xs text-gray-400 shrink-0">{t("order.paymentStatus")}</span>}
        {forceMobileLayout && <span className="text-xs text-gray-400 shrink-0">{t("order.paymentStatus")}</span>}
        <span className={forceMobileLayout ? "flex items-center gap-1.5 ml-auto" : "hidden md:flex items-center gap-1.5"}>
          <Icon icon={status.icon} className={`w-4 h-4 ${status.color}`} />
          <span className={`text-sm font-medium ${status.color}`}>{t(status.label)}</span>
        </span>
      </div>

      {/* Shipping Status */}
      <div className={forceMobileLayout ? "flex items-center gap-2" : "flex items-center gap-1.5"}>
        {!forceMobileLayout && <span className="md:hidden text-xs text-gray-400 shrink-0">{t("order.shippingStatusHeader")}</span>}
        {forceMobileLayout && <span className="text-xs text-gray-400 shrink-0">{t("order.shippingStatusHeader")}</span>}
        <span className={forceMobileLayout ? "flex items-center gap-1.5 ml-auto" : "hidden md:flex items-center gap-1.5"}>
          <Icon icon={shippingStatus.icon} className={`w-4 h-4 ${shippingStatus.color}`} />
          <span className={`text-sm font-medium ${shippingStatus.color}`}>{t(shippingStatus.label)}</span>
        </span>
      </div>

      {/* Shipping Info */}
      <div className={forceMobileLayout ? "space-y-1" : "md:col-span-2"}>
        {!forceMobileLayout && <span className="md:hidden text-xs text-gray-400 shrink-0">{t("order.shippingInfo")}</span>}
        {forceMobileLayout && <span className="text-xs text-gray-400 shrink-0">{t("order.shippingInfo")}</span>}
        <div className="text-xs text-gray-600 space-y-0.5">
          <div className="font-medium">{order.recipient_name}</div>
          <div className="">{order.shipping_mobile}</div>
          <div className="text-gray-400">{order.shipping_address}</div>
        </div>
      </div>

      {/* Shipping Desc */}
      <div className={forceMobileLayout ? "space-y-1" : ""}>
        {!forceMobileLayout && <span className="md:hidden text-xs text-gray-400 shrink-0">{t("order.shippingDesc")}</span>}
        {forceMobileLayout && <span className="text-xs text-gray-400 shrink-0">{t("order.shippingDesc")}</span>}
        <div className="text-sm text-gray-500 wrap-break-word whitespace-pre-wrap">
          {order.shipping_desc}
        </div>
      </div>

      {/* Total Amount */}
      <div className={forceMobileLayout ? "text-left" : "text-right"}>
        <span className="text-lg font-bold">
          {symbol}{order.total_amount.toLocaleString()}
        </span>
      </div>

      {/* Last Updated */}
      <div className="text-xs text-gray-400 text-right">
        {order.updated_at ? formatDate(new Date(order.updated_at)) : "—"}
      </div>

      {/* Action */}
      <div className={forceMobileLayout ? "flex justify-start" : "flex justify-end"}>
        <button
          onClick={() => onEdit(order)}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <Icon icon="lucide:pencil" className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
}