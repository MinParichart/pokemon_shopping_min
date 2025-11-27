<template>
  <div class="max-w-6xl mx-auto">
    <h1 class="text-2xl font-semibold mb-6">รถเข็น</h1>

    <!-- ถ้าไม่มีสินค้า -->
    <div v-if="cart.items.length === 0" class="text-sm text-slate-500">
      ยังไม่มีสินค้าในรถเข็น
    </div>

    <!-- ถ้ามีสินค้า -->
    <div v-else class="space-y-6">
      <!-- การ์ดรถเข็นหลัก -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <!-- แถวบนสุดในการ์ด : เลือกทั้งหมด + จำนวนรายการ -->
        <div class="flex items-center justify-between px-6 pt-4 pb-3 text-sm border-b border-slate-200/70">
          <div class="flex items-center gap-2">
            <input type="checkbox" :checked="allSelected" @change="toggleSelectAll" class="cart-checkbox" />
            <span>เลือกทั้งหมด</span>
          </div>

          <div class="text-slate-400">{{ cart.items.length }} รายการ</div>
        </div>

        <!-- ตารางรายการสินค้า -->
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
                <div class="flex items-center gap-2 text-slate-600">
                  <div class="flex items-center gap-2 text-slate-600">
                    <span class="inline-block w-2 h-2 rounded-full bg-red-500" />
                    <button type="button" class="hover:underline disabled:text-slate-300"
                      :disabled="cart.selectedItems.length === 0" @click="removeSelected">
                      ลบที่เลือก
                    </button>
                  </div>
                </div>
              </th>
              <th class="w-16"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cart.items" :key="item.product.id"
              class="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60">
              <!-- checkbox เลือก -->
              <td class="px-4 text-center align-middle">
                <input type="checkbox" :checked="item.selected" @change="cart.toggleSelected(item.product.id)"
                  class="cart-checkbox" />
              </td>

              <!-- รูป + ชื่อสินค้า -->
              <td class="px-2 py-3">
                <div class="flex items-center gap-3">
                  <img :src="item.product.imageUrl" :alt="item.product.name" class="w-24 h-24 object-contain" />
                  <div>
                    <div class="font-medium text-slate-800">
                      {{ item.product.name }}
                    </div>
                    <div class="text-xs text-slate-400">
                      {{ item.product.category }}
                    </div>
                  </div>
                </div>
              </td>

              <!-- ราคาต่อชิ้น -->
              <td class="px-4 text-center text-slate-500">
                ฿{{ item.product.price }}
              </td>

              <!-- จำนวน -->
              <td class="px-4 text-center">
                <div class="inline-flex items-center border border-slate-300 rounded-lg overflow-hidden">
                  <button class="px-3 py-1 text-xl text-red-500  hover:bg-red-200"
                    @click="changeQty(item.product.id, item.quantity - 1)">
                    −
                  </button>
                  <span class="px-4 select-none">
                    {{ item.quantity }}
                  </span>
                  <button class="px-3 py-1 text-xl text-green-500 hover:bg-green-200"
                    @click="changeQty(item.product.id, item.quantity + 1)">
                    +
                  </button>
                </div>
              </td>

              <!-- ราคารวมต่อแถว -->
              <td class="px-4 text-center font-medium text-slate-500">
                ฿{{ item.product.price * item.quantity }}
              </td>

              <!-- ปุ่มลบ -->
              <td></td>
              <td class="px-4 text-center">
                <button class="text-xs text-red-500 hover:text-red-600" @click="cart.removeProduct(item.product.id)">
                  <span class="material-symbols-outlined"> delete </span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- แถบด้านล่างแบบในดีไซน์เดิม -->
      <div class="flex items-center justify-between text-sm px-1 sm:px-0 mt-2">
        <!-- ซ้าย: เลือกทั้งหมด + ลบที่เลือก (เหมือนแถบล่างในรูปแรก) -->
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-2 text-slate-600"></div>
        </div>

        <!-- ขวา: สรุปยอดรวม + ปุ่มสั่งสินค้า -->
        <div class="flex items-center gap-4">
          <div class="text-slate-600">
            รวม
            <span class="mx-1">
              ( {{ cart.selectedItems.length }} รายการ
              {{ cart.totalSelectedQuantity }} ชิ้น )
            </span>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-red-500 font-semibold text-xl">
              ฿{{ cart.totalPrice }}
            </span>
            <button
              class="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm disabled:bg-emerald-300"
              @click="openAddress" :disabled="cart.selectedItems.length === 0">
              สั่งสินค้า
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal กรอกที่อยู่จัดส่ง -->
    <div v-if="showAddress" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
        <h2 class="text-lg font-semibold mb-2 text-center">
          ยืนยันการสั่งซื้อ
        </h2>
        <p class="text-sm mb-3 text-center">โปรดกรอกที่อยู่จัดส่งสินค้า</p>
        <textarea v-model="shippingAddress" rows="3" class="w-full border rounded-lg px-3 py-2 text-sm mb-4"></textarea>
        <div class="flex justify-end gap-3">
          <button class="px-4 py-2 text-sm rounded-lg border border-slate-300 hover:bg-slate-50"
            @click="showAddress = false">
            ยกเลิก
          </button>
          <button
            class="px-4 py-2 text-sm rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 disabled:bg-emerald-300"
            :disabled="loading" @click="confirmOrder">
            {{ loading ? "กำลังสั่งซื้อ..." : "ยืนยัน" }}
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
import { computed, ref } from "vue";
import { ordersService } from "../services/orders.service";
import { useCartStore } from "../stores/cart";

const cart = useCartStore();

const showAddress = ref(false);
const shippingAddress = ref("");
const loading = ref(false);
const error = ref("");

// checkbox “เลือกทั้งหมด” (ด้านบน + ด้านล่างใช้ตัวเดียวกัน)
const allSelected = computed(
  () => cart.items.length > 0 && cart.items.every((i) => i.selected)
);

function toggleSelectAll() {
  cart.setAllSelected(!allSelected.value);
}

function changeQty(id: number, q: number) {
  cart.setQuantity(id, q);
}

// ลบสินค้าเฉพาะที่เลือก
function removeSelected() {
  cart.selectedItems.forEach((i) => {
    cart.removeProduct(i.product.id);
  });
}

function openAddress() {
  showAddress.value = true;
}

async function confirmOrder() {
  error.value = "";
  if (!shippingAddress.value.trim()) {
    error.value = "กรุณากรอกที่อยู่จัดส่งสินค้า";
    return;
  }

  loading.value = true;
  try {
    const body = {
      shippingAddress: shippingAddress.value,
      orderDetails: cart.selectedItems.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity,
      })),
    };
    await ordersService.createOrder(body);
    cart.clearCart();
    showAddress.value = false;
  } catch (_e) {
    error.value = "สั่งซื้อไม่สำเร็จ";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.cart-checkbox {
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 0.4rem;

  /* ปิด style default ของ browser */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  cursor: pointer;
  border: 2px solid #10b981;
  /* สีกรอบ (emerald-500) */
}

/* ตอน checked: พื้นเขียว + ติ๊กสีขาว */
.cart-checkbox:checked {
  background-color: #10b981;
  /* เปลี่ยนพื้นตรงนี้ */
  border-color: #10b981;

  /* เครื่องหมายถูกสีขาว */
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M4 8.5L6.5 11L12 5' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 80% 80%;
}
</style>
