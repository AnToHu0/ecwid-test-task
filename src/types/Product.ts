export interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  defaultDisplayedPrice: number;
  description?: string;
  imageUrl?: string;
  thumbnail?: string;
  smallThumbnail?: string;
  url?: string;
  categories?: number[];
  quantity: number;
}

export interface ProductDetails extends Product {
  fullDescription?: string;
  attributes?: ProductAttribute[];
  relatedProducts?: Product[];
}

export interface ProductAttribute {
  id: number;
  name: string;
  value: string;
  type: string;
}

export interface ProductsResponse {
  total: number;
  count: number;
  offset: number;
  limit: number;
  items: Product[];
} 