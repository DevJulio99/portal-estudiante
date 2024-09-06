<script lang="ts" setup>
export interface ResumenPregunta {
  respondidas: number;
  pendientes: number;
}

const props = withDefaults(
  defineProps<{
    cantidad: number;
    preguntaActual: number;
    preguntaRespondida: boolean;
    onBack: () => void;
    onNext: () => void;
    onEnd: (resument: ResumenPregunta) => void;
  }>(),
  {
    cantidad: 0,
    preguntaActual: 1,
    preguntaRespondida: false,
  }
);

const preguntaActual_ = ref(props.preguntaActual);
const respuestasRespondidas = ref<number[]>([]);
const respuestasPendientes = ref<number[]>([]);

const NumeroPregunta = (numero: number) =>
  numero < 10 ? `0${numero}` : numero;

const next = () => {
  if (preguntaActual_.value !== props.cantidad) {
    (props.preguntaRespondida) &&
      respuestasRespondidas.value.push(preguntaActual_.value);
    (!props.preguntaRespondida && !respuestasRespondidas.value.includes(preguntaActual_.value)) &&
      respuestasPendientes.value.push(preguntaActual_.value);
    preguntaActual_.value = preguntaActual_.value + 1;
    // mapPreguntas();
    props.onNext();
  }

  if(preguntaActual_.value === props.cantidad && props.preguntaRespondida) {
    // console.log('temino preguntas');
    respuestasRespondidas.value.push(preguntaActual_.value);
    mapPreguntas();

    props.onEnd({
      respondidas: respuestasRespondidas.value.length,
      pendientes: respuestasPendientes.value.length
    });
  }

  // console.log('preguntaActual_.value', preguntaActual_.value);
  // console.log('props.preguntaRespondida', props.preguntaRespondida);
  
};

const back = () => {
    if (preguntaActual_.value !== 1) {
        preguntaActual_.value = preguntaActual_.value - 1;
        props.onBack();
    }
}

const mapPreguntas = () => {
  const respuestasBorrar = [];
  const nuevosPendientes = [];
  for(const numeroResp of respuestasRespondidas.value){
      if(respuestasPendientes.value.includes(numeroResp)){
        respuestasBorrar.push(numeroResp);
      }
  }

  for(const pendiente of respuestasPendientes.value){
    if(!respuestasBorrar.includes(pendiente)){
      nuevosPendientes.push(pendiente);
    }
  }
  
  // console.log('respuestasBorrar', respuestasBorrar);
  // console.log('nuevosPendientes', nuevosPendientes);
  respuestasPendientes.value = nuevosPendientes;
}
</script>

<template>
  <div
    class="w-full mt-[32px] flex flex-wrap bg-white pt-[23px] pr-[31px] pb-[25px] pl-[35px] gap-[21px] lg:justify-between items-center"
  >
    <div class="w-full flex flex-wrap gap-[5px] xl:w-auto">
      <div v-for="(pregunta, i) in cantidad">
        <div
          class="w-[43px] h-[12px] transition-colors"
          :class="`${
            preguntaActual_ === i + 1
              ? 'bg-blue_light'
              : respuestasRespondidas.includes(i + 1) 
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
          class="w-full text-center font-telegraf text-black font-medium font-xs"
        >
          {{ NumeroPregunta(i + 1) }}
        </p>
      </div>
    </div>

    <div class="w-full flex flex-wrap justify-center gap-4 xl:w-auto">
      <BaseButton
        styles="!w-full max-w-[109px] !bg-blue_light text-white rounded-[6px]"
        @click="back"
      >
        Anterior
      </BaseButton>

      <BaseButton
        styles="!w-full max-w-[109px] !bg-blue_light text-white rounded-[6px]"
        @click="next"
      >
        Siguiente
      </BaseButton>
    </div>
  </div>
</template>
