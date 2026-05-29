'use client';

import { useState, useEffect, useCallback, useRef, useTransition } from "react";
import { Product } from "@/entities/Product";
import {
  listProducts,
  ListProductsParams,
} from "@/lib/official-portal-api";
import { ProductCard } from "./ProductCard";
import { Loading } from "@/components/ui/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/i18n";

interface ProductsClientProps {
  initialProducts: Product[];
  initialBrands: string[];
  initialCategories: string[];
  initialNextId: string | null;
}

export function ProductsClient({
  initialProducts,
  initialBrands,
  initialCategories,
  initialNextId: initialNextIdProp,
}: ProductsClientProps) {
  const { locale, t } = useI18n();
  const currencyKey = locale === "ja" ? "jpy" : "twd";

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [brands] = useState(initialBrands);
  const [categories] = useState(initialCategories);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState<string>(t("filter.allCategories"));
  const [nextId, setNextId] = useState<string | null>(initialNextIdProp);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [, startTransition] = useTransition();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const fetchProducts = useCallback(
    async (reset = false, afterId?: string | null) => {
      if (reset) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const params: ListProductsParams = {
        brand: selectedBrand || undefined,
        category: selectedCategory || undefined,
        after_id: reset ? undefined : (afterId ?? undefined),
      };

      // Fallback: use last product's ID if afterId is not provided but we have products
      if (!reset && !afterId && products.length > 0) {
        params.after_id = products[products.length - 1].id;
      }

      try {
        const { products: fetchedProducts, nextId: fetchedNextId } = await listProducts(params);
        if (reset) {
          setProducts(fetchedProducts);
          setNextId(fetchedNextId);
        } else {
          setProducts((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const newProducts = fetchedProducts.filter((p) => !existingIds.has(p.id));
            return [...prev, ...newProducts];
          });
          setNextId(fetchedNextId);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedBrand, selectedCategory]
  );

  useEffect(() => {
    if (!nextId || isLoadingMore) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;

      if (docHeight - scrollTop - winHeight < 300 && nextId && !isLoadingMore) {
        fetchProducts(false, nextId);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [nextId, isLoadingMore, fetchProducts]);

  useEffect(() => {
    startTransition(() => {
      fetchProducts(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBrand, selectedCategory]);

  return (
    <div className="w-[90%] max-w-[var(--container-max, 1200px)] mx-auto py-8">
      {/* <h1 className="text-3xl font-bold mb-8">{(t.common as Record<string, string>).products}</h1> */}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Select value={selectedBrand} onValueChange={(v) => setSelectedBrand(v || "")}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder={t("filter.allBrands")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{t("filter.allBrands")}</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
            value={selectedCategory}
            onValueChange={(v) => {
              setSelectedCategory(v || "");
              if (!v) {
                setSelectedCategoryLabel(t("filter.allCategories"));
              } else {
                const label = t(`product.${v}`) ?? v;
                setSelectedCategoryLabel(label);
              }
            }}
          >
            <SelectTrigger className="w-36">
              <SelectValue>{selectedCategoryLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{t("filter.allCategories")}</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {(t(`product.${category}`) as string) ?? category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <Loading />
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">{t("filter.noProducts")}</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currencyKey={currencyKey}
              />
            ))}
          </div>

          {/* Load More Trigger */}
          {nextId && (
            <div ref={loadMoreRef} className="flex justify-center py-4">
              {isLoadingMore && <Loading />}
            </div>
          )}
        </>
      )}
    </div>
  );
}