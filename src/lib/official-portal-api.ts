const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.yuki-helmet.com";

export type {
  Product,
  SizePrice,
  CurrencyPrice,
  LocalizedDescription,
} from "@/entities/Product";
import { Product } from "@/entities/Product";

export interface ListProductsParams {
  gender?: string;
  brand?: string;
  category?: string;
  limit?: number;
  after_id?: string;
  order_desc?: boolean;
  [key: string]: string | number | boolean | undefined;
}

interface ListResponse<T> {
  result: T[];
  code: string;
  next_id?: string;
  total?: number;
}

interface GeneralResponse<T> {
  result: T;
  code: string;
}

async function request<
  T,
  P = Record<string, string | number | boolean | undefined>,
>(path: string, params?: P, attempt = 0): Promise<T> {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    (
      Object.entries(params) as [
        string,
        string | number | boolean | undefined,
      ][]
    ).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  try {
    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    return res.json();
  } catch (err) {
    if (attempt < 5) {
      const baseDelay = Math.pow(2, attempt) * 1000;
      const jitter = Math.random() * 1000;
      const delay = baseDelay + jitter;
      await new Promise((resolve) => setTimeout(resolve, delay));
      return request<T, P>(path, params, attempt + 1);
    }
    throw err;
  }
}

export interface ListProductsResponse {
  products: Product[];
  nextId: string | null;
}

export async function listProducts(
  params?: ListProductsParams,
): Promise<ListProductsResponse> {
  const response = await request<ListResponse<Product>>("/v1/products", params);
  return {
    products: response.result,
    nextId: response.next_id ?? null,
  };
}

export async function getProductById(id: string): Promise<Product> {
  const response = await request<GeneralResponse<Product>>(
    `/v1/products/${id}`,
  );
  return response.result;
}

export async function listBrands(): Promise<string[]> {
  const response = await request<ListResponse<string>>("/v1/products/brands");
  return response.result;
}

export async function listCategories(): Promise<string[]> {
  const response = await request<ListResponse<string>>(
    "/v1/products/categories",
  );
  return response.result;
}
