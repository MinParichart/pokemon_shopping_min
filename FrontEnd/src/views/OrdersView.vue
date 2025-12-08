<template>
  <div class="space-y-6 font-sans">
    <h1 class="text-2xl font-bold text-slate-800">จัดการการสั่งซื้อ</h1>

    <div class="bg-slate-200 p-1 rounded-lg border border-slate-200 flex w-full flex-wrap gap-1">
      <button v-for="tab in tabs" :key="tab.value"
        class="flex-1 text-center px-6 py-2 rounded-md text-sm font-extrabold transition-all duration-200" :class="tab.value === currentStatus
          ? 'bg-emerald-500 text-white shadow-sm'
          : 'text-slate-500 hover:bg-slate-50'" @click="currentStatus = tab.value">
        {{ tab.label }}
      </button>
    </div>

    <div class="flex gap-3">
      <button @click="bulkUpdateStatus('CONFIRM')"
        class="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="selectedIds.length === 0">
        <span class="material-symbols-outlined text-[18px]">check_circle</span>
        ยืนยันการสั่งซื้อ
        <span v-if="selectedIds.length > 0" class="ml-1 text-xs bg-white/20 px-1.5 rounded-full">
          {{ selectedIds.length }}
        </span>
      </button>

      <button @click="bulkUpdateStatus('REJECT')"
        class="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="selectedIds.length === 0">
        <span class="material-symbols-outlined text-[18px]">cancel</span>
        ปฏิเสธการสั่งซื้อ
        <span v-if="selectedIds.length > 0" class="ml-1 text-xs bg-white/20 px-1.5 rounded-full">
          {{ selectedIds.length }}
        </span>
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
            <th class="px-6 py-4 w-10">
              <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll"
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
                <input type="checkbox" v-model="selectedIds" :value="order.id"
                  class="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer" />
              </td>
              <td class="px-6 py-4 font-medium text-slate-700">
                {{ order.orderCode ?? String(order.id).padStart(6, '0') }}
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-col text-sm">
                  <span class="font-bold text-emerald-600">
                    {{ order.user?.username ?? '-' }}
                  </span>
                  <span class="text-slate-500 text-xs">
                    Username : {{ order.user?.username ?? '-' }}
                  </span>
                  <span class="text-slate-500 text-xs">
                    เบอร์โทรศัพท์ : {{ order.user?.phone || '-' }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 text-center text-sm text-slate-600">
                {{ order.orderDetails.length }} รายการ {{ countTotalItems(order) }} ชิ้น
              </td>
              <td class="px-6 py-4 text-right font-semibold text-slate-500">
                {{ formatCurrency(order.totalAmount ?? calcTotal(order)) }}
              </td>
              <td class="px-6 py-4 text-center">
                <span class="text-sm font-medium" :class="getStatusColor(order.status)">
                  {{ getStatusLabel(order.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-center text-slate-400">
                <span class="material-symbols-outlined transition-transform duration-300"
                  :class="{ 'rotate-180': expandedOrders.has(order.id) }">
                  keyboard_arrow_down
                </span>
              </td>
            </tr>

            <tr v-if="expandedOrders.has(order.id)" class="bg-slate-50/50">
              <td colspan="7" class="py-4 border-t border-slate-100 shadow-inner">
                <div class="space-y-3 mx-20">
                  <p class="text-xs font-semibold text-slate-500 mb-2">รายละเอียดการสั่งซื้อ</p>

                  <div v-for="(detail, index) in order.orderDetails" :key="index"
                    class="flex items-center justify-between py-2 border-b border-slate-200/60 last:border-0">
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 bg-white rounded border border-slate-200 p-1">
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
                      </div>
                    </div>
                    <div class="text-sm font-medium text-slate-500">
                      {{ formatCurrency((detail.price ?? detail.product?.price ?? 0) * detail.quantity) }}
                    </div>
                  </div>

                  <div class="flex justify-end items-center pt-2 gap-2 text-sm">
                    <span class="text-slate-500">รวมทั้งหมด:</span>
                    <span class="text-lg font-bold text-emerald-600">
                      {{ formatCurrency(order.totalAmount ?? calcTotal(order)) }}
                    </span>
                  </div>

                  <div v-if="order.status === 'pending' || order.status === 'PENDING'"
                    class="flex justify-end gap-3 pt-4">
                    <button @click="updateStatus(order.id, 'CONFIRM')"
                      class="text-emerald-600 hover:underline text-sm font-medium">
                      ยืนยัน
                    </button>
                    <button @click="updateStatus(order.id, 'REJECT')"
                      class="text-red-500 hover:underline text-sm font-medium">
                      ปฏิเสธ
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>

      <div v-if="filteredOrders.length === 0" class="text-center py-12 text-slate-500 text-sm">
        ไม่พบข้อมูลคำสั่งซื้อ
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { Order } from '../models/order.model';
import { ordersService } from '../services/orders.service';

// --- State ---
const orders = ref<Order[]>([]);
const loading = ref(false);
const currentStatus = ref<'ALL' | string>('ALL');
const expandedOrders = ref(new Set<number>());
const selectedIds = ref<number[]>([]);

// --- Configuration ---
// แก้ไข Value ให้ตรงกับ Backend (CONFIRM, REJECT ไม่มี -ED)
const tabs = [
  { value: 'ALL', label: 'ทั้งหมด' },
  { value: 'PENDING', label: 'รอการยืนยันคำสั่งซื้อ' },
  { value: 'CONFIRM', label: 'ยืนยันคำสั่งซื้อ' },
  { value: 'REJECT', label: 'ปฏิเสธคำสั่งซื้อ' },
  { value: 'CANCELLED', label: 'ยกเลิกคำสั่งซื้อ' },
];

// --- Lifecycle ---
onMounted(load);

async function load() {
  loading.value = true;
  try {
    orders.value = await ordersService.getOrders();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

// --- Computed Properties ---
const filteredOrders = computed(() => {
  if (currentStatus.value === 'ALL') return orders.value;
  // ใช้ toUpperCase() เพื่อเทียบค่าให้ตรงกันไม่ว่า Backend จะส่งตัวเล็กหรือใหญ่มา
  return orders.value.filter((o) => o.status?.toUpperCase() === currentStatus.value);
});

const isAllSelected = computed(() => {
  if (filteredOrders.value.length === 0) return false;
  return filteredOrders.value.every(order => selectedIds.value.includes(order.id));
});

// --- Methods: UI Interaction ---
function toggleSelectAll() {
  if (isAllSelected.value) {
    selectedIds.value = [];
  } else {
    selectedIds.value = filteredOrders.value.map(order => order.id);
  }
}

function toggleExpand(id: number) {
  if (expandedOrders.value.has(id)) {
    expandedOrders.value.delete(id);
  } else {
    expandedOrders.value.add(id);
  }
}

// --- Methods: Formatters ---
function calcTotal(order: Order): number {
  if (order.totalAmount) return order.totalAmount;
  return order.orderDetails.reduce((sum, d) => {
    const price = d.price ?? d.product?.price ?? 0;
    return sum + price * d.quantity;
  }, 0);
}

function countTotalItems(order: Order): number {
  return order.orderDetails.reduce((sum, d) => sum + d.quantity, 0);
}

function formatCurrency(val: number): string {
  return '฿' + val.toLocaleString();
}

function getStatusColor(status: string): string {
  switch (status?.toUpperCase()) {
    case 'PENDING': return 'text-yellow-500';
    case 'CONFIRM': return 'text-emerald-600';
    case 'REJECT': return 'text-red-500';
    case 'CANCELLED': return 'text-slate-400';
    default: return 'text-slate-600';
  }
}

function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    'PENDING': 'รอการยืนยันคำสั่งซื้อ',
    'CONFIRM': 'ยืนยันคำสั่งซื้อ',
    'REJECT': 'ปฏิเสธคำสั่งซื้อ',
    'CANCELLED': 'ยกเลิกคำสั่งซื้อ',
  };
  return map[status?.toUpperCase()] || status;
}

// --- Methods: API Actions ---

// อัปเดตรายการเดียว
async function updateStatus(id: number, status: string) {
  // status input: 'CONFIRM' หรือ 'REJECT'
  const action = status === 'CONFIRM' ? 'ยืนยัน' : 'ปฏิเสธ';
  if (!confirm(`ยืนยันการ${action}คำสั่งซื้อนี้?`)) return;

  try {
    // ส่งค่าตัวพิมพ์เล็กไปหา Backend ('confirm' หรือ 'reject')
    await ordersService.updateOrder(id, { status: status.toLowerCase() });
    await load();
  } catch (error) {
    console.error(error);
    alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
  }
}

// อัปเดตหลายรายการ (Bulk)
async function bulkUpdateStatus(status: string) {
  if (selectedIds.value.length === 0) {
    alert('กรุณาเลือกรายการคำสั่งซื้อก่อน');
    return;
  }

  const action = status === 'CONFIRM' ? 'ยืนยัน' : 'ปฏิเสธ';
  if (!confirm(`คุณต้องการ${action}คำสั่งซื้อจำนวน ${selectedIds.value.length} รายการ หรือไม่?`)) {
    return;
  }

  loading.value = true;
  try {
    // วนลูปส่งค่าตัวพิมพ์เล็กไปหา Backend
    await Promise.all(
      selectedIds.value.map(id => ordersService.updateOrder(id, { status: status.toLowerCase() }))
    );

    alert(`ดำเนินการ${action}เรียบร้อยแล้ว`);
    selectedIds.value = []; // เคลียร์รายการที่เลือก
    await load();
  } catch (error) {
    console.error(error);
    alert('เกิดข้อผิดพลาดในการอัปเดตสถานะบางรายการ');
  } finally {
    loading.value = false;
  }
}
</script>