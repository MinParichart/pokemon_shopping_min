<template>
  <div class="max-w-6xl mx-auto">
    <h1 class="text-2xl font-semibold mb-6">รถเข็น</h1>

    <div v-if="cart.items.length === 0" class="text-sm text-slate-500">ยังไม่มีสินค้าในรถเข็น</div>

    <div v-else class="space-y-6">
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="flex items-center justify-between px-6 pt-4 pb-3 text-sm border-b border-slate-200/70">
          <div class="flex items-center gap-2">
            <input type="checkbox" :checked="allSelected" @change="toggleSelectAll" class="cart-checkbox" />
            <span>เลือกทั้งหมด</span>
          </div>
          <div class="text-slate-400">{{ cart.items.length }} รายการ</div>
        </div>

        <table class="w-full text-sm">
          <thead class="bg-slate-50/80">
            <tr class="border-b border-slate-200/70">
              <th class="w-10"></th>
              <th class="text-left px-6 py-2">สินค้า</th>
              <th class="text-center px-4 py-2">ราคาต่อชิ้น</th>
              <th class="text-center px-4 py-2">จำนวน</th>
              <th class="text-center px-4 py-2">ราคารวม</th>
              <th class="text-center px-4 py-2"></th>
              <th class="text-center px-4 py-2">
                 <button class="text-slate-600 hover:underline disabled:text-slate-300" :disabled="cart.selectedItems.length === 0" @click="removeSelected">ลบที่เลือก</button>
              </th>
            </tr>
          </thead>
          <tbody>
            <CartItemRow v-for="item in cart.items" :key="item.product.id" :item="item" 
              @select="cart.toggleSelected" @changeQty="changeQty" @remove="cart.removeProduct" />
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-end gap-4">
        <div class="text-slate-600">รวม ({{ cart.selectedItems.length }} รายการ)</div>
        <span class="text-red-500 font-semibold text-xl">฿{{ formatPrice(cart.totalPrice) }}</span>
        <BaseButton :disabled="cart.selectedItems.length === 0" @click="openAddress">สั่งสินค้า</BaseButton>
      </div>
    </div>

    <BaseModal v-if="showAddress" title="ยืนยันการสั่งซื้อ" size="sm" @close="showAddress = false">
      <p class="text-sm mb-3 text-center">โปรดกรอกที่อยู่จัดส่งสินค้า</p>
      <BaseInput v-model="shippingAddress" type="textarea" placeholder="ที่อยู่จัดส่ง..." />
      <p v-if="error" class="mt-2 text-xs text-red-500">{{ error }}</p>
      
      <div class="flex justify-end gap-3 mt-4">
        <BaseButton variant="outline" @click="showAddress = false">ยกเลิก</BaseButton>
        <BaseButton :loading="loading" @click="confirmOrder">ยืนยัน</BaseButton>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { ordersService } from '../services/orders.service';
import { useCartStore } from '../stores/cart';
import CartItemRow from '../components/cart/CartItemRow.vue';
import BaseModal from '../components/common/BaseModal.vue';
import BaseButton from '../components/common/BaseButton.vue';
import BaseInput from '../components/common/BaseInput.vue';

const cart = useCartStore();
const showAddress = ref(false);
const shippingAddress = ref('');
const loading = ref(false);
const error = ref('');

const allSelected = computed(() => cart.items.length > 0 && cart.items.every((i) => i.selected));

function toggleSelectAll() { cart.setAllSelected(!allSelected.value); }
function changeQty(id: number, q: number) { cart.setQuantity(id, q); }
function removeSelected() { cart.selectedItems.forEach((i) => cart.removeProduct(i.product.id)); }
function openAddress() { showAddress.value = true; }

async function confirmOrder() {
  error.value = '';
  if (!shippingAddress.value.trim()) { error.value = 'กรุณากรอกที่อยู่'; return; }
  loading.value = true;
  try {
    const body = { shippingAddress: shippingAddress.value, orderDetails: cart.selectedItems.map((i) => ({ productId: i.product.id, quantity: i.quantity })) };
    await ordersService.createOrder(body);
    cart.clearCart(); showAddress.value = false;
  } catch (_e) { error.value = 'สั่งซื้อไม่สำเร็จ'; } finally { loading.value = false; }
}
function formatPrice(value: number) { return Number(value).toLocaleString('th-TH'); }
</script>

<style scoped>
/* Checkbox style if needed locally for header */
.cart-checkbox { width: 1.2rem; height: 1.2rem; border-radius: 0.4rem; cursor: pointer; border: 2px solid #10b981; appearance: none; }
.cart-checkbox:checked { background-color: #10b981; border-color: #10b981; background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M4 8.5L6.5 11L12 5' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e"); background-repeat: no-repeat; background-position: center; background-size: 80% 80%; }
</style>