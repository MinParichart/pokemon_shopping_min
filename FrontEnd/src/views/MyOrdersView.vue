<template>
  <div class="max-w-6xl mx-auto py-8">
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <!-- หัวการ์ด -->
      <div class="px-10 pt-6 pb-3 border-b border-slate-200/70">
        <h1 class="text-xl font-semibold">รายการสั่งซื้อของฉัน</h1>
      </div>

      <!-- แถบสถานะ -->
      <div class="px-10 pt-4 pb-4 border-b border-slate-200/70">
        <div class="flex text-sm rounded-lg overflow-hidden bg-slate-100">
          <button v-for="tab in tabs" :key="tab.value" class="flex-1 py-2 text-center" :class="tab.value === currentStatus
              ? 'bg-emerald-500 text-white font-medium'
              : 'bg-slate-100 text-slate-600'
            " @click="currentStatus = tab.value">
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Loading / Empty -->
      <div v-if="loading" class="px-10 py-6 text-sm text-slate-500">
        กำลังโหลด...
      </div>
      <div v-else-if="filteredOrders.length === 0" class="px-10 py-6 text-sm text-slate-500">
        ยังไม่มีคำสั่งซื้อในสถานะนี้
      </div>

      <!-- ตารางคำสั่งซื้อ -->
      <div v-else>
        <!-- หัวตาราง -->
        <div
          class="grid grid-cols-[1.3fr_1.4fr_1fr_1fr_0.6fr] px-10 py-3 text-sm bg-white border-b border-slate-200/70">
          <div class="font-semibold text-left">รหัสการสั่งซื้อ</div>
          <div class="font-semibold text-center">จำนวนสินค้า</div>
          <div class="font-semibold text-center">ราคารวม</div>
          <div class="font-semibold text-center">สถานะ</div>
          <div></div>
        </div>

        <!-- แถวคำสั่งซื้อ -->
        <div v-for="order in filteredOrders" :key="order.id" class="border-b border-slate-200/70 last:border-b-0">
          <!-- แถวหลัก -->
          <div class="grid grid-cols-[1.3fr_1.4fr_1fr_1fr_0.6fr] px-10 py-3 items-center text-sm hover:bg-slate-50">
            <!-- รหัส -->
            <div class="text-left">
              {{ order.orderCode ?? order.id.toString().padStart(6, '0') }}
            </div>

            <!-- จำนวน -->
            <div class="text-center text-slate-700">
              {{ countItems(order) }} รายการ
              {{ countQuantity(order) }} ชิ้น
            </div>

            <!-- ราคารวม -->
            <div class="text-center font-semibold text-slate-800">
              ฿{{ order.totalAmount ?? calcTotal(order) }}
            </div>

            <!-- สถานะ -->
            <div class="text-center text-slate-700">
              {{ statusText(order.status) }}
            </div>

            <!-- ปุ่ม / ลูกศร -->
            <div class="flex justify-end items-center gap-3">
              <button v-if="order.status === 'PENDING'"
                class="px-4 py-1 rounded-lg bg-slate-100 text-xs text-slate-700 hover:bg-slate-200"
                @click.stop="cancelOrder(order.id)">
                ยกเลิกการสั่งซื้อ
              </button>

              <button class="text-slate-600 text-lg leading-none" @click.stop="toggleExpand(order.id)">
                <span v-if="expandedIds.has(order.id)">▴</span>
                <span v-else>▾</span>
              </button>
            </div>
          </div>

          <!-- รายละเอียดการสั่งซื้อ + สรุปราคา (แสดงเมื่อกดลูกศร) -->
          <div v-if="expandedIds.has(order.id)" class="px-10 pb-4 bg-white">
            <!-- รายละเอียดรายการสินค้า -->
            <div class="border-t border-slate-200/70 pt-3">
              <div v-for="detail in order.orderDetails" :key="detail.productId + '-' + detail.quantity"
                class="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
                <!-- ซ้าย: รูป + ชื่อ + หมวดหมู่ -->
                <div class="flex items-center gap-3">
                  <img v-if="detail.product?.imageUrl || detail.productImageUrl"
                    :src="detail.product?.imageUrl ?? detail.productImageUrl" alt="" class="w-10 h-10 object-contain" />
                  <div>
                    <div class="text-slate-800">
                      {{
                        detail.product?.name ??
                        detail.productName ??
                        'สินค้า #' + detail.productId
                      }}
                      <span class="text-slate-500">
                        x {{ detail.quantity }}
                      </span>
                    </div>
                    <div class="text-xs text-slate-400">
                      หมวดหมู่:
                      {{
                        detail.product?.category ??
                        detail.productCategory ??
                        'Pokemon'
                      }}
                    </div>
                  </div>
                </div>

                <!-- ขวา: ราคาแถวนี้ -->
                <div class="text-sm">
                  ฿{{
                    (detail.price ?? detail.product?.price ?? 0) *
                    detail.quantity
                  }}
                </div>
              </div>
            </div>

            <!-- แถวสรุปรวมด้านขวาล่าง -->
            <div class="flex justify-end mt-3 pt-2 border-t border-slate-200/70 text-sm">
              <span class="text-slate-600 mr-2">รวมทั้งหมด:</span>
              <span class="font-semibold text-emerald-600">
                ฿{{ order.totalAmount ?? calcTotal(order) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { Order, OrderStatus } from '../models/order.model';
import { ordersService } from '../services/orders.service';

const orders = ref<Order[]>([]);
const loading = ref(false);
const expandedIds = ref<Set<number>>(new Set());
const currentStatus = ref<'ALL' | OrderStatus>('ALL');

const tabs: { value: 'ALL' | OrderStatus; label: string }[] = [
  { value: 'ALL', label: 'ทั้งหมด' },
  { value: 'PENDING', label: 'รอการยืนยันคำสั่งซื้อ' },
  { value: 'CONFIRMED', label: 'ยืนยันคำสั่งซื้อ' },
  { value: 'REJECTED', label: 'ปฏิเสธคำสั่งซื้อ' },
  { value: 'CANCELLED', label: 'ยกเลิกคำสั่งซื้อ' }
];

onMounted(load);

async function load() {
  loading.value = true;
  try {
    const res = await ordersService.getOrders();
    console.log('orders from api >>>', JSON.stringify(res, null, 2));
    orders.value = res;
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

function countItems(order: Order): number {
  return order.orderDetails.length;
}

function countQuantity(order: Order): number {
  return order.orderDetails.reduce((sum, d) => sum + d.quantity, 0);
}

function statusText(status: OrderStatus): string {
  switch (status) {
    case 'PENDING':
      return 'รอการยืนยันคำสั่งซื้อ';
    case 'CONFIRMED':
      return 'ยืนยันคำสั่งซื้อ';
    case 'REJECTED':
      return 'ปฏิเสธคำสั่งซื้อ';
    case 'CANCELLED':
      return 'ยกเลิกคำสั่งซื้อ';
    default:
      return status;
  }
}

function toggleExpand(id: number) {
  const set = new Set(expandedIds.value);
  if (set.has(id)) set.delete(id);
  else set.add(id);
  expandedIds.value = set;
}

async function cancelOrder(id: number) {
  const ok = confirm('ต้องการยกเลิกคำสั่งซื้อนี้หรือไม่?');
  if (!ok) return;
  await ordersService.updateOrder(id, { status: 'CANCELLED' });
  await load();
}
</script>
