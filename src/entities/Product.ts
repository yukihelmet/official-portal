export interface CurrencyPrice {
  price: number;
  discount_price: number;
}

export interface SizePrice {
  size: string;
  prices: Record<string, CurrencyPrice>;
}

export interface LocalizedDescription {
  ja: string;
  zhTW: string;
}

export interface Product {
  id: string;
  name: string;
  model: string;
  brand: string;
  category: string;
  prices: SizePrice[];
  images: string[];
  description?: LocalizedDescription;
}