<template>
  <div>
    <h1 class="text-2xl font-semibold mb-4">จัดการการสั่งซื้อ</h1>

    <div class="flex gap-2 mb-4 text-sm">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="px-3 py-1 rounded-full border"
        :class="
          tab.value === currentStatus
            ? 'bg-emerald-500 text-white border-emerald-500'
            : 'bg-white'
        "
        @click="currentStatus = tab.value"
      >
        {{ tab.label }}
      </button>
    </div>

    <div v-if="loading" class="text-sm text-slate-500">กำลังโหลด...</div>

    <div v-else class="space-y-4">
      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="bg-white border border-gray-200 rounded-xl shadow-sm border p-4"
      >
        <div class="flex justify-between text-sm mb-2">
          <div>
            <div class="font-medium">
              รหัสคำสั่งซื้อ: {{ order.orderCode ?? order.id }}
            </div>
            <div class="text-xs text-slate-400">
              ผู้ใช้: {{ order.username ?? '-' }}
              <span v-if="order.fullName"> ({{ order.fullName }})</span>
            </div>
            <div class="text-xs text-slate-400">
              ที่อยู่: {{ order.shippingAddress }}
            </div>
          </div>
          <div class="text-right">
            <div class="text-xs mb-1">
              สถานะ:
              <span class="font-semibold">{{ order.status }}</span>
            </div>
            <div class="font-semibold text-red-500">
              ฿{{ order.totalAmount ?? calcTotal(order) }}
            </div>
          </div>
        </div>

        <div class="border-t mt-2 pt-2 text-sm">
          <div
            v-for="detail in order.orderDetails"
            :key="detail.productId + '-' + detail.quantity"
            class="flex justify-between py-1"
          >
            <div>
              {{ detail.product?.name ?? 'สินค้า #' + detail.productId }} x
              {{ detail.quantity }}
            </div>
            <div>
              ฿{{
                (detail.price ?? detail.product?.price ?? 0) * detail.quantity
              }}
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-3 text-xs">
          <button
            v-if="order.status === 'PENDING'"
            class="px-3 py-1 rounded bg-emerald-500 text-white"
            @click="updateStatus(order.id, 'CONFIRMED')"
          >
            ยืนยันคำสั่งซื้อ
          </button>
          <button
            v-if="order.status === 'PENDING'"
            class="px-3 py-1 rounded bg-red-500 text-white"
            @click="updateStatus(order.id, 'REJECTED')"
          >
            ปฏิเสธคำสั่งซื้อ
          </button>
        </div>
      </div>

      <div v-if="filteredOrders.length === 0" class="text-sm text-slate-500">
        ไม่พบคำสั่งซื้อในสถานะนี้
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { Order } from '../models/order.model';
import { ordersService } from '../services/orders.service';

const orders = ref<Order[]>([]);
const loading = ref(false);
const currentStatus = ref<'ALL' | string>('ALL');

const tabs = [
  { value: 'ALL', label: 'ทั้งหมด' },
  { value: 'PENDING', label: 'รอการยืนยันคำสั่งซื้อ' },
  { value: 'CONFIRMED', label: 'ยืนยันคำสั่งซื้อ' },
  { value: 'REJECTED', label: 'ปฏิเสธคำสั่งซื้อ' },
  { value: 'CANCELLED', label: 'ยกเลิกคำสั่งซื้อ' },
];

onMounted(load);

async function load() {
  loading.value = true;
  try {
    orders.value = await ordersService.getOrders();
  } finally {
    loading.value = false;
  }
}

const filteredOrders = computed(() => {
  if (currentStatus.value === 'ALL') return orders.value;
  return orders.value.filter((o) => o.status === currentStatus.value);
});

function calcTotal(order: Order): number {
  return order.orderDetails.reduce((sum, d) => {
    const price = d.price ?? d.product?.price ?? 0;
    return sum + price * d.quantity;
  }, 0);
}

async function updateStatus(id: number, status: string) {
  if (!confirm('ยืนยันการเปลี่ยนสถานะคำสั่งซื้อหรือไม่?')) return;
  await ordersService.updateOrder(id, { status });
  await load();
}
</script>
