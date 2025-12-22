<template>
  <div class="space-y-6 font-sans">
    <h1 class="text-2xl font-bold text-slate-800">จัดการการสั่งซื้อ</h1>

    <OrderTabs v-model="currentStatus" @update:model-value="onTabChange" />

    <BulkActionBar :count="selectedIds.length" @confirm="bulkUpdateStatus('CONFIRM')"
      @reject="bulkUpdateStatus('REJECT')" />

    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
    </div>

    <div v-else class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead
          class="bg-slate-50 border-b border-slate-200 text-sm text-slate-700 font-semibold uppercase tracking-wider">
          <tr>
            <th class="px-6 py-4 w-10">
              <input v-if="selectableOrders.length > 0" type="checkbox" :checked="isAllSelected"
                @change="toggleSelectAll"
                class="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer" />
            </th>
            <th class="px-6 py-4">รหัสสั่งซื้อ</th>
            <th class="px-6 py-4">ผู้สั่งซื้อ</th>
            <th class="px-6 py-4 text-center">จำนวนสินค้า</th>
            <th class="px-6 py-4 text-right">ราคารวม</th>
            <th class="px-6 py-4 text-center">สถานะ</th>
            <th class="px-6 py-4 w-10"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <template v-for="order in filteredOrders" :key="order.id">
            <tr class="hover:bg-slate-50/50 transition-colors group cursor-pointer" @click="toggleExpand(order.id)">
              <td class="px-6 py-4" @click.stop>
                <input v-if="isPending(order.status)" type="checkbox" v-model="selectedIds" :value="order.id"
                  class="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer" />
              </td>
              <td class="px-6 py-4 font-medium text-slate-700">{{ order.orderCode ?? String(order.id).padStart(6, '0')
              }}</td>
              <td class="px-6 py-4">
                <div class="flex flex-col text-sm">
                  <span class="font-bold text-emerald-600">{{ order.user?.username ?? '-' }}</span>
                  <span class="text-slate-500 text-xs">{{ order.user?.phone || '-' }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-center text-sm text-slate-600">{{ order.orderDetails.length }} รายการ</td>
              <td class="px-6 py-4 text-right font-semibold text-slate-500">{{ formatCurrency(order.totalAmount ??
                calcTotal(order)) }}</td>
              <td class="px-6 py-4 text-center">
                <StatusBadge :status="order.status" />
              </td>
              <td class="px-6 py-4 text-center text-slate-400">
                <span class="material-symbols-outlined transition-transform duration-300"
                  :class="{ 'rotate-180': expandedOrders.has(order.id) }">keyboard_arrow_down</span>
              </td>
            </tr>
            <tr v-if="expandedOrders.has(order.id)" class="bg-slate-50/50">
              <td colspan="7" class="py-4 border-t border-slate-100 shadow-inner">
                <div class="space-y-3 mx-20">
                  <div v-for="(detail, index) in order.orderDetails" :key="index"
                    class="flex items-center justify-between py-2 border-b border-slate-200/60 last:border-0">
                    <div class="flex items-center gap-4">
                      <img :src="detail.productImageUrl" class="w-10 h-10 object-contain bg-white rounded border p-1" />
                      <div>
                        <span class="text-sm font-medium">{{ detail.productName }}</span>
                        <div class="text-xs text-slate-400">x {{ detail.quantity }}</div>
                      </div>
                    </div>
                    <div class="text-sm font-medium text-slate-500">{{ formatCurrency((detail.price ?? 0) *
                      detail.quantity) }}</div>
                  </div>
                  <div v-if="isPending(order.status)" class="flex justify-end gap-3 pt-4">
                    <BaseButton variant="text-primary" @click="updateStatus(order.id, 'CONFIRM')">ยืนยัน</BaseButton>
                    <BaseButton variant="text-danger" @click="updateStatus(order.id, 'REJECT')">ปฏิเสธ</BaseButton>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import BaseButton from '../components/common/BaseButton.vue';
import StatusBadge from '../components/common/StatusBadge.vue';
import BulkActionBar from '../components/order/BulkActionBar.vue';
import OrderTabs from '../components/order/OrderTabs.vue';
import type { Order } from '../models/order.model';
import { ordersService } from '../services/orders.service';

const orders = ref<Order[]>([]);
const loading = ref(false);
const currentStatus = ref('ALL');
const expandedOrders = ref(new Set<number>());
const selectedIds = ref<number[]>([]);

onMounted(async () => {
  loading.value = true;
  orders.value = await ordersService.getOrders();
  loading.value = false;
});

function onTabChange() { selectedIds.value = []; }
function isPending(s?: string) { return s?.toUpperCase() === 'PENDING'; }
const filteredOrders = computed(() => currentStatus.value === 'ALL' ? orders.value : orders.value.filter(o => o.status?.toUpperCase() === currentStatus.value));
const selectableOrders = computed(() => filteredOrders.value.filter(o => isPending(o.status)));
const isAllSelected = computed(() => selectableOrders.value.length > 0 && selectableOrders.value.every(o => selectedIds.value.includes(o.id)));

function toggleSelectAll() {
  selectedIds.value = isAllSelected.value ? [] : selectableOrders.value.map(o => o.id);
}
function toggleExpand(id: number) {
  if (expandedOrders.value.has(id)) expandedOrders.value.delete(id); else expandedOrders.value.add(id);
}
function calcTotal(o: Order) { return o.orderDetails.reduce((sum, d) => sum + (d.price ?? 0) * d.quantity, 0); }
function countTotalItems(o: Order) { return o.orderDetails.reduce((sum, d) => sum + d.quantity, 0); }
function formatCurrency(v: number) { return '฿' + v.toLocaleString(); }

async function updateStatus(id: number, status: string) {
  if (!confirm(`ยืนยัน?`)) return;
  await ordersService.updateOrder(id, { status: status.toLowerCase() });
  orders.value = await ordersService.getOrders();
}
async function bulkUpdateStatus(status: string) {
  if (!selectedIds.value.length) return;
  if (!confirm(`ยืนยัน ${selectedIds.value.length} รายการ?`)) return;
  loading.value = true;
  await Promise.all(selectedIds.value.map(id => ordersService.updateOrder(id, { status: status.toLowerCase() })));
  selectedIds.value = [];
  orders.value = await ordersService.getOrders();
  loading.value = false;
}
</script>