<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 font-sans relative overflow-hidden">

    <div class="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

    <div class="w-full max-w-md relative z-10 px-4">

      <div class="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 relative overflow-hidden">

        <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 to-cyan-500"></div>

        <div class="flex flex-col items-center mb-8 mt-2">

          <div
            class="w-24 h-24 relative mb-4 p-1 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center">
            <img :src="santaImg" alt="Shop Logo" class="w-full h-full object-cover rounded-full" />
          </div>

          <h1 class="text-3xl font-extrabold text-slate-800 tracking-wider">
            POKEMON
          </h1>

          <div class="flex items-center gap-3 mt-2">
            <span class="h-[1px] w-6 bg-slate-200"></span>
            <p class="text-[10px] text-slate-400 font-bold tracking-[0.3em] uppercase">
              Pokemon Shop
            </p>
            <span class="h-[1px] w-6 bg-slate-200"></span>
          </div>
        </div>

        <div class="relative z-20">
          <RouterView />
        </div>

      </div>

      <p class="text-center text-slate-400 text-xs mt-6 font-light tracking-wider">
        © 2025 WUNCA POKEMON SHOP
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">

// ✅ แก้ชื่อตัวแปรจาก santa-pokemon เป็น santaImg (ห้ามมีขีดกลาง)
import santaImg from '../assets/santa-pokemon.jpg';

</script>
