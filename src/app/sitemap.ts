import { MetadataRoute } from "next";
import { listProducts } from "@/lib/official-portal-api";

export const revalidate = 3600;

async function getAllProducts(): Promise<string[]> {
  const productIds: string[] = [];
  let nextId: string | undefined;

  do {
    const response = await listProducts({
      limit: 20,
      after_id: nextId,
    });
    productIds.push(...response.products.map((p) => p.id));
    nextId = response.nextId ?? undefined;
  } while (nextId);

  return productIds;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productIds = await getAllProducts();

  const productUrls = productIds.map((id) => ({
    url: `https://yukihelmet.com/products/${id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: "https://yukihelmet.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://yukihelmet.com/products",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...productUrls,
  ];
}
