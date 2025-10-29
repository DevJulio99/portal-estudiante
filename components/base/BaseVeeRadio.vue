<script lang="ts" setup>
defineProps<{
    modelValue: string | number;
    label?: string;
    name: string;
    value: string | number;
    id: string;
}>();

const emit = defineEmits(['update:modelValue']);

const onUpdate = (event: Event) => {
    emit('update:modelValue', (event.target as HTMLInputElement).value);
}
</script>

<template>
    <div class="flex items-center gap-2">
        <input
            :id="id"
            :name="name"
            type="radio"
            :checked="modelValue == value"
            :value="value"
            @change="onUpdate"
            class="w-4 h-4"
        />
        <label v-if="label" :for="id" class="cursor-pointer select-none">
            <slot>{{ label }}</slot>
        </label>
        <slot v-else name="label"></slot>
    </div>
</template>