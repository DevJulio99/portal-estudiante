<script lang="ts" setup>
defineProps<{
    onAction: (status: boolean) => void;
}>()


</script>

<template>
    <div class="w.full flex flex-wrap items-center mb-5">
        <span class="w-full text-center text-lg font-bold mb-4">¿Está seguro de eliminar el curso?</span>
        <div class="w-full flex justify-center items-center gap-4">
            <button class="rounded px-4 py-3 text-white font-bold bg-primary hover:bg-[#1E6657] w-[70px]" @click="() => onAction(true)">SÍ</button>
            <button class="rounded px-4 py-3 text-white font-bold bg-secondary hover:bg-[#021033] w-[70px]" @click="() => onAction(false)">NO</button>        
        </div>
    </div>
</template>

<style>

</style>