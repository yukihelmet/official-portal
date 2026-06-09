'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { getMgntOrder, Order } from '@/lib/official-portal-api';
import { MgntOrderCard } from '@/components/pages/order/MgntOrderCard';
import { MgntOrderEditModal } from '@/components/pages/order/MgntOrderEditModal';
import { Loading } from '@/components/ui/loading';
import { useI18n } from '@/i18n';

export default function MgntOrderIdViewPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { locale } = useI18n();
  const currencyKey = locale === 'ja' ? 'jpy' : 'twd';

  const refreshOrder = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    const result = await getMgntOrder(id);
    setOrder(result);
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    refreshOrder();
  }, [refreshOrder]);

  if (!id) return <div>Missing id</div>;
  if (isLoading) return <Loading />;

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Order Detail</h1>
      {order && (
        <>
          <MgntOrderCard order={order} currencyKey={currencyKey} onEdit={setSelectedOrder} forceMobileLayout />
          {selectedOrder && (
            <MgntOrderEditModal
              order={selectedOrder}
              onClose={() => setSelectedOrder(null)}
              onSaved={refreshOrder}
            />
          )}
        </>
      )}
    </div>
  );
}