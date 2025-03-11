<script lang="ts" setup>
defineProps<{
    onRegister: () => void;
}>()


</script>

<template>
    <div class="flex items-center gap-12 mb-5">
        <button class="rounded px-3 py-2 text-white bg-green_40" @click="onRegister">Registrar</button>

        <div class="flex items-center gap-6 grow">
            <input class="w-full outline-none rounded border border-celestial_white px-3 py-2" type="text" placeholder="Filtro">
            <button class="rounded px-3 py-2 text-white bg-blue_light">Filtrar</button>
        </div>
    </div>
</template>

<style>

</style>