'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Order, listMgntOrders, ListOrdersParams, ListOrdersResponse } from "@/lib/official-portal-api";
import { MgntOrderCard } from "./MgntOrderCard";
import { MgntOrderEditModal } from "./MgntOrderEditModal";
import { Loading } from "@/components/ui/loading";
import { Icon } from "@iconify/react";
import { useI18n } from "@/i18n";

export function MgntOrdersClient() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [nextId, setNextId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [shippingFilter, setShippingFilter] = useState<string>("pending");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
  };

  const currencyKey = locale === "ja" ? "jpy" : "twd";

  const fetchOrders = useCallback(async (reset = false, afterId?: string | null) => {
    if (reset) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const params: ListOrdersParams = {
        limit: 20,
        shipping_status: shippingFilter,
      };
      if (!reset && afterId) {
        params.after_id = afterId;
      }

      const response: ListOrdersResponse = await listMgntOrders(params);
      if (reset) {
        setOrders(response.orders);
      } else {
        setOrders((prev) => {
          const existingIds = new Set(prev.map((o) => o.public_id));
          const newOrders = response.orders.filter((o) => !existingIds.has(o.public_id));
          return [...prev, ...newOrders];
        });
      }
      setNextId(response.nextId);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [shippingFilter]);

  useEffect(() => {
    listMgntOrders({ limit: 1 }).catch(() => {
      router.push("/");
    });
  }, [router]);

  useEffect(() => {
    // eslint-disable-next-line
    fetchOrders(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shippingFilter]);

  useEffect(() => {
    if (!nextId || isLoadingMore) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;

      if (docHeight - scrollTop - winHeight < 300 && nextId && !isLoadingMore) {
        fetchOrders(false, nextId);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [nextId, isLoadingMore, fetchOrders]);

  if (isLoading) {
    return <Loading />;
  }

  if (orders.length === 0 && !isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100dvh-64px)] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">{t("order.management")}</h1>
          <select
            value={shippingFilter}
            onChange={(e) => setShippingFilter(e.target.value)}
            className="border rounded px-3 py-1.5 text-sm"
          >
            <option value="pending">{t("order.shippingStatus.pending")}</option>
            <option value="shipped">{t("order.shippingStatus.shipped")}</option>
          </select>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Icon icon="lucide:package" className="w-16 h-16 mx-auto mb-4" />
            <p>{t("order.noOrders")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-8 h-[calc(100dvh-64px)] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">{t("order.management")}</h1>
          <select
            value={shippingFilter}
            onChange={(e) => setShippingFilter(e.target.value)}
            className="border rounded px-3 py-1.5 text-sm"
          >
            <option value="pending">{t("order.shippingStatus.pending")}</option>
            <option value="shipped">{t("order.shippingStatus.shipped")}</option>
          </select>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white flex-1 overflow-y-auto">
          {/* Table Header */}
          <div className="hidden md:grid gap-2 p-4 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600 grid-cols-11 sticky top-0">
            <div>{t("order.orderNumber")}</div>
            <div className="md:col-span-2">{t("order.items")}</div>
            <div>{t("order.paymentStatus")}</div>
            <div>{t("order.shippingStatusHeader")}</div>
            <div className="md:col-span-2">{t("order.shippingInfo")}</div>
            <div>{t("order.shippingDesc")}</div>
            <div className="text-right">{t("cart.subtotal")}</div>
            <div className="text-right">{t("order.lastUpdated")}</div>
            <div className="text-right">{t("order.action")}</div>
          </div>

          {/* Table Body */}
          <div>
            {orders.map((order) => (
              <MgntOrderCard
                key={order.public_id}
                order={order}
                currencyKey={currencyKey}
                onEdit={handleEdit}
              />
            ))}
          </div>
        </div>

        {/* Load More Trigger */}
        {nextId && (
          <div ref={loadMoreRef} className="flex justify-center py-4">
            {isLoadingMore && <Loading />}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {selectedOrder && (
        <MgntOrderEditModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onSaved={() => fetchOrders(true)}
        />
      )}
    </>
  );
}