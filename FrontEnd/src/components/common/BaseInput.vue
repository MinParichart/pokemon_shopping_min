<template>
  <div class="w-full">
    <label v-if="label" class="block text-sm mb-1 font-medium text-slate-700">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <div v-if="$slots.icon" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
        <slot name="icon"></slot>
      </div>

      <component
        :is="type === 'textarea' ? 'textarea' : 'input'"
        v-bind="$attrs"
        :value="modelValue"
        :type="type === 'textarea' ? undefined : type"
        :class="[
          'w-full border border-slate-300 rounded-lg py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-shadow',
          $slots.icon ? 'pl-9 pr-3' : 'px-3'
        ]"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      
      <div v-if="$slots.rightIcon" class="absolute right-3 top-1/2 -translate-y-1/2">
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