<template>
  <div class="flex items-start justify-center bg-slate-50 p-4">
    <div class="w-full max-w-md bg-white border border-slate-200 rounded-xl p-8 shadow-lg">
      <h1 class="text-xl font-semibold mb-6 text-center text-slate-800">ลงทะเบียนสมาชิกใหม่</h1>

      <form class="space-y-4" @submit.prevent="onSubmit">
        <div>
          <BaseInput v-model="form.username" label="Username" placeholder="ระบุชื่อผู้ใช้งาน" />
          <p v-if="errors.username" class="text-xs text-red-500 mt-1">{{ errors.username }}</p>
        </div>

        <div>
          <BaseInput v-model="form.fullName" label="ชื่อ - นามสกุล" placeholder="ระบุชื่อและนามสกุล" />
          <p v-if="errors.fullName" class="text-xs text-red-500 mt-1">{{ errors.fullName }}</p>
        </div>

        <div>
          <BaseInput v-model="form.phone" label="เบอร์โทรศัพท์" placeholder="เช่น 0812345678" />
          <p v-if="errors.phone" class="text-xs text-red-500 mt-1">{{ errors.phone }}</p>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <BaseInput v-model="form.password" :type="showPassword ? 'text' : 'password'" label="Password" />
            <p v-if="errors.password" class="text-xs text-red-500 mt-1">{{ errors.password }}</p>
          </div>
          <div>
            <BaseInput v-model="form.confirmPassword" :type="showPassword ? 'text' : 'password'"
              label="ยืนยัน Password" />
            <p v-if="errors.confirmPassword" class="text-xs text-red-500 mt-1">{{ errors.confirmPassword }}</p>
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <input type="checkbox" id="show-pass" v-model="showPassword"
            class="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500">
          <label for="show-pass" class="text-sm text-slate-600 cursor-pointer select-none">
            แสดงรหัสผ่าน
          </label>
        </div>

        <div class="pt-2">
          <BaseButton type="submit" variant="primary" block :loading="loading">
            ลงทะเบียน
          </BaseButton>
        </div>

        <div class="text-center mt-4">
          <RouterLink to="/login" class="text-xs text-slate-500 hover:text-emerald-600 hover:underline">
            มีบัญชีอยู่แล้ว? เข้าสู่ระบบ
          </RouterLink>
        </div>
      </form>

      <p v-if="globalError" class="mt-4 text-xs text-red-500 text-center bg-red-50 p-2 rounded border border-red-100">
        {{ globalError }}
      </p>

      <p v-if="success"
        class="mt-4 text-xs text-emerald-600 text-center bg-emerald-50 p-2 rounded border border-emerald-100">
        ลงทะเบียนสำเร็จ กรุณาเข้าสู่ระบบ
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
// สมมติว่า path component ถูกต้อง
import BaseButton from '../components/common/BaseButton.vue';
import BaseInput from '../components/common/BaseInput.vue';
import type { RegisterBody } from '../models/auth.model';
import { authService } from '../services/auth.service';

// 1. Interface ให้ตรงกับ Schema Backend 

const form = reactive<RegisterBody>({
  username: '',
  fullName: '',
  phone: '',
  password: '',
  confirmPassword: '',
  role: 'user', // Default role (ถ้า Backend ไม่ได้บังคับค่าอื่น)
});

const errors = reactive({
  username: '',
  fullName: '',
  phone: '',
  password: '',
  confirmPassword: ''
});

const loading = ref(false);
const globalError = ref('');
const success = ref(false);
const showPassword = ref(false);

function validateForm(): boolean {
  let isValid = true;
  // Reset errors
  Object.keys(errors).forEach(key => (errors as any)[key] = '');

  // 1. Username (Required)
  if (!form.username?.trim()) {
    errors.username = 'กรุณากรอก Username';
    isValid = false;
  }

  // 2. FullName (Required)
  if (!form.fullName?.trim()) {
    errors.fullName = 'กรุณากรอกชื่อ - นามสกุล';
    isValid = false;
  }

  // 3. Phone (Required & Format)
  // Backend schema: minLength: 1
  // Frontend: เช็ค UX เพิ่มเติมให้เป็นตัวเลข 10 หลัก
  if (!form.phone?.trim()) {
    errors.phone = 'กรุณากรอกเบอร์โทรศัพท์';
    isValid = false;
  } else if (!/^[0-9]{10}$/.test(form.phone)) {
    errors.phone = 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก';
    isValid = false;
  }

  // 4. Password (Required & MinLength 6)
  // Backend schema: minLength: 6
  if (!form.password) {
    errors.password = 'กรุณากรอกรหัสผ่าน';
    isValid = false;
  } else if (form.password.length < 6) {
    errors.password = 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร';
    isValid = false;
  }

  // 5. Confirm Password (Required)
  if (!form.confirmPassword) {
    errors.confirmPassword = 'กรุณายืนยันรหัสผ่าน';
    isValid = false;
  }

  // 6. Match Logic
  if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
    errors.confirmPassword = 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน';
    isValid = false;
  }

  return isValid;
}

async function onSubmit() {
  globalError.value = '';
  success.value = false;

  if (!validateForm()) {
    globalError.value = 'กรุณากรอกข้อมูลให้ครบทุกช่องที่มีเครื่องหมายแจ้งเตือน';
    return;
  }

  loading.value = true;
  try {
    // ยิง API ไปที่ /api/auth/register
    await authService.register(form);
    success.value = true;
  } catch (e: any) {
    // Handle Errors
    const status = e.response?.status;
    if (status === 400) {
      // Backend อาจจะส่ง Validation Error กลับมาที่นี่
      globalError.value = 'ข้อมูลไม่ถูกต้อง หรือ ชื่อผู้ใช้งานซ้ำ';
    } else if (status === 500) {
      globalError.value = 'เกิดข้อผิดพลาดที่ระบบ (Internal Server Error)';
    } else {
      globalError.value = 'ลงทะเบียนไม่สำเร็จ กรุณาลองใหม่อีกครั้ง';
    }
  } finally {
    loading.value = false;
  }
}
</script>