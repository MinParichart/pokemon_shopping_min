<template>
  <div>
    <h1 class="text-2xl font-semibold mb-6">รถเข็น</h1>

    <div v-if="cart.items.length === 0" class="text-sm text-slate-500">
      ยังไม่มีสินค้าในรถเข็น
    </div>

    <div v-else class="space-y-4">
      <div class="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          :checked="allSelected"
          @change="toggleSelectAll"
        />
        <span>เลือกทั้งหมด</span>
      </div>

      <div class="bg-white rounded-xl shadow-sm border">
        <table class="w-full text-sm">
          <thead class="bg-slate-50">
            <tr>
              <th class="w-10"></th>
              <th class="text-left px-4 py-2">สินค้า</th>
              <th class="text-center px-4 py-2">ราคาต่อชิ้น</th>
              <th class="text-center px-4 py-2">จำนวน</th>
              <th class="text-center px-4 py-2">ราคารวม</th>
              <th class="w-16"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in cart.items"
              :key="item.product.id"
              class="border-t"
            >
              <td class="px-3 text-center">
                <input
                  type="checkbox"
                  :checked="item.selected"
                  @change="cart.toggleSelected(item.product.id)"
                />
              </td>
              <td class="px-4 py-3 flex items-center gap-3">
                <img
                  :src="item.product.imageUrl"
                  :alt="item.product.name"
                  class="w-10 h-10 object-contain"
                />
                <div>
                  <div class="font-medium">{{ item.product.name }}</div>
                  <div class="text-xs text-slate-400">
                    {{ item.product.category }}
                  </div>
                </div>
              </td>
              <td class="px-4 text-center">
                ฿{{ item.product.price }}
              </td>
              <td class="px-4 text-center">
                <div class="inline-flex items-center border rounded-lg">
                  <button
                    class="px-2 py-1 text-sm"
                    @click="changeQty(item.product.id, item.quantity - 1)"
                  >
                    -
                  </button>
                  <span class="px-3">{{ item.quantity }}</span>
                  <button
                    class="px-2 py-1 text-sm"
                    @click="changeQty(item.product.id, item.quantity + 1)"
                  >
                    +
                  </button>
                </div>
              </td>
              <td class="px-4 text-center">
                ฿{{ item.product.price * item.quantity }}
              </td>
              <td class="px-4 text-center">
                <button
                  class="text-xs text-red-500"
                  @click="cart.removeProduct(item.product.id)"
                >
                  ลบ
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between mt-4 text-sm">
        <div>
          รวม ( {{ cart.selectedItems.length }} รายการ
          {{ cart.totalSelectedQuantity }} ชิ้น )
        </div>
        <div class="flex items-center gap-4">
          <div>
            รวมทั้งหมด:
            <span class="text-red-500 font-semibold">฿{{ cart.totalPrice }}</span>
          </div>
          <button
            class="bg-emerald-500 text-white px-4 py-2 rounded-lg"
            @click="openAddress"
            :disabled="cart.selectedItems.length === 0"
          >
            สั่งสินค้า
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showAddress"
      class="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 class="text-lg font-semibold mb-4 text-center">ยืนยันการสั่งซื้อ</h2>
        <p class="text-sm mb-2">โปรดกรอกที่อยู่จัดส่งสินค้า</p>
        <textarea
          v-model="shippingAddress"
          rows="3"
          class="w-full border rounded-lg px-3 py-2 text-sm mb-4"
        ></textarea>
        <div class="flex justify-end gap-3">
          <button
            class="px-4 py-2 text-sm rounded-lg border"
            @click="showAddress = false"
          >
            ยกเลิก
          </button>
          <button
            class="px-4 py-2 text-sm rounded-lg bg-emerald-500 text-white"
            :disabled="loading"
            @click="confirmOrder"
          >
            {{ loading ? 'กำลังสั่งซื้อ...' : 'ยืนยัน' }}
          </button>
        </div>
        <p v-if="error" class="mt-2 text-xs text-red-500">
          {{ error }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCartStore } from '../stores/cart';
import { ordersService } from '../services/orders.service';

const cart = useCartStore();

const showAddress = ref(false);
const shippingAddress = ref('');
const loading = ref(false);
const error = ref('');

const allSelected = computed(
  () => cart.items.length > 0 && cart.items.every((i) => i.selected)
);

function toggleSelectAll() {
  cart.setAllSelected(!allSelected.value);
}

function changeQty(id: number, q: number) {
  cart.setQuantity(id, q);
}

function openAddress() {
  showAddress.value = true;
}

async function confirmOrder() {
  error.value = '';
  if (!shippingAddress.value.trim()) {
    error.value = 'กรุณากรอกที่อยู่จัดส่งสินค้า';
    return;
  }

  loading.value = true;
  try {
    const body = {
      shippingAddress: shippingAddress.value,
      orderDetails: cart.selectedItems.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity
      }))
    };
    await ordersService.createOrder(body);
    cart.clearCart();
    showAddress.value = false;
  } catch (_e) {
    error.value = 'สั่งซื้อไม่สำเร็จ';
  } finally {
    loading.value = false;
  }
}
</script>
