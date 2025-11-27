<template>
  <div>
    <h1 class="text-2xl font-semibold mb-6">รายการสั่งซื้อของฉัน</h1>

    <div v-if="loading" class="text-sm text-slate-500">กำลังโหลด...</div>
    <div v-else-if="orders.length === 0" class="text-sm text-slate-500">
      ยังไม่มีคำสั่งซื้อ
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-white rounded-xl shadow-sm border p-4"
      >
        <div class="flex justify-between text-sm mb-2">
          <div>
            <div class="font-medium">
              รหัสคำสั่งซื้อ: {{ order.orderCode ?? order.id }}
            </div>
            <div class="text-xs text-slate-400">
              ที่อยู่จัดส่ง: {{ order.shippingAddress }}
            </div>
          </div>
          <div class="text-right">
            <div class="text-xs uppercase mb-1">
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ordersService } from '../services/orders.service';
import type { Order } from '../models/order.model';

const orders = ref<Order[]>([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    orders.value = await ordersService.getOrders();
  } finally {
    loading.value = false;
  }
});

function calcTotal(order: Order): number {
  return order.orderDetails.reduce((sum, d) => {
    const price = d.price ?? d.product?.price ?? 0;
    return sum + price * d.quantity;
  }, 0);
}
</script>
