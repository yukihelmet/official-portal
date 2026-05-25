import { ProductDetailClient } from "./ProductDetailClient";
import { listProducts, getProductById } from "@/lib/official-portal-api";
import type { Metadata } from "next";
import messages from "../../../../messages/zh-TW.json";

export const revalidate = 3600;

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const allProducts: { id: string }[] = [];
  let afterId: string | undefined;

  do {
    const { products, nextId } = await listProducts({ limit: 100, after_id: afterId });
    allProducts.push(...products.map((product) => ({ id: product.id })));
    afterId = nextId ?? undefined;
  } while (afterId);

  return allProducts;
}



export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return { title: "Yuki Helmet" };
  }

  const title = `${product.name} | Yuki Helmet`;
  const description = `${product.brand ? `[${product.brand}] ` : ""}${product.name} ${(messages.seo as Record<string, string>).productDescription}`;
  const image = product.images[0];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) {
    return <div>Product not found</div>;
  }

  return <ProductDetailClient product={product} />;
}