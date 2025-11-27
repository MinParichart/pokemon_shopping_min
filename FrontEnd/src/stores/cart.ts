import { defineStore } from 'pinia';
import type { CartItem } from '../models/cart.model';
import type { Product } from '../models/product.model';

interface CartState {
  items: CartItem[];
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: []
  }),
  getters: {
    count(state): number {
      return state.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    selectedItems(state): CartItem[] {
      return state.items.filter((i) => i.selected);
    },
    totalPrice(state): number {
      return state.items.reduce(
        (sum, item) => sum + (item.selected ? item.product.price * item.quantity : 0),
        0
      );
    },
    totalSelectedQuantity(): number {
      return this.selectedItems.reduce((sum, i) => sum + i.quantity, 0);
    }
  },
  actions: {
    addProduct(product: Product) {
      const existing = this.items.find((i) => i.product.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        this.items.push({ product, quantity: 1, selected: true });
      }
    },
    removeProduct(productId: number) {
      this.items = this.items.filter((i) => i.product.id !== productId);
    },
    setQuantity(productId: number, quantity: number) {
      const item = this.items.find((i) => i.product.id === productId);
      if (!item) return;
      item.quantity = Math.max(1, quantity);
    },
    toggleSelected(productId: number) {
      const item = this.items.find((i) => i.product.id === productId);
      if (!item) return;
      item.selected = !item.selected;
    },
    setAllSelected(value: boolean) {
      this.items.forEach((i) => (i.selected = value));
    },
    clearCart() {
      this.items = [];
    }
  }
});
