import { ProductDetailClient } from "./ProductDetailClient";
import { listProducts, getProductById } from "@/lib/official-portal-api";
import type { Metadata } from "next";
import messages from "../../../../../messages/zh-TW.json";

export const revalidate = 3600;

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const allProducts: { id: string }[] = [];
  let offset = 0;
  let products: Awaited<ReturnType<typeof listProducts>>["products"] = [];

  do {
    ({ products } = await listProducts({ limit: 20, offset }));
    allProducts.push(...products.map((product) => ({ id: product.id })));
    offset += products.length;
  } while (products.length !== 0);

  return allProducts;
}



export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return { title: "結城安全帽" };
  }

  const title = `${product.name} | 結城安全帽`;
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