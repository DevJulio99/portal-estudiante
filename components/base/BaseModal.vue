<script lang="ts" setup>
const props = withDefaults(defineProps<{
    show: boolean;
    maxWidth?: string;
    maxHeight?: string;
    onClose: () => void;
}>(), {
    show: false,
    maxWidth: 'max-w-[700px]',
    maxHeight: 'max-h-[90vh]',
});

const emit = defineEmits(['close']);

const handleClose = () => {
    emit('close');
};

onMounted(() => {
    if (props.show) toggleHiddenScroll();
});

onUnmounted(() => {
    toggleHiddenScroll(false); // Asegurarse de que el scroll se restaure
});

watch(() => props.show, (newValue) => {
    toggleHiddenScroll(newValue);
});
</script>

<template>
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black_transparent" @click.self="handleClose">
        <div class="relative flex flex-col w-full bg-white z-10 p-6 pb-0" :class="[maxWidth, maxHeight]">
            <span class="absolute top-2 right-2 cursor-pointer" @click="handleClose"><nuxt-icon name="closeIcon" class="text-[24px]" alt="icon-close" /></span>
            <slot></slot>
        </div>
    </div>
</template>