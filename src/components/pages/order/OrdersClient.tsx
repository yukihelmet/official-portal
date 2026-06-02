'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Order, listOrders, ListOrdersParams, ListOrdersResponse } from "@/lib/official-portal-api";
import { OrderCard } from "./OrderCard";
import { Loading } from "@/components/ui/loading";
import { Icon } from "@iconify/react";
import { useI18n } from "@/i18n";
import Link from "next/link";

interface OrderRowComponentProps {
  order: Order;
  currencyKey: "jpy" | "twd";
  onEdit?: (order: Order) => void;
}

interface OrdersClientProps {
  initialOrders: Order[];
  initialNextId: string | null;
  listFn?: (params: ListOrdersParams) => ReturnType<typeof listOrders>;
  serverListFn?: (params: ListOrdersParams) => Promise<ListOrdersResponse>;
  RowComponent?: React.ComponentType<OrderRowComponentProps>;
  onEdit?: (order: Order) => void;
}

export function OrdersClient({
  initialOrders,
  initialNextId: initialNextIdProp,
  listFn = listOrders,
  serverListFn,
  RowComponent = OrderCard,
  onEdit,
}: OrdersClientProps) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [nextId, setNextId] = useState<string | null>(initialNextIdProp);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

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
      };
      if (!reset && afterId) {
        params.after_id = afterId;
      }

      const fetchFn = reset && serverListFn ? serverListFn : listFn;
      const response = await fetchFn(params);
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
    } catch {
      if (reset) {
        router.push("/login");
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchOrders(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <h1 className="text-3xl font-bold">{t("order.orders")}</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Icon icon="lucide:package" className="w-16 h-16 mx-auto mb-4" />
            <p className="mb-6">{t("order.noOrders")}</p>
            <Link href="/products" className="inline-block bg-black text-white px-6 py-3 rounded">
              {t("common.products")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100dvh-64px)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">{t("order.orders")}</h1>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white flex-1 overflow-y-auto">
        {/* Table Header */}
        <div className={`hidden md:grid gap-4 p-4 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600 sticky top-0 ${onEdit ? "grid-cols-8" : "grid-cols-7"}`}>
          <div className={onEdit ? "md:col-span-1" : "md:col-span-2"}>{t("order.orderNumber")}</div>
          <div>{t("order.items")}</div>
          <div>{t("order.paymentStatus")}</div>
          <div>{t("order.shippingStatusHeader")}</div>
          <div>{t("order.shippingDesc")}</div>
          <div className="text-right">{t("cart.subtotal")}</div>
          {onEdit && <div className="text-right">Action</div>}
        </div>

        {/* Table Body */}
        <div>
          {orders.map((order) => (
            <RowComponent key={order.public_id} order={order} currencyKey={currencyKey} onEdit={onEdit} />
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
  );
}