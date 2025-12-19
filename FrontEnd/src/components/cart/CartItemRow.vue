<template>
  <tr class="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60">
    <td class="px-4 text-center align-middle">
      <input type="checkbox" :checked="item.selected" @change="$emit('select', item.product.id)"
        class="cart-checkbox" />
    </td>
    <td class="px-2 py-3">
      <div class="flex items-center gap-3">
        <img :src="item.product.imageUrl" :alt="item.product.name" class="w-24 h-24 object-contain" />
        <div>
          <div class="font-medium text-slate-800">{{ item.product.name }}</div>
          <div class="text-xs text-slate-400">{{ item.product.category }}</div>
        </div>
      </div>
    </td>
    <td class="px-4 text-center text-slate-500">฿{{ item.product.price }}</td>
    <td class="px-4 text-center">
      <div class="inline-flex items-center border border-slate-300 rounded-lg overflow-hidden">
        <button class="px-3 py-1 text-xl text-red-500 hover:bg-red-200"
          @click="$emit('changeQty', item.product.id, item.quantity - 1)">−</button>
        <span class="px-4 select-none">{{ item.quantity }}</span>
        <button class="px-3 py-1 text-xl text-green-500 hover:bg-green-200"
          @click="$emit('changeQty', item.product.id, item.quantity + 1)">+</button>
      </div>
    </td>
    <td class="px-4 text-center font-medium text-slate-500">฿{{ item.product.price * item.quantity }}</td>
    <td class="px-4 text-center">
      <button class="text-xs text-red-500 hover:text-red-600" @click="$emit('remove', item.product.id)">
        <span class="material-symbols-outlined">delete</span>
      </button>
    </td>
  </tr>
</template>

<script setup lang="ts">
defineProps<{ item: any }>(); // ใช้ type any หรือ import CartItem type ถ้าระบบมี
defineEmits(['select', 'changeQty', 'remove']);
</script>

<style scoped>
.cart-checkbox {
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 0.4rem;
  cursor: pointer;
  border: 2px solid #10b981;
  appearance: none;
}

.cart-checkbox:checked {
  background-color: #10b981;
  border-color: #10b981;
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M4 8.5L6.5 11L12 5' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 80% 80%;
}
</style>