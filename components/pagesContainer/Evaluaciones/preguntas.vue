<script lang="ts" setup>
import { BtnColor } from "~/types/helper.types";

export interface ResumenPregunta {
  respondidas: number;
  pendientes: number;
  currentQuestion: number;
  idsAnswered: number[];
}

const props = withDefaults(
  defineProps<{
    cantidad: number;
    preguntaActual?: number;
    preguntaRespondida: boolean;
    finish?: boolean;
    wasNotSaved: boolean;
    forceNext: boolean;
    onBack: (resumen: ResumenPregunta) => void;
    onNext: (resumen: ResumenPregunta) => void;
    onNextFinish: () => void;
    onAskNext: () => void;
    onLastQuestion: () => void;
    onSelectPage: (page: number) => void;
  }>(),
  {
    cantidad: 0,
    preguntaActual: 1,
    preguntaRespondida: false,
    finish: false,
    wasNotSaved: false,
    forceNext: false,
    onAskNext: () => {},
    onNextFinish: () => {},
    onSelectPage: () => {}
  }
);

//const preguntaActual_ = ref(props.preguntaActual);
const respuestasRespondidas = ref<number[]>([]);
//const respuestasPendientes = ref<number[]>([]);
const answeredAll = ref(false);
const examenStore = useExamenStore();
const preguntaStore = usePreguntaStore();
const competenciaStore = useCompetenciaStore();
const guardadoPendiente = computed(() => examenStore.guardadoPendiente)
const preguntasRespondidas = computed(() => examenStore.preguntasRespondidas)
const preguntaActual = computed(() => preguntaStore.preguntaActual)
//const preguntasRespondidas = computed(() => preguntaStore.preguntasRespondidas)
const respuestasPendientes = computed(() => preguntaStore.respuestasPendientes)

const NumeroPregunta = (numero: number) =>
  numero < 10 ? `0${numero}` : numero;

const next = () => {
  if(preguntaActual.value === props.cantidad){
    props.onLastQuestion();
  }

  if (preguntaActual.value !== props.cantidad) {
    if (props.preguntaRespondida) {
      console.log("props.preguntaRespondida", props.preguntaRespondida);
      if (
        !respuestasRespondidas.value.includes(preguntaActual.value) &&
        preguntaActual.value <= props.cantidad
      ) {
        respuestasRespondidas.value.push(preguntaActual.value);
        updatePending(preguntaActual.value);
      }
      //preguntaActual_.value = preguntaActual_.value + 1;
      preguntaStore.setPregunta(preguntaActual.value + 1);
      examenStore.setpreguntaActual(preguntaActual.value);
      props.onNext(getResumen());
    }

    if (!props.preguntaRespondida) {
     // preguntaActual_.value = preguntaActual_.value + 1;
      preguntaStore.setPregunta(preguntaActual.value + 1);
      props.onNext(getResumen());
      
    }
  } else {
    if(answeredAll.value && props.cantidad === preguntaActual.value) {
    props.onNextFinish();
    }
  }

  
  if(respuestasRespondidas.value.length === props.cantidad) {
    answeredAll.value = true;
  }
};

const registerPending = () => {
  !respuestasRespondidas.value.includes(preguntaActual.value) &&
    !respuestasPendientes.value.includes(preguntaActual.value) &&
    //respuestasPendientes.value.push(preguntaActual.value);
    preguntaStore.setRespuestasPendientes(preguntaActual.value);
  //preguntaActual_.value = preguntaActual_.value + 1;
  preguntaStore.setPregunta(preguntaActual.value + 1);
  examenStore.setpreguntaActual(preguntaActual.value);
  props.onNext(getResumen());
};
 
const getResumen = () => ({
  respondidas: respuestasRespondidas.value.length,
  pendientes: respuestasPendientes.value.length,
  currentQuestion: preguntaActual.value,
  idsAnswered: respuestasRespondidas.value,
});

const updatePending = (questionNumber: number) => {
  console.log('updatePending')
  const indexQuestion = respuestasPendientes.value.findIndex(
    (x) => x === questionNumber
  );
  if (indexQuestion >= 0) {
    respuestasPendientes.value.splice(indexQuestion, 1);
    // console.log('indexQuestion', indexQuestion);
    // console.log('respuestasPendientes.value', respuestasPendientes.value);
  }
};

const back = () => {
  if (preguntaActual.value !== 1) {
    //preguntaActual_.value = preguntaActual_.value - 1;
    preguntaStore.setPregunta(preguntaActual.value - 1);
    examenStore.setpreguntaActual(preguntaActual.value);
    props.onBack(getResumen());
  }
};

onBeforeUpdate(() => {
  // console.log('onBeforeUpdate', props.finish);
  if (props.finish && !respuestasRespondidas.value.includes(props.cantidad)) {
    respuestasRespondidas.value.push(props.cantidad);
  }

  if (props.forceNext) {
    // console.log("siguiente forzadamente");
    registerPending();
  }
});

const onPageSelect = (page: number) => {
  //preguntaActual_.value = page;
  preguntaStore.setPregunta(page);
  examenStore.setpreguntaActual(page);
  props.onSelectPage(page);
}
</script>

<template>
  <div
    class="fixed ml-[156px] width-container bottom-0 left-0 flex flex-wrap bg-white lg:justify-between items-center"
  >
    <!-- <div class="fixed bg-white bottom-[52px] max-w-[150px] right-0 transition-all">
      <div class="w-full flex justify-center items-center gap-2 py-2 border border-green_30 border-x-0 border-t-0">
      <span>Respuestas</span>
      <nuxt-icon name="double-arrow-right" filled class="no-margin filter-primary cursor-pointer"/>
    </div>
    <div class="w-full p-5">
      <div class="w-full flex flex-wrap gap-[5px] xl:w-auto grow">
      <div v-for="(pregunta, i) in cantidad" @click="() => onPageSelect(pregunta)">
        <div
          class="w-[43px] transition-colors cursor-pointer rounded-lg py-2 flex justify-center items-center"
          :class="`${
            preguntaActual === i + 1
              ? finish
                ? 'bg-green_60 text-white'
                : 'bg-blue_light text-white'
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
    </div> -->
    <div class="fixed left-0 bottom-0 bg-white lg:relative w-full flex justify-end gap-4 py-2 px-5">
      <BaseButton
        styles="!w-full max-w-[145px] text-white rounded-[6px]"
        :color="BtnColor.secondary"
        :disabled="finish || preguntaActual === 1"
        @click="back"
      >
        Anterior
      </BaseButton>

      <BaseButton
        styles="!w-full max-w-[145px] text-white rounded-[6px]"
        :color="BtnColor.default"
        @click="next"
        :disabled="guardadoPendiente.valueOf()"
      >
      Guardar respuesta
      </BaseButton>
    </div>
  </div>
</template>

<style>
.width-container {
  width: -webkit-fill-available;
}
.filter-primary {
  filter: brightness(0) saturate(100%) invert(41%) sepia(15%) saturate(1560%) hue-rotate(116deg) brightness(97%) contrast(93%);
}
</style>
