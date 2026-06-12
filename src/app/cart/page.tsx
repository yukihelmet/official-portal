'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { getProductById, checkout, Product } from "@/lib/official-portal-api";
import { useI18n } from "@/i18n";
import { useAuth } from "@/contexts/AuthContext";
import { Icon } from "@iconify/react";

interface CartItemWithProduct {
  productId: string;
  size: string;
  quantity: number;
  product: Product | null;
  loading: boolean;
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const { t, locale } = useI18n();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setCartItems(
        items.map((item) => ({ ...item, product: null, loading: true }))
      );

      const withProducts = await Promise.all(
        items.map(async (item) => {
          try {
            const product = await getProductById(item.productId);
            return { ...item, product, loading: false };
          } catch {
            return { ...item, product: null, loading: false };
          }
        })
      );
      setCartItems(withProducts);
    };

    fetchProducts();
  }, [items]);

  const currencyKey = locale === "ja" ? "jpy" : "twd";

  const getPrice = (product: Product, size: string) => {
    const sizePrice = product.prices.find((p) => p.size.trim() === size.trim());
    const currency = sizePrice?.prices?.[currencyKey] ?? Object.values(sizePrice?.prices ?? {})[0];
    return currency?.discount_price ?? currency?.price ?? 0;
  };

  const formatPrice = (p: number) => {
    const symbol = currencyKey === "jpy" ? "¥" : "NT$";
    return `${symbol}${p.toLocaleString()}`;
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setIsCheckingOut(true);
    setCheckoutError(null);
    try {
      const url = await checkout(
        items.map((item) => ({
          product_id: item.productId,
          size: item.size,
          quantity: item.quantity,
        })),
        currencyKey,
      );
      window.location.href = url;
    } catch {
      setCheckoutError(t("cart.checkoutError"));
    } finally {
      setIsCheckingOut(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    if (!item.product || item.loading) return sum;
    return sum + getPrice(item.product, item.size) * item.quantity;
  }, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center h-[calc(100dvh-64px)] flex flex-col justify-center">
        <Icon icon="lucide:shopping-cart" className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h1 className="text-2xl font-bold mb-2">{t("cart.empty")}</h1>
        <p className="text-gray-500 mb-6">{t("cart.emptyDesc")}</p>
        <Link href="/products" className="inline-block bg-black text-white px-6 py-3 rounded">
          {t("common.products")}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100dvh-64px)] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{t("common.cart")}</h1>
        <button onClick={clearCart} className="text-sm text-gray-500 hover:text-red-500">
          {t("cart.clear")}
        </button>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto">
        {cartItems.map((item) => (
          <div key={`${item.productId}-${item.size}`} className="flex gap-4 bg-white border rounded-lg p-4">
            {item.loading || !item.product ? (
              <div className="w-24 h-24 bg-gray-100 animate-pulse rounded" />
            ) : (
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={item.product.images[0] || "/placeholder.png"}
                  alt={item.product.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}

            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                {item.loading || !item.product ? (
                  <div className="h-5 w-48 bg-gray-100 animate-pulse mb-2" />
                ) : (
                  <Link href={`/products/${item.productId}`} className="font-semibold hover:text-primary">
                    {item.product.name}
                  </Link>
                )}
                <p className="text-sm text-gray-500">
                  {t("product.size")}: {item.size}
                </p>
              </div>

              <div className="flex items-center gap-2 mt-1 self-start">
                <button
                  onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                  className="w-7 h-7 flex items-center justify-center border rounded hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center border rounded hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col items-end justify-between">
              {item.loading || !item.product ? (
                <div className="h-5 w-20 bg-gray-100 animate-pulse" />
              ) : (
                <span className="font-semibold">{formatPrice(getPrice(item.product, item.size))}</span>
              )}
              <button
                onClick={() => removeItem(item.productId, item.size)}
                className="text-gray-400 hover:text-red-500"
              >
                <Icon icon="lucide:trash-2" className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t pt-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg">{t("cart.subtotal")}</span>
          <span className="text-2xl font-bold">{formatPrice(subtotal)}</span>
        </div>
        {checkoutError && (
          <p className="text-red-500 text-sm mb-3 text-center">{checkoutError}</p>
        )}
        <button
          onClick={handleCheckout}
          disabled={isCheckingOut}
          className="w-full bg-white border-primary border text-primary py-4 rounded-lg font-semibold hover:bg-primary hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCheckingOut ? t("common.loading") : isAuthenticated ? t("cart.checkout") : t("common.signInToContinue")}
        </button>
      </div>
    </div>
  );
}