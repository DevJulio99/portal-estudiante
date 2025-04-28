<script lang="ts" setup>
withDefaults(defineProps<{
    message: string;
    type: 'success' | 'error'
}>(),
{
  message: "",
  type: 'success'
})
</script>

<template>
    <div id="popupMsg" class="py-3 px-4 fixed z-[100] top-[20px] right-[-1000px] w-auto h-auto text-white rounded-lg"
      :class="{
        'bg-error-dark': type == 'error',
        'bg-green_70': type == 'success'
      }">
    <h3>{{type == 'success' ? 'Ok' : 'Error'}}</h3>
    <p>{{ message }}</p>
  </div>
</template>

<style>
#popupMsg {
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      transition: right 0.3s ease;
}
</style>