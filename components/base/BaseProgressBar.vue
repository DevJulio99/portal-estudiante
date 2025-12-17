<script setup lang="ts">
defineProps({
  progress: {
    type: Number,
    required: true,
    validator: (value: number) => value >= 0 && value <= 100,
  },
  label: {
    type: String,
    default: 'Progreso',
  },
  labelClass: {
    type: String,
    default: 'text-xs font-semibold text-white/70',
  },
  percentageClass: {
    type: String,
    default: 'text-sm font-bold text-white',
  },
  trackClass: {
    type: String,
    default: 'bg-white/20',
  },
  barClass: {
    type: String,
    default: 'bg-white',
  },
});
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-1">
      <span :class="labelClass">{{ label }}</span>
      <span :class="percentageClass">{{ progress }}%</span>
    </div>
    <div class="w-full bg-white/20 rounded-full h-2.5">
      <div
        class="bg-white h-2.5 rounded-full transition-all duration-500 ease-out"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>
  </div>
</template>