<script setup lang="ts">
import circleClose from "@/assets/icons/circle-x-mark.svg";

const props = withDefaults(
  defineProps<{
    show: boolean;
    url: string;
    onClose: () => void,
  }>(),
  {
    show: false,
    url: '',
    onClose: () => {}
  }
);
</script>

<template>
    <div v-if="show" class="fixed w-full h-full flex items-center justify-center top-0 left-0 z-40">
        <div class="absolute bg-black_transparent w-full h-full" @click="onClose"></div>
        <div class="relative z-10 w-full max-w-[963px] h-[696] rounded-[20px] bg-white p-[19px]">
              <img class="absolute top-[9px] right-[9px] cursor-pointer" :src="circleClose" alt="close-md-prev" @click="onClose">
              <img class="w-full h-full" :src="url" alt="zoom-image">
        </div>
    </div>
</template>