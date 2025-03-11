<script lang="ts" setup>
defineProps<{
    onAction: (status: boolean) => void;
}>()


</script>

<template>
    <div class="w.full flex flex-wrap items-center mb-5">
        <span class="w-full text-center text-xl font-bold mb-2">Estas seguro de eliminar alumno</span>
        <div class="w-full flex justify-center items-center gap-4">
            <button class="rounded px-4 py-3 text-white bg-green_40 capitalize" @click="() => onAction(true)">si</button>
            <button class="rounded px-4 py-3 text-white bg-error capitalize" @click="() => onAction(false)">no</button>        
        </div>
    </div>
</template>

<style>

</style>