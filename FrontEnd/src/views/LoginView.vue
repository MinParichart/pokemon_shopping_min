<script setup lang="ts">
import useVuelidate from '@vuelidate/core';
import { minLength, required } from '@vuelidate/validators';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '../services/auth.service';

// --- เพื่อใช้ Router --- //
const router = useRouter();

// --- กำหนดข้อมูลฟอร์ม --- //
const form = ref({
  username: '',
  password: '',
});

// --- กำหนดกฎการตรวจสอบข้อมูล --- //
const rules = {
  username: { required },
  password: { required, minLength: minLength(4) },
};

// --- เพื่อใช้ Vuelidate --- // 
// v$ จะเก็บสถานะการตรวจสอบข้อมูล
const vueValidate = useVuelidate(rules, form);

const loading = ref(false);
const error = ref<string | null>(null);

// --- ฟังก์ชันเมื่อกดปุ่มล็อกอิน ทำการตรวจสอบข้อมูลและเรียก API ถ้าสำเร็จจะไปที่หน้า Home ถ้าล้มเหลวจะแสดงข้อความแสดงข้อผิดพลาด --- //
async function onSubmit() {
  error.value = null; // เคลียร์ข้อผิดพลาดก่อนตรวจสอบข้อมูล
  const ok = await vueValidate.value.$validate(); // ตรวจสอบข้อมูลในฟอร์ม
  if (!ok) return; // ถ้าข้อมูลไม่ถูกต้องจะไม่ทำอะไรต่อ

  loading.value = true; // ตั้งสถานะกำลังโหลด
  try {
    const res = await login(form.value);
    console.log('Login successful:', res);
    const token = res.token; // ดึง token จากผลลัพธ์
    localStorage.setItem('token', token); // เก็บ token ใน localStorage
    router.replace({ name: "UserProducts" }); // ไปที่หน้า products เมื่อล็อกอินสำเร็จ
  } catch (err: any) {
    console.error('Login failed:', err);
    error.value = err.response?.data?.message || 'Login failed. Please try again.'; // ตั้งข้อความแสดงข้อผิดพลาด ความหมายคือ ถ้ามีข้อความจากเซิร์ฟเวอร์ให้ใช้ข้อความนั้น ถ้าไม่มีให้ใช้ข้อความทั่วไป
  } finally {
    loading.value = false; // ปิดสถานะกำลังโหลด
  }
}
</script>

<template>
  <form class="space-y-3" @submit.prevent="onSubmit">
    <div>
      <label class="block text-sm mb-1">Username</label>
      <input v-model="form.username" class="w-full border rounded-lg px-2 py-2 focus:outline-none"
        :class="{ 'border-red-500': vueValidate.username.$error }" type="username" placeholder="Enter your username" />

      <p v-if="vueValidate.username.$error" class="text-red-600 text-sm mt-1">
        Input Your Username!
      </p>
    </div>

    <div>
      <label class="block text-sm mb-1">Password</label>
      <input v-model="form.password" class="w-full border rounded-lg px-2 py-2 focus:outline-none"
        :class="{ 'border-red-500': vueValidate.password.$error }" type="password" placeholder="Enter your password" />

      <p v-if="vueValidate.password.$error" class="text-red-600 text-sm mt-1">
        Passworkd must be at least 4 characters
      </p>
    </div>

    <button type="submit" :disabled="loading" class="w-full bg-black text-white rounded-xl py-2 disabled:opacity-40">
      {{ loading ? "Signing in..." : "Sign in" }}
    </button>

    <p v-if="error" class="text-red-600 text-sm text-center">
      {{ error }}
    </p>
  </form>
</template>


<style scoped></style>