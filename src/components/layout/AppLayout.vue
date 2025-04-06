<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-blue-700 text-white shadow-xl fixed top-0 left-0 right-0 z-50">
      <div class="w-full max-w-6xl mx-auto py-4 px-4 flex justify-between items-center">
        <router-link to="/" class="text-xl font-bold flex items-center">
          <Icon icon="mdi:shopping" class="mr-2 text-white w-8 h-8" />
          Ecwid Shop
        </router-link>
        <div class="flex items-center space-x-4">
          <router-link to="/cart" class="relative hover:opacity-80 transition-opacity">
            <CartIcon />
          </router-link>
        </div>
      </div>
    </header>

    <main class="w-full max-w-6xl mx-auto flex-grow p-4 mt-16">
      <slot></slot>
    </main>

    <footer class="w-full bg-gray-200 py-4 text-center text-gray-600 mt-20">
      <div class="w-full max-w-6xl mx-auto px-4">
        <p>&copy; 2025 Ecwid Shop. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import CartIcon from '../cart/CartIcon.vue';
</script> 