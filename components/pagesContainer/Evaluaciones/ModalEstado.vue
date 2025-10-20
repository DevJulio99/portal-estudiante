<script lang="ts" setup>
import loader from "@/assets/images/expired-loader.png";
import exclamation from "@/assets/icons/circle-exclamation.svg";
import TiempoEvaluacion from "./tiempoEvaluacion.vue";
import type { ResumenPregunta } from "./preguntas.vue";
import { BtnColor } from "~/types/helper.types";
const props = withDefaults(
  defineProps<{
    show: boolean;
    resumen: ResumenPregunta;
    success?: boolean;
    wasNotSaved: boolean;
    finish?: () => void;
    onClose?: () => void;
    nextNotSave: () => void;
  }>(),
  {
    show: false,
    success: false,
    wasNotSaved: false,
    onClose: () => {},
    finish: () => {},
    nextNotSave: () => {},
  }
);

const examenStore = useExamenStore();

const pendientes = ref<number>(0);
const respondidas = ref<number>(0);
const preguntasRespondidas = computed(() => examenStore.preguntasRespondidas)
const preguntasPendientes = examenStore.lista.length - preguntasRespondidas.value.length;

const onBack = () => {
  props.onClose();
};

const onNext = () => {
  if (props.wasNotSaved) {
    props.nextNotSave();
  }
  if(examenStore.lista.length === props.resumen.currentQuestion){
    props.finish();
  }
  props.onClose();
};

const modalTitle = computed(() => {
  if (props.success) {
    return pendientes.value > 0
      ? "¡Resumen de la competencia 01: Comprensión lectora!"
      : "¡Resumen de su examen!";
  }
  return props.wasNotSaved ? "¡Su respuesta no se guardó!" : "¡Se acabó el tiempo!";
});

const buttonLabels = computed(() => {
  return pendientes.value > 0
    ? { back: "Volver", next: "Aceptar" }
    : { back: "No", next: "Sí" };
});

</script>

<template>
  <div
    v-if="show"
    class="fixed w-full h-full bg-black_transparent flex items-center justify-center top-0 left-0 z-40"
  >
    <div class="bg-white w-full max-w-[447px] p-6 rounded-lg xl:pt-10">
      <div class="w-full flex justify-center mb-[22px]">
        <img
          :class="success || wasNotSaved ? '' : 'spinner'"
          :src="success || wasNotSaved ? exclamation : loader"
          alt="loader"
        />
      </div>
      <span
        class="block text-xl font-semibold mb-[6px] text-center font-nunito"
        >{{ modalTitle }}</span      >
      <div v-if="!success && !wasNotSaved" class="flex justify-center mb-4">
        <TiempoEvaluacion :init="false" />
      </div>

      <span
        v-if="!wasNotSaved"
        class="w-full text-center block font-normal text-base text-gray1"
        >Preguntas respondidas: {{ preguntasRespondidas.length }}
      </span>
      <span
        v-if="!wasNotSaved"
        class="w-full text-center block font-normal text-base text-gray1 mb-[14px]"
        >Preguntas en blanco: {{ examenStore.lista.length - preguntasRespondidas.length }}</span
      >
      <div
        v-if="success && pendientes >= 0"
        class="mb-4 text-xs leading-[18px] font-normal text-gray1 text-center"
      >
        Por favor, complete las preguntas pendientes antes de que se agote el
        tiempo restante. Si no responde, las preguntas se considerarán sin
        respuesta y obtendrán 0 puntos.
      </div>

      <div v-if="!success" class="text-center text-neutron80 text-base font-medium mb-[14px]">
          Será redirigido a la vista de evaluaciones
      </div>

      <div
        v-if="success || wasNotSaved"
        class="pt-5 border border-[#E4E4E4] border-x-0 border-b-0 flex flex-wrap justify-center gap-[15px] items-center"
      >
        <BaseButton
          :color="BtnColor.blueLight"
          styles="!w-full max-w-[152px] text-white rounded-[6px]"
          @click="onBack"
        >
          {{ buttonLabels.back }}
        </BaseButton>

        <BaseButton
          :color="BtnColor.blueLight"
          styles="!w-full max-w-[152px] text-white rounded-[6px]"
          @click="onNext"
        >
          {{ buttonLabels.next }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style>
.spinner {
  transition-duration: 0.2s;
  animation: spin 1.2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
