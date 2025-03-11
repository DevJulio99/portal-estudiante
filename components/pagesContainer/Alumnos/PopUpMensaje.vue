<script lang="ts" setup>
defineProps<{
    message: string;
}>()
</script>

<template>
    <div id="popupMsg" class="py-3 px-4 fixed z-[100] top-[20px] right-[-250px] w-auto h-auto bg-error-dark text-white rounded-lg">
    <h3>Error</h3>
    <p>{{ message }}</p>
  </div>
</template>

<style>
#popupMsg {
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      transition: right 0.3s ease;
}
</style>