<template>
  <div
    class="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-red-900 via-slate-900 to-emerald-900 font-sans">

    <div class="absolute inset-0 pointer-events-none z-0">
      <div v-for="n in 20" :key="n" class="snowflake" :style="getSnowStyle(n)"></div>
    </div>

    <div class="w-full max-w-md relative z-10 mx-4">

      <div
        class="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-500/30 rounded-full blur-[80px] pointer-events-none">
      </div>

      <div
        class="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-8 relative overflow-hidden ring-1 ring-white/50">

        <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500">
        </div>

        <div class="flex flex-col items-center mb-8 mt-2">

          <div class="relative group">
            <div class="absolute inset-0 rounded-full border-2 border-dashed border-red-300/60 animate-spin-slow"></div>

            <div
              class="w-24 h-24 bg-gradient-to-tr from-slate-100 to-white rounded-full shadow-lg flex items-center justify-center relative z-10 border-4 border-white ring-4 ring-red-100 transform transition-transform group-hover:scale-105 duration-500">
              <img :src="santaImg" alt="Santa Pokemon" class="w-16 h-16 object-cover rounded-full drop-shadow-md" />
              <div
                class="absolute -bottom-1 -right-1 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm">
                XMAS
              </div>
            </div>
          </div>

          <h1 class="text-4xl font-black tracking-[0.2em] text-slate-800 mt-5 drop-shadow-sm">
            POKEMON SHOP
          </h1>
          <div class="flex items-center gap-3 mt-1">
            <span class="h-[1px] w-8 bg-red-300"></span>
            <p class="text-[10px] text-red-500 font-bold uppercase tracking-widest">Holiday Edition</p>
            <span class="h-[1px] w-8 bg-green-300"></span>
          </div>
        </div>

        <div class="relative z-20">
          <RouterView />
        </div>

        <div
          class="absolute -bottom-10 -right-10 text-9xl opacity-[0.03] text-slate-900 pointer-events-none select-none rotate-12">
          🎄
        </div>
      </div>

      <p class="text-center text-white/40 text-xs mt-6 font-light tracking-wider">
        © 2025 MIS POKEMON SHOP
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
// Import รูปภาพ (ใช้ตัวเดิมของคุณได้เลย)
import santaImg from '../assets/santa-pokemon.jpg';

// ฟังก์ชันสุ่มตำแหน่งหิมะให้ดูธรรมชาติ
function getSnowStyle(n: number) {
  const left = Math.random() * 100;
  const delay = Math.random() * 5;
  const duration = 5 + Math.random() * 10;
  const size = 5 + Math.random() * 10;
  const opacity = 0.2 + Math.random() * 0.5;

  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    fontSize: `${size}px`,
    opacity: opacity
  };
}
</script>

<style scoped>
/* หิมะตก */
.snowflake {
  position: absolute;
  top: -20px;
  color: white;
  animation: fall linear infinite;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
}

@keyframes fall {
  0% {
    transform: translateY(-20px) rotate(0deg);
  }

  100% {
    transform: translateY(110vh) rotate(360deg);
  }
}

/* หมุนวงแหวนรอบโลโก้ช้าๆ */
.animate-spin-slow {
  animation: spin 15s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>