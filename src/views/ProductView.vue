<template>
  <AppLayout>
    <div v-if="loading" class="flex justify-center my-12">
      <div class="loader"></div>
    </div>

    <div v-else-if="error" class="bg-red-100 text-red-700 p-4 rounded mb-6">
      {{ error }}
    </div>

    <div v-else-if="!product" class="text-center py-12 text-gray-500">
      <Icon icon="mdi:package-variant-remove" class="w-16 h-16 mx-auto mb-2" />
      Product not found
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Product image -->
      <div class="bg-white p-4 rounded-lg shadow-md">
        <div v-if="product.imageUrl" class="aspect-square overflow-hidden rounded-md">
          <img 
            :src="product.imageUrl" 
            :alt="product.name" 
            class="w-full h-full object-contain"
          >
        </div>
        <div v-else class="aspect-square bg-gray-200 flex items-center justify-center rounded-md">
          <Icon icon="mdi:image-off" class="text-gray-300 w-16 h-16" />
        </div>
      </div>

      <!-- Product information -->
      <div>
        <h1 class="text-2xl font-bold mb-4">{{ product.name }}</h1>
        <div class="text-2xl text-blue-600 font-bold mb-6">{{ formatPrice(product.price) }}</div>
        
        <div v-if="!product.enabled" class="bg-red-100 text-red-700 p-3 rounded-lg mb-6 flex items-center">
          <Icon icon="mdi:alert-circle" class="mr-2 w-5 h-5" />
          Product is temporarily out of stock
        </div>
        
        <div v-if="product.description" class="mb-6">
          <h2 class="text-lg font-semibold mb-2 flex items-center">
            <Icon icon="mdi:text-box-outline" class="mr-2" />
            Description
          </h2>
          <div class="text-gray-700" v-html="product.description"></div>
        </div>
        
        <div v-if="product.fullDescription" class="mb-6">
          <h2 class="text-lg font-semibold mb-2 flex items-center">
            <Icon icon="mdi:file-document-outline" class="mr-2" />
            Full Description
          </h2>
          <div class="text-gray-700" v-html="product.fullDescription"></div>
        </div>

        <div v-if="product.attributes && product.attributes.length > 0" class="mb-6">
          <h2 class="text-lg font-semibold mb-2 flex items-center">
            <Icon icon="mdi:format-list-bulleted" class="mr-2" />
            Specifications
          </h2>
          <dl class="grid grid-cols-3 gap-2">
            <template v-for="attribute in product.attributes" :key="attribute.id">
              <dt class="text-gray-600 col-span-1">{{ attribute.name }}:</dt>
              <dd class="text-gray-900 col-span-2">{{ attribute.value }}</dd>
            </template>
          </dl>
        </div>

        <div class="flex items-center space-x-4 mt-8" v-if="product.enabled">
          <div class="flex items-center border rounded">
            <button
              @click="decreaseQuantity"
              class="px-3 py-2 text-gray-600 hover:bg-gray-100"
              :disabled="quantity <= 1"
            >
              <Icon icon="mdi:minus" />
            </button>
            <span class="px-3 py-2">{{ quantity }}</span>
            <button
              @click="increaseQuantity"
              class="px-3 py-2 text-gray-600 hover:bg-gray-100"
            >
              <Icon icon="mdi:plus" />
            </button>
          </div>

          <button
            @click="addToCart"
            class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors flex-grow flex items-center justify-center"
          >
            <Icon icon="mdi:cart-plus" class="mr-2" />
            Add to cart
          </button>
        </div>
        
        <div v-else class="flex items-center mt-8">
          <button
            class="bg-gray-300 text-gray-500 px-6 py-2 rounded cursor-not-allowed w-full flex items-center justify-center"
          >
            <Icon icon="mdi:cart-off" class="mr-2" />
            Out of stock
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';
import { useHead } from '@vueuse/head';
import { useCatalogStore } from '../stores/catalog';
import { useCartStore } from '../stores/cart';
import AppLayout from '../components/layout/AppLayout.vue';
import type { ProductDetails } from '../types/Product';

const route = useRoute();
const catalogStore = useCatalogStore();
const cartStore = useCartStore();
const quantity = ref(1);

const loading = computed(() => catalogStore.loading);
const error = computed(() => catalogStore.error);
const product = computed<ProductDetails | null>(() => catalogStore.currentProduct);

const productId = computed(() => {
  return route.params.id ? Number(route.params.id) : undefined;
});

// Реактивные SEO метаданные
const title = computed(() => product.value?.seoTitle || product.value?.name || '');
const description = computed(() => product.value?.seoDescription || '');

// Применяем метаданные с помощью useHead
useHead({
  title,
  meta: [
    {
      name: 'description',
      content: description
    }
  ]
});

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
};

const increaseQuantity = () => {
  quantity.value++;
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const addToCart = () => {
  if (product.value && product.value.enabled) {
    cartStore.addToCart(product.value, quantity.value);
    quantity.value = 1;
  }
};

onMounted(async () => {
  if (productId.value) {
    await catalogStore.fetchProductById(productId.value);
  }
});
</script>

<style scoped>
.loader {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #3b82f6;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 