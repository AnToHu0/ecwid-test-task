<template>
  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-gray-200 w-full">
    <div class="flex items-center space-x-4 w-full sm:w-auto mb-4 sm:mb-0">
      <div class="w-16 h-16 flex-shrink-0">
        <img
          v-if="item.product.imageUrl"
          :src="item.product.imageUrl"
          :alt="item.product.name"
          class="w-full h-full object-cover rounded"
        />
        <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center rounded">
          <Icon icon="mdi:image-off" class="text-gray-400 w-6 h-6" />
        </div>
      </div>
      <div>
        <router-link :to="`/product/${item.product.id}`" class="font-medium text-blue-600 hover:underline">
          {{ item.product.name }}
        </router-link>
        <p class="text-sm text-gray-500">{{ formatPrice(item.product.price) }} per item</p>
      </div>
    </div>
    
    <div class="flex flex-row sm:items-end space-x-4 w-full sm:w-auto justify-between sm:justify-end">
      <div class="flex items-center rounded border-gray-200">
        <button 
          @click="decreaseQuantity" 
          class="px-2 py-1 text-gray-600 hover:bg-gray-100"
        >
          <Icon icon="mdi:minus" class="w-4 h-4" />
        </button>
        <span class="px-2 py-1">{{ item.quantity }}</span>
        <button 
          @click="increaseQuantity" 
          class="px-2 py-1 text-gray-600 hover:bg-gray-100"
        >
          <Icon icon="mdi:plus" class="w-4 h-4" />
        </button>
      </div>
      <div class="text-right w-24">
        <div class="font-bold">{{ formatPrice(totalPrice) }}</div>
        <button @click="removeItem" class="text-sm text-red-500 hover:underline flex items-center justify-end mt-1">
          <Icon icon="mdi:delete" class="w-4 h-4 mr-1" />
          Remove
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import type { CartItem } from '../../types/Cart';
import { useCartStore } from '../../stores/cart';

const props = defineProps<{
  item: CartItem
}>();

const cartStore = useCartStore();

const totalPrice = computed(() => {
  return props.item.product.price * props.item.quantity;
});

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
};

const increaseQuantity = () => {
  cartStore.updateQuantity(props.item.id, props.item.quantity + 1);
};

const decreaseQuantity = () => {
  if (props.item.quantity > 1) {
    cartStore.updateQuantity(props.item.id, props.item.quantity - 1);
  } else {
    // If quantity is 1, remove the item
    cartStore.removeFromCart(props.item.id);
  }
};

const removeItem = () => {
  cartStore.removeFromCart(props.item.id);
};
</script> 