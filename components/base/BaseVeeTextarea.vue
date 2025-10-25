<script lang="ts" setup>
import { useVModel } from '@vueuse/core';

const props = withDefaults(defineProps<{
    modelValue: string | number | undefined;
    name: string;
    label: string;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    rows?: number;
}>(), {
    placeholder: '',
    error: '',
    disabled: false,
    rows: 4,
});

const emit = defineEmits(['update:modelValue']);
const value = useVModel(props, 'modelValue', emit);
</script>

<template>
    <div class="flex flex-col">
        <span class="font-bold">{{ label }}</span>
        <textarea class="w-full outline-none rounded border border-celestial_white px-2 py-1" :class="{'bg-gray-100 cursor-not-allowed': disabled}" v-model="value" :name="name" :placeholder="placeholder" :disabled="disabled" :rows="rows"></textarea>
        <span v-if="error" class="text-error">{{ error }}</span>
    </div>
</template>

<style scoped>
.text-error { color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem; }
</style>