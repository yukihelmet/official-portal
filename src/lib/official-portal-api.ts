export const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:80"
    : process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.yuki-helmet.com";

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
  order_by_best_price?: "asc" | "desc";
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
    const res = await fetch(url.toString(), {
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    return res.json();
  } catch (err) {
    if (attempt < 3) {
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

// Auth types
export interface AccessTokenResponse {
  access_token: string;
  access_token_exp: number;
  refresh_token?: string;
  refresh_token_exp?: number;
}

// Auth API
export async function auth0Login(): Promise<string> {
  const response = await request<GeneralResponse<string>>("/v1/auth/auth0");
  return response.result;
}

export async function auth0Callback(
  code: string,
): Promise<AccessTokenResponse> {
  const response = await request<GeneralResponse<AccessTokenResponse>>(
    "/v1/auth/auth0/callback",
    { code },
  );
  return response.result;
}

export async function refreshToken(): Promise<AccessTokenResponse> {
  const response = await request<GeneralResponse<AccessTokenResponse>>(
    "/v1/auth/refresh-token",
  );
  return response.result;
}

// Global auth state
const AUTH_STORAGE_KEY = "auth_token";

interface AuthToken {
  accessToken: string;
  accessTokenExp: number;
}

function getAuthToken(): AuthToken | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthToken;
  } catch {
    return null;
  }
}

export function getAccessToken(): string | null {
  return getAuthToken()?.accessToken ?? null;
}

export function setAccessToken(token: string, exp: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({ accessToken: token, accessTokenExp: exp }),
  );
}

export function clearAccessToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

// Profile API
export interface ProfileResponse {
  email: string;
}

async function requestWithAuth<T>(path: string, refreshed = false): Promise<T> {
  const token = getAccessToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    if (res.status === 401 && !refreshed) {
      try {
        const tokens = await refreshToken();
        setAccessToken(tokens.access_token, tokens.access_token_exp);
        return requestWithAuth<T>(path, true);
      } catch {
        clearAccessToken();
        throw new Error("Session expired");
      }
    }
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

export async function getProfile(): Promise<ProfileResponse> {
  const response =
    await requestWithAuth<GeneralResponse<ProfileResponse>>("/v1/profile");
  return response.result;
}

// Payment types
export interface CheckoutItem {
  product_id: string;
  size: string;
  quantity: number;
}

export interface CheckoutResponse {
  checkout_url: string;
}

async function postRequestWithAuth<T>(
  path: string,
  body: unknown,
  refreshed = false,
): Promise<T> {
  const token = getAccessToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    if (res.status === 401 && !refreshed) {
      try {
        const tokens = await refreshToken();
        setAccessToken(tokens.access_token, tokens.access_token_exp);
        return postRequestWithAuth<T>(path, body, true);
      } catch {
        clearAccessToken();
        throw new Error("Session expired");
      }
    }
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

export async function checkout(
  items: CheckoutItem[],
  currency: string,
): Promise<string> {
  const response = await postRequestWithAuth<GeneralResponse<CheckoutResponse>>(
    "/v1/payment/checkout",
    { currency, items },
  );
  return response.result.checkout_url;
}

// Order types
export interface OrderItem {
  name: string;
  product_id: string;
  image_url: string;
  quantity: number;
  size: string;
  price: number;
  item_url: string;
}

export interface Order {
  public_id: string;
  ref_id: string;
  user_id: string;
  items: OrderItem[];
  total_amount: number;
  currency: string;
  status: string;
  shipping_status: string;
  shipping_desc: string;
  shipped_at: string | null;
  created_at: string;
}

export interface ListOrdersParams {
  limit?: number;
  after_id?: string;
  order_desc?: string;
  status?: string;
  shipping_status?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface ListOrdersResponse {
  orders: Order[];
  nextId: string | null;
}

export async function listMgntOrders(
  params?: ListOrdersParams,
): Promise<ListOrdersResponse> {
  const response = await getRequestWithAuth<ListResponse<Order>>(
    "/v1/mgnt/orders",
    params,
  );
  return {
    orders: response.result,
    nextId: response.next_id ?? null,
  };
}

// Server-side: uses session cookie, bypasses localStorage token check
export async function serverListMgntOrders(
  params?: ListOrdersParams,
): Promise<ListOrdersResponse> {
  const url = new URL(`${API_BASE_URL}/v1/mgnt/orders`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const res = await fetch(url.toString(), { credentials: "include" });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  const response = await res.json();
  return {
    orders: response.result ?? [],
    nextId: response.next_id ?? null,
  };
}

async function getRequestWithAuth<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
  refreshed = false,
): Promise<T> {
  const token = getAccessToken();
  if (!token) throw new Error("Not authenticated");

  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    if (res.status === 401 && !refreshed) {
      try {
        const tokens = await refreshToken();
        setAccessToken(tokens.access_token, tokens.access_token_exp);
        return getRequestWithAuth<T>(path, params, true);
      } catch {
        clearAccessToken();
        throw new Error("Session expired");
      }
    }
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

export async function listOrders(
  params?: ListOrdersParams,
): Promise<ListOrdersResponse> {
  const response = await getRequestWithAuth<ListResponse<Order>>(
    "/v1/payment/orders",
    params,
  );
  return {
    orders: response.result,
    nextId: response.next_id ?? null,
  };
}

async function patchRequestWithAuth<T>(
  path: string,
  body: unknown,
  refreshed = false,
): Promise<T> {
  const token = getAccessToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    if (res.status === 401 && !refreshed) {
      try {
        const tokens = await refreshToken();
        setAccessToken(tokens.access_token, tokens.access_token_exp);
        return patchRequestWithAuth<T>(path, body, true);
      } catch {
        clearAccessToken();
        throw new Error("Session expired");
      }
    }
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

export interface UpdateOrderShippingRequest {
  shipping_status: string;
  shipping_desc_lines: string[];
}

export async function updateOrderShipping(
  id: string,
  request: UpdateOrderShippingRequest,
): Promise<void> {
  await patchRequestWithAuth<GeneralResponse<any>>(
    `/v1/mgnt/orders/${id}`,
    request,
  );
}
