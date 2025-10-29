<script lang="ts" setup>
const props = defineProps<{
    modelValue: boolean;
    label: string;
    name: string;
    id?: string;
    error?: string;
}>();

const emit = defineEmits(['update:modelValue']);

const value = useVModel(props, 'modelValue', emit);
</script>

<template>
    <div class="flex flex-col">
        <div class="flex items-center gap-2">
            <input
                :id="name"
                :name="name"
                type="checkbox"
                class="w-4 h-4"
                v-model="value"
            />
            <label :for="name" class="font-bold cursor-pointer select-none">{{ label }}</label>
        </div>
        <span v-if="error" class="text-error">{{ error }}</span>
    </div>
</template>

<style scoped>
.text-error { color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem; }
</style>