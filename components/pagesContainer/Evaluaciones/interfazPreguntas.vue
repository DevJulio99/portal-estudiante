<script lang="ts" setup>
const examenStore = useExamenStore();
const preguntaStore = usePreguntaStore();

const mostrarInterfaz = ref(true);

const preguntaActual = computed(() => preguntaStore.preguntaActual)
const totalPreguntas = computed(() => preguntaStore.totalPreguntas)
const preguntasRespondidas = computed(() => examenStore.preguntasRespondidas)
const respuestasPendientes = computed(() => preguntaStore.respuestasPendientes)

const onPageSelect = (page: number) => {
  preguntaStore.setOpcionSeleccionada('');
  preguntaStore.setPregunta(page);
  examenStore.setpreguntaActual(page);
}

const mostrar = () => {
    mostrarInterfaz.value = !mostrarInterfaz.value;
}

</script>

<template>
<div class="transition-all overflow-hidden" :class="{
    'max-w-[150px]': mostrarInterfaz,
    'max-w-[16px] h-[50px]': !mostrarInterfaz
}">
      <div class="w-full flex justify-center items-center gap-2 py-2 border border-green_30 border-x-0 border-t-0">
      <span v-if="mostrarInterfaz">Respuestas</span>
      <nuxt-icon name="double-arrow-right" filled class="no-margin filter-primary cursor-pointer" @click="mostrar"/>
    </div>
    <div class="w-full p-5">
      <div class="w-full flex flex-wrap justify-center gap-[5px] xl:w-auto grow">
      <div v-for="(pregunta, i) in totalPreguntas" @click="() => onPageSelect(pregunta)">
        <div
          class="w-[43px] transition-colors cursor-pointer rounded-lg py-2 flex justify-center items-center"
          :class="`${
            preguntaActual === i + 1
              ? 'bg-blue_light text-white'
              : preguntasRespondidas.includes(i + 1)
              ? 'bg-green_60 text-white'
              : respuestasPendientes.includes(i + 1)
              ? 'bg-gray_60'
              : 'bg-gray_60'
          }`"
        >
        {{i + 1}}
      </div>
      </div>
    </div>

    </div>
    </div>
</template>