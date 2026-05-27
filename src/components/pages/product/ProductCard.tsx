'use client';

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/entities/Product";
import { useI18n } from "@/i18n";

interface ProductCardProps {
  product: Product;
  currencyKey: "jpy" | "twd";
}

export function ProductCard({ product, currencyKey }: ProductCardProps) {
  const { t } = useI18n();
  const price = product.prices[0]?.prices?.[currencyKey];
  const displayPrice = price?.discount_price ?? price?.price ?? 0;
  const originalPrice = price?.discount_price ? price?.price : undefined;
  const symbol = currencyKey === "jpy" ? "¥" : "$";
  const categoryLabel = (t.product as Record<string, string>)[product.category] ?? product.category;

  return (
    <Link href={`/products/${product.id}`}>
      <div className="group cursor-pointer">
        <div className="relative bg-gray-100 rounded-lg aspect-square overflow-hidden">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              loading="eager"
              className="object-contain group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>
        <div className="mt-3 space-y-1">
          {product.brand && (
            <p className="text-xs font-semibold text-gray-500">{product.brand}</p>
          )}
          <h3 className="font-medium text-sm line-clamp-2 text-primary group-hover:text-[#1A1A1A] transition-colors">
            {product.name}
          </h3>
          {product.category && (
            <p className="text-xs text-gray-400">{categoryLabel}</p>
          )}
          <div className="flex items-baseline gap-2">
            {originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                {symbol}{originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-sm font-semibold text-red-600">
              {symbol}{displayPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}