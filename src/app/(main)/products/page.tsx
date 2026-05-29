import { ProductsClient } from "@/components/pages/product/ProductsClient";
import { listProducts, listBrands, listCategories } from "@/lib/official-portal-api";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yuki Helmet",
};

export const revalidate = 3600;

export default async function ProductsPage() {
  let products: Awaited<ReturnType<typeof listProducts>>["products"] = [];
  let brands: string[] = [];
  let categories: string[] = [];
  let initialNextId: string | null = null;

  try {
    const [productsResponse, brandsResult, categoriesResult] = await Promise.all([
      listProducts({ limit: 20 }),
      listBrands(),
      listCategories(),
    ]);
    products = productsResponse.products;
    initialNextId = productsResponse.nextId;
    brands = brandsResult;
    categories = categoriesResult;
  } catch (error) {
  }

  if (!brands.length || !categories.length) {
    return (
      <div className="w-[90%] max-w-300 mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Products</h1>
        <div className="text-center py-12 text-gray-500">
          Failed to load products. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <ProductsClient
      initialProducts={products}
      initialBrands={brands}
      initialCategories={categories}
      initialNextId={initialNextId}
    />
  );
}