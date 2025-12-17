<script setup lang="ts">
import BaseProgressBar from '~/components/base/BaseProgressBar.vue';

defineProps({
  title: {
    type: String,
    required: true,
  },
  teacher: {
    type: String,
    required: true,
  },
  progress: {
    type: Number,
    required: true,
    validator: (value: number) => value >= 0 && value <= 100,
  },
  codCurso: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <NuxtLink
    :to="`/aula-virtual/curso/${codCurso}`"
    class="group relative block rounded-2xl overflow-hidden p-6 min-h-[220px] flex flex-col justify-between transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2"
  >
    <div class="absolute inset-0 bg-gradient-to-br from-[#287f6b] to-[#1a5346] z-0"></div>

    <div class="absolute bottom-0 left-0 w-full h-auto z-10 opacity-20">
      <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">
        <path fill="#ffffff" fill-opacity="1" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,186.7C960,213,1056,235,1152,218.7C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
    </div>

    <div class="relative z-20 flex flex-col flex-grow">
      <div class="flex-grow">
        <h3 class="font-bold text-2xl text-white leading-tight group-hover:text-yellow-300 transition-colors duration-300">
          {{ title }}
        </h3>
        <p class="text-sm text-white/80 mt-2">{{ teacher }}</p>
      </div>

      <BaseProgressBar :progress="progress" class="mt-6" />
    </div>

    <div class="absolute top-4 right-4 text-white/50 group-hover:text-white group-hover:scale-110 transition-transform duration-300 z-20">
        <nuxt-icon name="arrow-right-circle" class="text-3xl" />
    </div>
  </NuxtLink>
</template>