<script setup lang="ts">
import useVuelidate from '@vuelidate/core';
import { minLength, required } from '@vuelidate/validators';
import { jwtDecode } from 'jwt-decode';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { loginAdmin } from '../services/auth.service';


const { setToken, setUser } = useAuth();

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
    const res = await loginAdmin(form.value); // เรียก API เพื่อทำการล็อกอิน
    const token = res.token;
    setToken(token); // เก็บ token ใน local storage ด้วย useAuth composable

    // ใช้ library jwt-decode ในการถอดรหัส JWT
    const payload: any = jwtDecode(token);
    console.log("Login successful. Decoded payload:", payload);
    const role = payload?.role
      ?? payload?.roles?.[0]; // กรณีมีหลาย role ให้เอาอันแรก

    setUser({
      username: payload?.username ?? form.value.username,
      fullName: payload?.fullName,
      phone: payload?.phone,
      password: '',
      confirmPassword: '',
      role,
    });

    // นำทางไปยังหน้าตามบทบาท
    if (role === 'Admin') {
      router.push({ name: 'AdminProducts' }); // product ของ admin
      console.log("Admin Login");
    } else {
      router.push({ name: 'UserProducts' }); // product ของ user
      console.log("User Login");
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to login. Please try again.';
    console.error('Login error:', err);
  } finally {
    loading.value = false; // ปิดสถานะกำลังโหลด
    console.log("Login process finished.");
  }
};
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