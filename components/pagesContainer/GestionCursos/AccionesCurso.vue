<script lang="ts" setup>
const props = defineProps<{
  onRegister: () => void;
  onFilter: (value: string) => void;
  clearFilter: () => void;
}>();

const cursoStore = useCursoStore();

const valueInpt = ref<string>("");

const cambioInp = (e: any) => {
  valueInpt.value = e.target.value;
};

const filtrarCurso = () => {
  if (valueInpt.value.trim().length > 0) {
    props.onFilter(valueInpt.value);
  }
};

const limpiar = () => {
    if(cursoStore.activeFilter){
        valueInpt.value = '';
        props.clearFilter();
    }
};
</script>

<template>
  <div class="flex items-center gap-12 mb-5">
    <button
      class="rounded px-3 py-2 text-white bg-primary hover:bg-[#1E6657] font-bold"
      @click="onRegister"
    >
      Registrar
    </button>

    <div class="flex items-center gap-6 grow">
      <input
        @input="cambioInp"
        @keydown.enter="filtrarCurso"
        class="w-full outline-none rounded border border-celestial_white px-3 py-2"
        type="text"
        placeholder="Filtro"
        :value="valueInpt"
      />
      <button
        @click="filtrarCurso"
        class="rounded px-3 py-2 text-white bg-secondary hover:bg-[#021033]"
      >
        Filtrar
      </button>

      <button
        @click="limpiar"
        class="rounded px-3 py-2 text-white bg-error hover:bg-error-dark"
      >
        Limpiar
      </button>
    </div>
  </div>
</template>

<style></style>
