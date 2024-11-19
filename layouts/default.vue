<script setup lang="ts">
import { getProfile } from '~/services/profile';

await getProfile(1);
</script>
<template>
  <div class="md:grid md:grid-cols-[auto_1fr]">
    <MenuComponent />
    <div class="relative top-[64px] flex flex-col min-h-[calc(100vh_-_64px)]">
      <div class="h-full">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
