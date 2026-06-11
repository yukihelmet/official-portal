'use client';

import { useState } from 'react';
import { Order, updateOrderShipping } from '@/lib/official-portal-api';
import { Textarea } from '@/components/ui/textarea';
import { useI18n } from '@/i18n';

interface MgntOrderEditModalProps {
  order: Order;
  onClose: () => void;
  onSaved: () => void;
}

export function MgntOrderEditModal({ order, onClose, onSaved }: MgntOrderEditModalProps) {
  const { t } = useI18n();
  const [shippingStatus, setShippingStatus] = useState(order.shipping_status);
  const [shippingDesc, setShippingDesc] = useState(order.shipping_desc ?? '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateOrderShipping(order.public_id, {
        shipping_status: shippingStatus,
        shipping_desc: shippingDesc,
      });
      onSaved();
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{t('order.editOrder')}</h2>
        <p className="text-sm text-gray-600 mb-4 font-mono">{order.public_id}</p>

        {/* Status */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('order.shippingStatusHeader')}
          </label>
          <select
            value={shippingStatus}
            onChange={(e) => setShippingStatus(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="pending">{t('order.shippingStatus.pending')}</option>
            <option value="shipped">{t('order.shippingStatus.shipped')}</option>
          </select>
        </div>

        {/* Desc */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('order.shippingDesc')}</label>
          <Textarea
            value={shippingDesc}
            onChange={(e) => setShippingDesc(e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            disabled={isSaving}
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            disabled={isSaving}
          >
            {isSaving ? t('common.loading') : t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
}