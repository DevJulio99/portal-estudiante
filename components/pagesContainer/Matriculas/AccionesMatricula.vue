<script setup lang="ts">
const props = defineProps<{
    onRegister: () => void;
    onFilter: (value: string) => void;
    clearFilter: () => void;
}>();

const filtro = ref('');

const handleFilter = () => {
    props.onFilter(filtro.value);
}

const handleClear = () => {
    filtro.value = '';
    props.clearFilter();
}
</script>
<template>
  <div class="flex items-center gap-12 mb-5">
    <!-- <button
      class="rounded px-3 py-2 text-white bg-primary hover:bg-[#1E6657] font-bold"
      @click="onRegister"
    >
      Registrar
    </button> -->

    <div class="flex items-center gap-6 grow">
      <input
        v-model="filtro"
        @keydown.enter="handleFilter"
        class="w-full outline-none rounded border border-celestial_white px-3 py-2"
        type="text"
        placeholder="Filtro"
      />
      <button @click="handleFilter" class="rounded px-3 py-2 text-white bg-secondary hover:bg-[#021033]">Filtrar</button>
      <button @click="handleClear" class="rounded px-3 py-2 text-white bg-error hover:bg-error-dark">Limpiar</button>
    </div>
  </div>
</template>