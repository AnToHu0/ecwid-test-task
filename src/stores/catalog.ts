import { defineStore } from 'pinia';
import type { Category } from '../types/Category';
import type { Product, ProductDetails } from '../types/Product';
import { apiService } from '../services/api';
import { ref } from 'vue';

export const useCatalogStore = defineStore('catalog', () => {
  const categories = ref<Category[]>([]);
  const products = ref<Product[]>([]);
  const currentProduct = ref<ProductDetails | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchCategories() {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await apiService.getCategories();
      categories.value = response.items;
    } catch (err) {
      error.value = 'Error loading categories';
      console.error(err);
    } finally {
      loading.value = false;
    }
  }
  
  async function fetchProducts(categoryId?: number) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await apiService.getProducts(categoryId);
      products.value = response.items;
    } catch (err) {
      error.value = 'Error loading products';
      console.error(err);
    } finally {
      loading.value = false;
    }
  }
  
  async function fetchProductById(productId: number) {
    loading.value = true;
    error.value = null;
    
    try {
      const product = await apiService.getProductById(productId);
      currentProduct.value = product;
    } catch (err) {
      error.value = 'Error loading product';
      console.error(err);
    } finally {
      loading.value = false;
    }
  }

  return {
    categories,
    products,
    currentProduct,
    loading,
    error,
    fetchCategories,
    fetchProducts,
    fetchProductById
  };
}); 