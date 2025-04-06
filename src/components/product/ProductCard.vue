<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col h-full">
    <router-link :to="`/product/${product.id}`" class="block flex-grow">
      <div class="h-80 overflow-hidden relative">
        <img
          v-if="product.imageUrl"
          :src="product.imageUrl"
          :alt="product.name"
          class="w-full h-full object-cover transition-transform hover:scale-105"
        />
        <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
          <Icon icon="mdi:image-off" class="text-gray-300 w-12 h-12" />
        </div>
        <div v-if="!product.enabled" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <span class="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Out of stock</span>
        </div>
      </div>
      <div class="p-3 flex-grow">
        <h3 class="text-sm font-semibold">{{ product.name }}</h3>
      </div>
    </router-link>
    <div class="p-3 mt-auto border-t border-gray-100">
      <div class="flex justify-between items-center mb-3">
        <span class="text-blue-600 font-bold text-base">{{ formatPrice(product.price) }}</span>
      </div>
      <button
        @click="addToCart"
        :disabled="!product.enabled"
        class="w-full py-2 rounded flex items-center justify-center transition-colors"
        :class="product.enabled ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
      >
        <Icon :icon="product.enabled ? 'mdi:cart-plus' : 'mdi:cart-off'" class="mr-1 w-4 h-4" />
        {{ product.enabled ? 'Add to cart' : 'Out of stock' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import type { Product } from '../../types/Product';
import { useCartStore } from '../../stores/cart';

const props = defineProps<{
  product: Product
}>();

const cartStore = useCartStore();

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
};

const addToCart = () => {
  if (props.product.enabled) {
    cartStore.addToCart(props.product, 1);
  }
};
</script> 