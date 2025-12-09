<template>
  <div>
    <h1 class="text-xl font-semibold mb-4 text-center">เข้าสู่ระบบ</h1>
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseInput v-model="username" label="Username" required />
      <BaseInput v-model="password" :type="showPassword ? 'text' : 'password'" label="Password" required>
        <template #rightIcon>
          <button type="button" @click="showPassword = !showPassword" class="text-slate-400">
            <span class="material-symbols-outlined">{{ showPassword ? 'visibility' : 'visibility_off' }}</span>
          </button>
        </template>
      </BaseInput>
      <div class="space-y-2 mt-2">
        <BaseButton type="submit" :loading="loading" block>เข้าสู่ระบบ</BaseButton>
        <RouterLink to="/register"
          class="block w-full text-center bg-blue-500 text-white py-2 rounded-lg text-sm hover:bg-blue-600">ลงทะเบียน
        </RouterLink>
      </div>
    </form>
    <p v-if="error" class="mt-3 text-xs text-red-500 text-center">{{ error }}</p>
    <div class="mt-4 text-center">
      <RouterLink to="/admin/login" class="text-xs text-slate-400 underline">เข้าสู่ระบบสำหรับผู้ดูแล (Admin)
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseButton from '../components/common/BaseButton.vue';
import BaseInput from '../components/common/BaseInput.vue';
import { useAuth } from '../composables/useAuth';

const { loginUser } = useAuth();
const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const showPassword = ref(false);

async function onSubmit() {
  loading.value = true; error.value = '';
  try { await loginUser(username.value, password.value); } catch (e) { error.value = 'เข้าสู่ระบบไม่สำเร็จ'; } finally { loading.value = false; }
}
</script>