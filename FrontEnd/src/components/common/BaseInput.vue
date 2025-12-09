<template>
  <div class="w-full group">
    <label v-if="label"
      class="block text-sm mb-1.5 font-medium text-slate-700 transition-colors group-focus-within:text-emerald-600">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="relative">
      <div v-if="$slots.icon"
        class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none transition-colors group-focus-within:text-emerald-500">
        <slot name="icon"></slot>
      </div>

      <component :is="type === 'textarea' ? 'textarea' : 'input'" v-bind="$attrs" :value="modelValue"
        :type="type === 'textarea' ? undefined : type" :class="[
          'w-full text-sm text-slate-800 placeholder:text-slate-400',
          'bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5',
          'outline-none transition-all duration-200 ease-in-out',
          'focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10',
          $slots.icon ? 'pl-10 pr-4' : 'px-4'
        ]" @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" />

      <div v-if="$slots.rightIcon"
        class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-slate-600">
        <slot name="rightIcon"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string | number;
  label?: string;
  type?: string;
  required?: boolean;
}>();
defineEmits(['update:modelValue']);
</script>