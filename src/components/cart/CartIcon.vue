<template>
  <div class="relative">
    <Icon icon="mdi:cart" class="w-10 h-10 text-white" />
    <span v-if="totalCount > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
      {{ displayCount }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import { useCartStore } from '../../stores/cart';

const cartStore = useCartStore();

const totalCount = computed(() => cartStore.totalCount);

const displayCount = computed(() => {
  return totalCount.value > 99 ? '99+' : totalCount.value;
});
</script> 