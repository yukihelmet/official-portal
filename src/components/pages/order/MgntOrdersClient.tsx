'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Order, listMgntOrders, ListOrdersParams, ListOrdersResponse, updateOrderShipping } from "@/lib/official-portal-api";
import { MgntOrderCard } from "./MgntOrderCard";
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
  const [editStatus, setEditStatus] = useState("");
  const [editDescLines, setEditDescLines] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setEditStatus(order.shipping_status);
    const parsed = parseShippingDesc(order.shipping_desc);
    setEditDescLines(parsed);
  };

  const handleSave = async () => {
    if (!selectedOrder) return;
    setIsSaving(true);
    try {
      await updateOrderShipping(selectedOrder.public_id, {
        shipping_status: editStatus,
        shipping_desc_lines: editDescLines.filter((l) => l.trim() !== ""),
      });
      setSelectedOrder(null);
      fetchOrders(true);
    } finally {
      setIsSaving(false);
    }
  };

  const addDescLine = () => {
    setEditDescLines((prev) => [...prev, ""]);
  };

  const removeDescLine = (index: number) => {
    setEditDescLines((prev) => prev.filter((_, i) => i !== index));
  };

  const updateDescLine = (index: number, value: string) => {
    setEditDescLines((prev) => prev.map((line, i) => (i === index ? value : line)));
  };

  function parseShippingDesc(desc: string | null | undefined): string[] {
    if (!desc) return [];
    try {
      const parsed = JSON.parse(desc);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  const currencyKey = locale === "ja" ? "jpy" : "twd";

  const fetchOrders = async (reset = false, afterId?: string | null) => {
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
  };

  useEffect(() => {
    listMgntOrders({ limit: 1 }).catch(() => {
      router.push("/");
    });
  }, [router]);

  useEffect(() => {
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
  }, [nextId, isLoadingMore]);

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

        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white flex-1 overflow-y-auto">
          {/* Table Header */}
          <div className="hidden md:grid gap-2 p-4 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600 grid-cols-8 sticky top-0">
            <div className="md:col-span-1">{t("order.orderNumber")}</div>
            <div className="md:col-span-2">{t("order.items")}</div>
            <div>{t("order.paymentStatus")}</div>
            <div>{t("order.shippingStatusHeader")}</div>
            <div>{t("order.shippingDesc")}</div>
            <div className="text-right">{t("cart.subtotal")}</div>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{t("order.editOrder")}</h2>
            <p className="text-sm text-gray-600 mb-4 font-mono">{selectedOrder.public_id}</p>

            {/* Status */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("order.shippingStatusHeader")}</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="pending">{t("order.shippingStatus.pending")}</option>
                <option value="shipped">{t("order.shippingStatus.shipped")}</option>
              </select>
            </div>

            {/* Desc */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">{t("order.shippingDesc")}</label>
                <button
                  type="button"
                  onClick={addDescLine}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  <Icon icon="lucide:plus" className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {editDescLines.map((line, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={line}
                      onChange={(e) => updateDescLine(i, e.target.value)}
                      className="flex-1 border rounded px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeDescLine(i)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Icon icon="lucide:x" className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                disabled={isSaving}
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                disabled={isSaving}
              >
                {isSaving ? t("common.loading") : t("common.save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}