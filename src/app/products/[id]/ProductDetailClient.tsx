'use client';

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/entities/Product";
import { useI18n } from "@/i18n";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
  const { t, locale } = useI18n();
  const [selectedSize, setSelectedSize] = useState<string>(product.prices[0]?.size ?? "");
  const [quantity, setQuantity] = useState(1);

  const currencyKey = locale === "ja" ? "JPY" : "TWD";

  const selectedPrice = useMemo(() => {
    const sizePrice = product.prices.find((p) => p.size.trim() === selectedSize.trim());
    const currency = sizePrice?.prices?.[currencyKey] ?? Object.values(sizePrice?.prices ?? {})[0];
    return {
      price: currency?.discount_price ?? currency?.price ?? 0,
      originalPrice: currency?.discount_price ? currency?.price : undefined,
    };
  }, [product.prices, selectedSize, currencyKey]);

  const sizes = product.prices.map((p) => p.size);
  const descKey = locale === "zh-TW" ? "zhTW" : locale;
  const description = product.description?.[descKey as keyof typeof product.description];

  const formatPrice = (p: number) => {
    const symbol = currencyKey === "JPY" ? "¥" : "$";
    return `${symbol}${p.toLocaleString()}`;
  };

  return (
    <div className="w-[90%] max-w-[var(--container-max, 1200px)] mx-auto py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">{t.breadcrumb.home}</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-gray-800">{t.breadcrumb.products}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        {/* Left: Images */}
        <div className="lg:w-1/2">
          <Carousel className="w-full">
            <CarouselContent>
              {product.images.length > 0 ? (
                product.images.map((src, index) => (
                  <CarouselItem key={index}>
                    <div className="relative bg-gray-100 rounded-lg aspect-square flex items-center justify-center overflow-hidden">
                      <Image
                        src={src}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </CarouselItem>
                ))
              ) : (
                <CarouselItem>
                  <div className="relative bg-gray-100 rounded-lg aspect-square flex items-center justify-center overflow-hidden">
                    <span className="text-gray-400">No Image</span>
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
            {product.images.length > 1 && (
              <>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </>
            )}
          </Carousel>
        </div>

        {/* Right: Info */}
        <div className="lg:w-1/2 flex flex-col">
          {product.brand && <p className="text-sm text-gray-500 mb-2">{product.brand}</p>}

          <h1 className="text-3xl font-bold tracking-wider border-b-2 border-gray-200 relative pb-4 -mb-0.5">
            {product.name}
            <span className="absolute -bottom-px left-0 w-10 h-0.5 bg-red-600 z-10"></span>
          </h1>

          {/* Price */}
          <div className="py-6 border-b border-gray-200">
            <div className="flex items-baseline gap-3">
              {selectedPrice.originalPrice && selectedPrice.originalPrice > selectedPrice.price && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(selectedPrice.originalPrice)}
                </span>
              )}
              <span className="text-2xl font-bold text-red-600">
                {formatPrice(selectedPrice.price)}
              </span>
              <span className="text-sm text-gray-500">({t.product.taxIncluded})</span>
            </div>
          </div>

          {/* Size Selector */}
          <div className="py-6 border-b border-gray-200">
            <p className="text-sm font-semibold mb-3">{t.product.sizeLabel}</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-12 px-3 py-2 border text-sm font-medium transition-colors ${
                    selectedSize === size
                      ? "border-gray-800 bg-gray-800 text-white"
                      : "border-gray-300 hover:border-gray-800"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="py-6 border-b border-gray-200">
            <p className="text-sm font-semibold mb-3">{t.product.quantityLabel}</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 hover:border-gray-800 flex items-center justify-center"
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 h-10 border border-gray-300 text-center"
                min="1"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border border-gray-300 hover:border-gray-800 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex-1" />

          {/* Add to Cart */}
          <div className="py-6">
            <button
              disabled={!selectedSize}
              className={`w-full py-4 text-lg font-semibold transition-colors ${
                selectedSize
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {t.product.addToCartButton}
            </button>
          </div>
        </div>
      </div>

      {/* Description - below the product section */}
      {description && (
        <div className="mt-8 border-t border-gray-200 pt-8">
          <h2 className="text-lg font-semibold mb-4">{t.product.description}</h2>
          <div className="text-sm text-gray-600 whitespace-pre-line">
            {description}
          </div>
        </div>
      )}
    </div>
  );
}