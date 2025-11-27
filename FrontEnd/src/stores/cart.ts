import { defineStore } from "pinia";
import type { Product, CartItem } from "../models/product.model";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [] as CartItem[],
  }),
  getters: {
    // คำนวณราคารวมของสินค้าทั้งหมดในตะกร้า
    count: (state) =>
      state.items.reduce((round, item) => round + item.quantity, 0),
    totalPrice: (state) =>
      state.items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      ),
  },
  actions: {
    // เพิ่มสินค้าลงในตะกร้า
    addToCart(product: Product, quantity: number) {
      const existingItem = this.items.find(
        (item) => item.product.id === product.id
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.items.push({ product, quantity });
      }
    },
    // ลบสินค้าจากตะกร้า
    removeFromCart(productId: number) {
      this.items = this.items.filter((item) => item.product.id !== productId);
    },
    // เคลียร์ตะกร้าสินค้า
    clearCart() {
      this.items = [];
    },
  },
});
