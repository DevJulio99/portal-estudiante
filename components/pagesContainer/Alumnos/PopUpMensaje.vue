<script lang="ts" setup>
import { ref, watch } from 'vue';

const props = withDefaults(defineProps<{
    message: string;
    type: 'success' | 'error' | 'warning';
    show: boolean;
    duration?: number;
}>(),
{
  message: "",
  type: 'success',
  show: false,
  duration: 5000,
});

const emit = defineEmits(['update:show']);

let timeoutId: ReturnType<typeof setTimeout> | null = null;

const close = () => {
  emit('update:show', false);
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
};

watch(() => props.show, (newValue) => {
  if (newValue) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      close();
    }, props.duration);
  }
});

</script>

<template>
  <Transition name="slide-fade">
    <div v-if="show" class="popup-msg" :class="`popup-msg--${type}`">
      <div class="font-bold capitalize">
        <span v-if="type === 'success'">Éxito</span>
        <span v-else-if="type === 'error'">Error</span>
        <span v-else-if="type === 'warning'">Advertencia</span>
      </div>
      <p class="text-sm">{{ message }}</p>
      <button @click="close" class="absolute top-1 right-2 text-xl">&times;</button>
    </div>
  </Transition>
</template>

<style scoped>
.popup-msg {
  @apply fixed z-[100] top-5 right-5 w-auto max-w-sm h-auto p-4 text-white rounded-lg shadow-lg;
}
.popup-msg--error { @apply bg-error-dark; }
.popup-msg--success { @apply bg-green-600; }
.popup-msg--warning { @apply bg-amber-500; }

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>