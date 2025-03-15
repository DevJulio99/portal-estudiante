<script lang="ts" setup>
import type { Pregunta, Respuesta } from "~/types/examen.types";

const props = withDefaults(
  defineProps<{
    pregunta: Pregunta | null;
    checkedOption: string;
    onResponse: (id: string, opcion: string) => void;
    numeroEnGrupo: Number | null,
    totalPreguntasGrupo: Number | null
  }>(),
  {
    checkedOption: `option`,
    pregunta: null,
  }
);

const showQuestions = ref(true);
const examenStore = useExamenStore();
const preguntasData = ref<Respuesta[]>([]);

const preguntas = computed(() => examenStore.listaPreguntas);
const respuesta = computed(() => examenStore.respuestaSeleccionada);

watch(preguntas, (lista) => {
  if (lista.length) {
    //console.log("listapreguntas", lista);
    preguntasData.value = lista;
  }
});

const onSelect = (id: string, opcion: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.click();
    props.onResponse(id, opcion);
    examenStore.setRespuestaRespondida(opcion);
  }
};
</script>
<template>
  <div class="relative w-fit">
    <div class="absolute left-[-42px] top-[15px]">
      <div
        class="btn-show relative flex justify-center items-center w-[28px] h-[31px] bg-[#3A5475] rounded-md cursor-pointer"
        @click="() => (showQuestions = !showQuestions)"
      >
        <div
          class="w-max tooltp absolute text-[8px] top-[-34px] py-2 px-3 bg-[#3A5475] rounded-md text-white"
        >
          {{ showQuestions ? "Ocultar preguntas" : "Ver preguntas" }}
        </div>
        <nuxt-icon
          filled
          :class="`text-2xl cursor-pointer`"
          name="upn-icon-nav-arrow-white-left"
        />
      </div>
    </div>
    <div
      :class="`flex flex-wrap gap-[11px] max-h-[469px] transition-all overflow-hidden ${
        showQuestions ? 'w-[577px]' : 'w-0 h-0'
      }`"
    >
      <span class="w-full block text-sm font-semibold mb-[15px]"
        >Pregunta N° {{ pregunta?.numeroPregunta }}: {{ pregunta?.pregunta }}</span
      >
      <!-- <p>option {{ checkedOption }}</p> -->
      <span
        v-if="numeroEnGrupo && totalPreguntasGrupo"
        class="w-full block text-sm font-semibold text-primary"
        >Pregunta {{ numeroEnGrupo }} de {{ totalPreguntasGrupo }}</span
      >
      <div
        v-for="(alternativa, index) in preguntas"
        class="flex w-full cursor-pointer px-[11px] pt-[10px] pb-[7px] border border-[#B3B3B3] rounded-[10px] gap-2 items-center transition-colors"
        @click="() => onSelect(`option${index + 1}`, alternativa.opcion)"
        :class="alternativa.opcion === respuesta ? 'bg-cyan_5' : ''"
      >
        <input
          type="radio"
          name="optionsEV"
          :id="`option${index + 1}`"
          :value="`option${index + 1}`"
          :checked="alternativa.opcion === respuesta"
        />
        <div>
          <span class="block font-semibold mb-2.5 text-xs font-normal"
            >Alternativa {{ index + 1 }}</span
          >
          <p class="text-xs font-normal">{{ alternativa.descripcion }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tooltp {
  visibility: hidden;
}

.tooltp::after {
  content: "";
  display: block;
  position: absolute;
  width: 0;
  height: 0;
  background-color: transparent;
  bottom: -5px;
  border: 6.93px solid transparent;
  border-bottom: 0;
  border-top: 6px solid #3a5475;
  text-align: center;
  transform: translateX(-60%);
  left: 50%;
}

.btn-show:hover .tooltp {
  visibility: visible;
}
</style>
