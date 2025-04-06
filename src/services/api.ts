import axios from 'axios';
import type { ApiConfig, ApiRequestParams } from '../types/Api';
import type { CategoryResponse } from '../types/Category';
import type { ProductDetails, ProductsResponse, Product } from '../types/Product';

class ApiService {
  private config: ApiConfig;
  
  constructor() {
    this.config = {
      storeId: import.meta.env.VITE_STORE_ID,
      token: import.meta.env.VITE_API_TOKEN,
      baseUrl: import.meta.env.VITE_API_BASE_URL
    };
  }
  
  private getUrl(endpoint: string): string {
    return `${this.config.baseUrl}/${this.config.storeId}/${endpoint}?token=${this.config.token}`;
  }
  
  private async get<T>(endpoint: string, params: ApiRequestParams = {}): Promise<T> {
    const url = this.getUrl(endpoint);
    const response = await axios.get(url, { params });
    return response.data;
  }
  
  async getCategories(): Promise<CategoryResponse> {
    return this.get<CategoryResponse>('categories');
  }
  
  async getProducts(categoryId?: number): Promise<ProductsResponse> {
    const params: ApiRequestParams = {
      limit: 100
    };
    
    if (categoryId) {
      params.category = categoryId;
    }
    
    const response = await this.get<ProductsResponse>('products', params);
    
    return response;
  }
  
  async getProductById(productId: number): Promise<ProductDetails> {
    const product = await this.get<ProductDetails>(`products/${productId}`);
    return {
      ...product,
      // Add additional fields specific to ProductDetails
      fullDescription: product.fullDescription || '',
      attributes: product.attributes || []
    };
  }
}

export const apiService = new ApiService();