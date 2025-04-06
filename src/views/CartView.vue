<template>
  <AppLayout>
    <h1 class="text-2xl font-bold mb-6 flex items-center w-full">
      <Icon icon="mdi:cart" class="mr-2" />
      Cart
    </h1>

    <div v-if="items.length === 0" class="flex flex-col items-center justify-center py-12 w-full">
      <Icon icon="mdi:cart-off" class="h-16 w-16 text-gray-400 mb-4" />
      <p class="text-gray-500 mb-6">Your cart is empty</p>
      <router-link to="/" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors flex items-center">
        <Icon icon="mdi:arrow-left" class="mr-2" />
        Go to catalog
      </router-link>
    </div>

    <div v-else class="w-full">
      <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6 w-full">
        <div class="flex flex-col w-full">
          <CartItem
            v-for="item in items"
            :key="item.id"
            :item="item"
          />
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 w-full">
        <div class="flex justify-between text-lg font-semibold mb-2">
          <span class="flex items-center">
            <Icon icon="mdi:package-variant" class="mr-2" />
            Items in cart:
          </span>
          <span>{{ totalCount }}</span>
        </div>
        <div class="flex justify-between text-lg font-bold mb-4">
          <span class="flex items-center">
            <Icon icon="mdi:cash" class="mr-2" />
            Total:
          </span>
          <span class="text-blue-600">{{ formatPrice(totalPrice) }}</span>
        </div>
        <div class="flex flex-col md:flex-row md:justify-between gap-4">
          <button
            @click="clearCart"
            class="w-full md:w-auto px-6 py-3 border border-red-500 text-red-500 rounded hover:bg-red-50 transition-colors flex items-center justify-center"
          >
            <Icon icon="mdi:delete" class="mr-2" />
            Clear cart
          </button>
          <button
            class="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
            @click="placeOrder"
          >
            <Icon icon="mdi:check-circle" class="mr-2" />
            Checkout
          </button>
        </div>
      </div>
    </div>

    <!-- Order confirmation popup -->
    <div v-if="showOrderPopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <div class="text-center">
          <Icon icon="mdi:check-circle" class="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 class="text-2xl font-bold mb-2">Thank you for your order!</h2>
          <p class="text-gray-600 mb-6">Your order has been successfully placed. You will receive a confirmation email shortly.</p>
          <button 
            @click="closeOrderPopup" 
            class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Continue shopping
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Icon } from '@iconify/vue';
import { useCartStore } from '../stores/cart';
import AppLayout from '../components/layout/AppLayout.vue';
import CartItem from '../components/cart/CartItem.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const cartStore = useCartStore();
const showOrderPopup = ref(false);

const items = computed(() => cartStore.items);
const totalCount = computed(() => cartStore.totalCount);
const totalPrice = computed(() => cartStore.totalPrice);

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
};

const clearCart = () => {
  if (confirm('Are you sure you want to clear your cart?')) {
    cartStore.clearCart();
  }
};

const placeOrder = () => {
  showOrderPopup.value = true;
  cartStore.clearCart();
  // send cart data to server
};

const closeOrderPopup = () => {
  showOrderPopup.value = false;
  router.push('/');
};
</script> 