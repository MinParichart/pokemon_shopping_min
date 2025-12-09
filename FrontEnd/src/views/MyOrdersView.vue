<template>
  <div class="max-w-6xl mx-auto py-8 font-sans">
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-slate-800">รายการสั่งซื้อของฉัน</h1>

      <OrderTabs v-model="currentStatus" />

      <div v-if="loading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>

      <div v-else class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead
            class="bg-slate-50 border-b border-slate-200 text-sm text-slate-700 font-semibold uppercase tracking-wider">
            <tr>
              <th class="px-6 py-4 text-left">รหัสสั่งซื้อ</th>
              <th class="px-6 py-4 text-center">จำนวนสินค้า</th>
              <th class="px-6 py-4 text-right">ราคารวม</th>
              <th class="px-6 py-4 text-center">สถานะ</th>
              <th class="px-6 py-4 w-10"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <template v-for="order in filteredOrders" :key="order.id">
              <tr class="hover:bg-slate-50/50 transition-colors group cursor-pointer" @click="toggleExpand(order.id)">
                <td class="px-6 py-4 font-medium text-slate-700">
                  {{ order.orderCode ?? String(order.id).padStart(6, '0') }}
                </td>
                <td class="px-6 py-4 text-center text-sm text-slate-600">
                  {{ order.orderDetails.length }} รายการ
                </td>
                <td class="px-6 py-4 text-right font-semibold text-slate-700">
                  {{ formatCurrency(order.totalAmount ?? calcTotal(order)) }}
                </td>
                <td class="px-6 py-4 text-center">
                  <StatusBadge :status="order.status" />
                </td>
                <td class="px-6 py-4 text-center text-slate-400">
                  <span class="material-symbols-outlined transition-transform duration-300"
                    :class="{ 'rotate-180': expandedIds.has(order.id) }">
                    keyboard_arrow_down
                  </span>
                </td>
              </tr>

              <tr v-if="expandedIds.has(order.id)" class="bg-slate-50/50">
                <td colspan="5" class="py-4 border-t border-slate-100 shadow-inner">
                  <div class="space-y-3 mx-6 md:mx-20">
                    <p class="text-xs font-semibold text-slate-500 mb-2">รายละเอียดสินค้า</p>

                    <div v-for="(detail, index) in order.orderDetails" :key="index"
                      class="flex items-center justify-between py-2 border-b border-slate-200/60 last:border-0">
                      <div class="flex items-center gap-4">
                        <div
                          class="w-12 h-12 bg-white rounded border border-slate-200 p-1 flex items-center justify-center overflow-hidden">
                          <img
                            :src="detail.product?.imageUrl || detail.productImageUrl || 'https://placehold.co/50?text=NoImg'"
                            class="w-full h-full object-contain" />
                        </div>
                        <div class="flex flex-col">
                          <span class="text-sm font-medium text-slate-700">
                            {{ detail.product?.name ?? detail.productName ?? 'สินค้าไม่ระบุชื่อ' }}
                          </span>
                          <span class="text-xs text-slate-400">
                            หมวดหมู่: {{ detail.product?.category ?? 'ทั่วไป' }}
                          </span>
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="text-sm font-medium text-slate-600">x {{ detail.quantity }}</div>
                        <div class="text-sm font-medium text-slate-700">{{ formatCurrency((detail.price ?? 0) *
                          detail.quantity) }}</div>
                      </div>
                    </div>

                    <div class="flex justify-between items-center pt-2">
                      <button v-if="isPending(order.status)" @click.stop="cancelOrder(order.id)"
                        class="text-red-500 hover:text-red-700 text-sm font-medium underline">
                        ยกเลิกคำสั่งซื้อ
                      </button>
                      <div class="flex items-center gap-2 text-sm ml-auto">
                        <span class="text-slate-500">รวมทั้งหมด:</span>
                        <span class="text-lg font-bold text-emerald-600">{{ formatCurrency(order.totalAmount ??
                          calcTotal(order)) }}</span>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>

        <div v-if="filteredOrders.length === 0" class="text-center py-12 text-slate-500 text-sm">
          ไม่พบรายการสั่งซื้อในสถานะนี้
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import StatusBadge from '../components/common/StatusBadge.vue';
import OrderTabs from '../components/order/OrderTabs.vue';
import type { Order } from '../models/order.model';
import { ordersService } from '../services/orders.service';

const orders = ref<Order[]>([]);
const loading = ref(false);
const expandedIds = ref<Set<number>>(new Set());
const currentStatus = ref('ALL');

onMounted(async () => {
  loading.value = true;
  try { orders.value = await ordersService.getOrders(); } finally { loading.value = false; }
});

function isPending(status?: string) { return status?.toUpperCase() === 'PENDING'; }

const filteredOrders = computed(() => {
  if (currentStatus.value === 'ALL') return orders.value;
  return orders.value.filter((o) => (o.status ?? '').toUpperCase() === currentStatus.value);
});

function toggleExpand(id: number) {
  const set = new Set(expandedIds.value);
  if (set.has(id)) set.delete(id); else set.add(id);
  expandedIds.value = set;
}

function calcTotal(order: Order) {
  if (order.totalAmount) return order.totalAmount;
  return order.orderDetails.reduce((sum, d) => sum + (d.price ?? 0) * d.quantity, 0);
}

function formatCurrency(val: number) { return '฿' + val.toLocaleString(); }

async function cancelOrder(id: number) {
  if (!confirm('ต้องการยกเลิกคำสั่งซื้อนี้หรือไม่?')) return;
  try {
    await ordersService.updateOrder(id, { status: 'cancel' });
    alert('ยกเลิกคำสั่งซื้อเรียบร้อยแล้ว');
    const res = await ordersService.getOrders();
    orders.value = res;
  } catch (error) {
    alert('เกิดข้อผิดพลาดในการยกเลิก');
  }
}
</script>