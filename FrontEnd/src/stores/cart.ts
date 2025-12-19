import { defineStore } from 'pinia';
import type { CartItem } from '../models/cart.model';
import type { Product } from '../models/product.model';

interface CartState {
  items: CartItem[];
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
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
        (sum, item) =>
          sum + (item.selected ? item.product.price * item.quantity : 0),
        0
      );
    },
    totalSelectedQuantity(): number {
      return this.selectedItems.reduce((sum, i) => sum + i.quantity, 0);
    },
  },
  actions: {
    addProduct(product: Product): boolean {
      const item = this.items.find((i) => i.product.id === product.id);

      const currentQty = item?.quantity ?? 0;

      // ถ้าจำนวนในรถเข็น >= stock แล้ว ไม่ให้เพิ่ม
      if (currentQty >= product.stock) {
        return false;
      }

      if (item) {
        item.quantity++;
      } else {
        this.items.push({
          product,
          quantity: 1,
          selected: true,
        });
      }
      return true;
    },
    removeProduct(productId: number) {
      this.items = this.items.filter((i) => i.product.id !== productId);
    },
    setQuantity(productId: number, q: number) {
      const item = this.items.find((i) => i.product.id === productId);
      if (!item) return;

      // ลบถ้าใส่ 0 หรือติดลบ
      if (q <= 0) {
        this.items = this.items.filter((i) => i.product.id !== productId);
        return;
      }

      // ล็อกไม่ให้เกิน stock
      const max = item.product.stock;
      item.quantity = q > max ? max : q;
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
    },
  },
});
