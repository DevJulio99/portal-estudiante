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
  }>(),
  {
    cantidad: 0,
    preguntaActual: 1,
    preguntaRespondida: false,
    finish: false,
    wasNotSaved: false,
    forceNext: false,
    onAskNext: () => {},
    onNextFinish: () => {}
  }
);

const preguntaActual_ = ref(props.preguntaActual);
const respuestasRespondidas = ref<number[]>([]);
const respuestasPendientes = ref<number[]>([]);
const answeredAll = ref(false);
const examenStore = useExamenStore();
const competenciaStore = useCompetenciaStore();
const guardadoPendiente = computed(() => examenStore.guardadoPendiente)
const preguntasRespondidas = computed(() => examenStore.preguntasRespondidas)

const NumeroPregunta = (numero: number) =>
  numero < 10 ? `0${numero}` : numero;

const next = () => {
  // console.log("preguntaRespondida_", props.preguntaRespondida);
  //console.log("preguntaActual_.value", preguntaActual_.value);
    
  if(preguntaActual_.value === props.cantidad){
    //console.log('examenStore.preguntaActua', examenStore.preguntaActual)
    props.onLastQuestion();
  }

  if (preguntaActual_.value !== props.cantidad) {
    if (props.preguntaRespondida) {
      console.log("props.preguntaRespondida", props.preguntaRespondida);
      if (
        !respuestasRespondidas.value.includes(preguntaActual_.value) &&
        preguntaActual_.value <= props.cantidad
      ) {
        respuestasRespondidas.value.push(preguntaActual_.value);
        updatePending(preguntaActual_.value);
      }
      preguntaActual_.value = preguntaActual_.value + 1;
      examenStore.setpreguntaActual(preguntaActual_.value);
      props.onNext(getResumen());
    }

    if (!props.preguntaRespondida) {
      preguntaActual_.value = preguntaActual_.value + 1;
      // examenStore.setpreguntaActual(preguntaActual_.value);
      props.onNext(getResumen());
      // if(preguntasRespondidas.value.includes(preguntaActual_.value)){
      //   preguntaActual_.value = preguntaActual_.value + 1;
      //   examenStore.setpreguntaActual(preguntaActual_.value);
      //   props.onNext(getResumen());
      // }else {
      //   console.log('ask')
      //   //props.onAskNext();
      // }
      
    }
  } else {
    if(answeredAll.value && props.cantidad === preguntaActual_.value) {
    //console.log('ahora redirigir al final')
    props.onNextFinish();
    }
  }

  
  if(respuestasRespondidas.value.length === props.cantidad) {
    // console.log('respuestasRespondidas.value', respuestasRespondidas.value)
    // console.log('habilitar siguiente porque respondio todas las preguntas')
    answeredAll.value = true;
  }
};

const registerPending = () => {
  !respuestasRespondidas.value.includes(preguntaActual_.value) &&
    !respuestasPendientes.value.includes(preguntaActual_.value) &&
    respuestasPendientes.value.push(preguntaActual_.value);
  preguntaActual_.value = preguntaActual_.value + 1;
  examenStore.setpreguntaActual(preguntaActual_.value);
  props.onNext(getResumen());
};
 
const getResumen = () => ({
  respondidas: respuestasRespondidas.value.length,
  pendientes: respuestasPendientes.value.length,
  currentQuestion: preguntaActual_.value,
  idsAnswered: respuestasRespondidas.value,
});

const updatePending = (questionNumber: number) => {
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
  if (preguntaActual_.value !== 1) {
    preguntaActual_.value = preguntaActual_.value - 1;
    examenStore.setpreguntaActual(preguntaActual_.value);
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
</script>

<template>
  <div
    class="absolute bottom-0 left-0 w-full flex flex-wrap bg-white pt-[23px] pr-[31px] pb-[25px] pl-[35px] gap-[21px] lg:justify-between items-center"
  >
    <div class="w-full flex flex-wrap gap-[5px] xl:w-auto grow">
      <div v-for="(pregunta, i) in cantidad">
        <div
          class="w-[43px] h-[12px] transition-colors"
          :class="`${
            preguntaActual_ === i + 1
              ? finish
                ? 'bg-green_60'
                : 'bg-blue_light'
              : preguntasRespondidas.includes(i + 1)
              ? 'bg-green_60'
              : respuestasPendientes.includes(i + 1)
              ? 'bg-gray_60'
              : 'bg-gray_60'
          } ${
            i == 0
              ? 'rounded-l-[6px]'
              : i + 1 === cantidad
              ? 'rounded-r-[6px]'
              : ''
          }`"
        ></div>
        <p
          class="w-full text-center font-nunito text-black font-medium font-xs"
        >
          {{ NumeroPregunta(i + 1) }}
        </p>
      </div>
    </div>

    <div class="w-full flex max-w-[200px] justify-center gap-4">
      <BaseButton
        styles="!w-full max-w-[109px] text-white rounded-[6px]"
        :color="BtnColor.blueLight"
        :disabled="finish || preguntaActual_ === 1"
        @click="back"
      >
        Anterior
      </BaseButton>

      <BaseButton
        styles="!w-full max-w-[109px] text-white rounded-[6px]"
        :color="BtnColor.blueLight"
        @click="next"
        :disabled="guardadoPendiente.valueOf()"
      >
        Siguiente
      </BaseButton>
    </div>
  </div>
</template>
