'use client';

import { useState } from 'react';
import { Order, updateOrderShipping } from '@/lib/official-portal-api';
import { Icon } from '@iconify/react';
import { useI18n } from '@/i18n';

interface MgntOrderEditModalProps {
  order: Order;
  onClose: () => void;
  onSaved: () => void;
}

export function MgntOrderEditModal({ order, onClose, onSaved }: MgntOrderEditModalProps) {
  const { t } = useI18n();
  const [shippingStatus, setShippingStatus] = useState(order.shipping_status);
  const [descLines, setDescLines] = useState<string[]>(() => parseShippingDesc(order.shipping_desc));
  const [isSaving, setIsSaving] = useState(false);

  function parseShippingDesc(desc: string | null | undefined): string[] {
    if (!desc) return [];
    try {
      const parsed = JSON.parse(desc);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  const addDescLine = () => setDescLines((prev) => [...prev, '']);
  const removeDescLine = (index: number) => setDescLines((prev) => prev.filter((_, i) => i !== index));
  const updateDescLine = (index: number, value: string) =>
    setDescLines((prev) => prev.map((line, i) => (i === index ? value : line)));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateOrderShipping(order.public_id, {
        shipping_status: shippingStatus,
        shipping_desc_lines: descLines.filter((l) => l.trim() !== ''),
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
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">{t('order.shippingDesc')}</label>
            <button type="button" onClick={addDescLine} className="text-sm text-blue-600 hover:text-blue-800">
              <Icon icon="lucide:plus" className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {descLines.map((line, i) => (
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