<template>
  <div class="max-w-6xl mx-auto py-8 font-sans">
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-slate-800">รายการสั่งซื้อของฉัน</h1>

      <div class="bg-slate-200 p-1 rounded-lg border border-slate-200 flex w-full flex-wrap gap-1">
        <button v-for="tab in tabs" :key="tab.value"
          class="flex-1 text-center px-6 py-2 rounded-md text-sm font-extrabold transition-all duration-200" :class="tab.value === currentStatus
            ? 'bg-emerald-500 text-white shadow-sm'
            : 'text-slate-500 hover:bg-slate-50'" @click="currentStatus = tab.value">
          {{ tab.label }}
        </button>
      </div>

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
                  <div class="text-xs text-slate-400 font-normal mt-0.5">
                  </div>
                </td>

                <td class="px-6 py-4 text-center text-sm text-slate-600">
                  {{ countItems(order) }} รายการ {{ countQuantity(order) }} ชิ้น
                </td>

                <td class="px-6 py-4 text-right font-semibold text-slate-700">
                  {{ formatCurrency(order.totalAmount ?? calcTotal(order)) }}
                </td>

                <td class="px-6 py-4 text-center">
                  <span class="text-sm font-medium" :class="getStatusColor(order.status)">
                    {{ getStatusLabel(order.status) }}
                  </span>
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
                        <div class="w-12 h-12 bg-white rounded border border-slate-200 p-1">
                          <img :src="detail.product?.imageUrl || detail.productImageUrl || 'https://placehold.co/50'"
                            class="w-full h-full object-contain" />
                        </div>
                        <div class="flex flex-col">
                          <span class="text-sm font-medium text-slate-700">
                            {{ detail.product?.name ?? detail.productName }}
                          </span>
                          <span class="text-xs text-slate-400">
                            หมวดหมู่: {{ detail.product?.category ?? detail.productCategory ?? 'Pokemon' }}
                          </span>
                          <span class="text-xs text-slate-500 md:hidden">
                            x {{ detail.quantity }}
                          </span>
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="text-sm font-medium text-slate-600 hidden md:block">
                          x {{ detail.quantity }}
                        </div>
                        <div class="text-sm font-medium text-slate-700">
                          {{ formatCurrency((detail.price ?? detail.product?.price ?? 0) * detail.quantity) }}
                        </div>
                      </div>
                    </div>

                    <div class="flex justify-between items-center pt-2">
                      <div>
                        <button v-if="isPending(order.status)" @click.stop="cancelOrder(order.id)"
                          class="text-red-500 hover:text-red-700 text-sm font-medium underline decoration-red-200 hover:decoration-red-500 transition-all">
                          ยกเลิกคำสั่งซื้อ
                        </button>
                      </div>

                      <div class="flex items-center gap-2 text-sm">
                        <span class="text-slate-500">รวมทั้งหมด:</span>
                        <span class="text-lg font-bold text-emerald-600">
                          {{ formatCurrency(order.totalAmount ?? calcTotal(order)) }}
                        </span>
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
import type { Order } from '../models/order.model';
import { ordersService } from '../services/orders.service';

const orders = ref<Order[]>([]);
const loading = ref(false);
const expandedIds = ref<Set<number>>(new Set());
const currentStatus = ref<'ALL' | string>('ALL'); // เปลี่ยน type นิดหน่อยเพื่อความยืดหยุ่น

// 1. แก้ config Tabs ให้รอรับค่า 'CANCEL' (ไม่มี LED)
const tabs = [
  { value: 'ALL', label: 'ทั้งหมด' },
  { value: 'PENDING', label: 'รอการยืนยันคำสั่งซื้อ' },
  { value: 'CONFIRM', label: 'ยืนยันคำสั่งซื้อ' },
  { value: 'REJECT', label: 'ปฏิเสธคำสั่งซื้อ' },
  { value: 'CANCEL', label: 'ยกเลิกคำสั่งซื้อ' }, // 👈 แก้ตรงนี้: CANCELLED -> CANCEL
];

onMounted(load);

async function load() {
  loading.value = true;
  try {
    const res = await ordersService.getOrders();
    orders.value = res;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

function normalizeStatus(status?: string): string {
  return (status ?? '').toUpperCase();
}

const filteredOrders = computed(() => {
  if (currentStatus.value === 'ALL') return orders.value;
  return orders.value.filter(
    (o) => normalizeStatus(o.status) === currentStatus.value
  );
});

// Helpers
function calcTotal(order: Order): number {
  if (order.totalAmount) return order.totalAmount;
  return order.orderDetails.reduce((sum, d) => {
    const price = d.price ?? d.product?.price ?? 0;
    return sum + price * d.quantity;
  }, 0);
}

function countItems(order: Order): number {
  return order.orderDetails.length;
}

function countQuantity(order: Order): number {
  return order.orderDetails.reduce((sum, d) => sum + d.quantity, 0);
}

function formatCurrency(val: number): string {
  return '฿' + val.toLocaleString();
}

// 2. แก้สีสถานะ ให้เช็คกับ 'CANCEL'
function getStatusColor(status: string): string {
  switch (normalizeStatus(status)) {
    case 'PENDING': return 'text-yellow-600';
    case 'CONFIRM': return 'text-emerald-600';
    case 'REJECT': return 'text-red-500';
    case 'CANCEL': return 'text-red-700'; // 👈 แก้ตรงนี้
    default: return 'text-slate-600';
  }
}

// 3. แก้ข้อความสถานะ ให้เช็คกับ 'CANCEL'
function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    'PENDING': 'รอการยืนยันคำสั่งซื้อ',
    'CONFIRM': 'ยืนยันคำสั่งซื้อ',
    'REJECT': 'ปฏิเสธคำสั่งซื้อ',
    'CANCEL': 'ยกเลิกคำสั่งซื้อ', // 👈 แก้ตรงนี้
  };
  return map[normalizeStatus(status)] || status;
}

function isPending(status: string): boolean {
  return normalizeStatus(status) === 'PENDING';
}

function toggleExpand(id: number) {
  const set = new Set(expandedIds.value);
  if (set.has(id)) set.delete(id);
  else set.add(id);
  expandedIds.value = set;
}

// 4. แก้ฟังก์ชันยกเลิก ให้ส่ง 'cancel' และเพิ่ม Try-Catch
async function cancelOrder(id: number) {
  const ok = confirm('ต้องการยกเลิกคำสั่งซื้อนี้หรือไม่?');
  if (!ok) return;

  try {
    // 👇 ส่ง 'cancel' (กริยา) แทน 'cancelled'
    await ordersService.updateOrder(id, { status: 'cancel' });

    alert('ยกเลิกคำสั่งซื้อเรียบร้อยแล้ว');
    await load(); // โหลดข้อมูลใหม่
  } catch (error) {
    console.error(error);
    alert('เกิดข้อผิดพลาด: ไม่สามารถยกเลิกคำสั่งซื้อได้ (กรุณาเช็ค Console)');
  }
}
</script>