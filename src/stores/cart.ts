import { defineStore } from 'pinia';
import type { Cart, CartItem } from '../types/Cart';
import type { Product } from '../types/Product';
import { ref, computed } from 'vue';

export const useCartStore = defineStore('cart', () => {
  // Initialize cart from localStorage
  function initializeCart(): Cart {
    let initialCart: Cart = { items: [], totalCount: 0, totalPrice: 0 };
    const savedCart = localStorage.getItem('cart');
    
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart && Array.isArray(parsedCart.items)) {
          initialCart = parsedCart;
        } else {
          console.warn('Invalid cart data found in localStorage. Using empty cart.');
          localStorage.removeItem('cart');
        }
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
    
    return initialCart;
  }

  const cart = ref<Cart>(initializeCart());

  // Getters
  const totalCount = computed(() => cart.value.totalCount);
  const totalPrice = computed(() => cart.value.totalPrice);
  const items = computed(() => cart.value.items || []);

  // Actions
  function addToCart(product: Product, quantity: number = 1) {
    if (!Array.isArray(cart.value.items)) {
      cart.value.items = [];
      console.error('Cart items were not an array. Reinitialized.');
    }

    const existingItem = cart.value.items.find((item: CartItem) => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const newItem: CartItem = {
        id: Date.now(),
        product,
        quantity
      };
      cart.value.items.push(newItem);
    }
    
    updateTotals();
    saveCart();
  }
  
  function removeFromCart(itemId: number) {
    if (!Array.isArray(cart.value.items)) return;
    cart.value.items = cart.value.items.filter((item: CartItem) => item.id !== itemId);
    updateTotals();
    saveCart();
  }
  
  function updateQuantity(itemId: number, quantity: number) {
    if (!Array.isArray(cart.value.items)) return;
    const item = cart.value.items.find((item: CartItem) => item.id === itemId);
    if (item) {
      item.quantity = quantity;
      updateTotals();
      saveCart();
    }
  }
  
  function clearCart() {
    cart.value.items = [];
    updateTotals();
    saveCart();
  }
  
  function updateTotals() {
    if (!Array.isArray(cart.value.items)) {
      cart.value.items = [];
    }
    cart.value.totalCount = cart.value.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
    cart.value.totalPrice = cart.value.items.reduce(
      (sum: number, item: CartItem) => sum + (item.product.price * item.quantity), 0
    );
  }
  
  function saveCart() {
    if (cart.value && Array.isArray(cart.value.items)) {
      // save whole cart object, cause products can be changed
      localStorage.setItem('cart', JSON.stringify(cart.value));
    } else {
      console.error('Attempted to save invalid cart data.');
    }
  }

  return {
    cart,
    totalCount,
    totalPrice,
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    updateTotals,
    saveCart
  };
}); 