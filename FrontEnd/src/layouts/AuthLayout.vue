<template>
  <!-- กรอบหน้า Login ไม่ใส่ Logic/เรียก API -->
  <div class="min-h-screen grid place-items-center bg-gray-50">
    <div class="w-full max-w-sm bg-white shadow-md rounded-2xl p-6">
      <header class="mb-4">
        <h1 class="text-xl font-bold text-center">Pokemon Shopping</h1>
        <p class="text-center text-sm text-gray-500">Sign in to continue</p>
      </header>

      <!-- หน้า (View) จะถูกแสดงตรงนี้ -->
      <router-view />
    </div>
  </div>
</template>
