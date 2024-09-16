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
    finish?: () => void;
    onClose?: () => void;
  }>(),
  {
    show: false,
    success: false,
    onClose: () => {},
    finish: () => {},
  }
);

const onBack = () => {
  props.onClose();
};

const onNext = () => {
  const finishQuestions = !props.resumen.pendientes;

  if (finishQuestions) {
    props.finish();
  }
  props.onClose();
};
</script>

<template>
  <div
    v-if="show"
    class="fixed w-full h-full bg-black_transparent flex items-center justify-center top-0 left-0 z-40"
  >
    <div class="bg-white w-full max-w-[447px] p-6 rounded-lg xl:pt-10">
      <div class="w-full flex justify-center mb-[22px]">
        <img
          :class="success ? '' : 'spinner'"
          :src="success ? exclamation : loader"
          alt="loader"
        />
      </div>
      <span
        class="block text-xl font-medium mb-[6px] text-center font-telegraf"
        >{{
          success
            ? resumen.pendientes > 0
              ? "¡Resumen de la competencia 01: Comprensión lectora!"
              : "¡Resumen de su examen!"
            : "¡Se acabo el tiempo!"
        }}</span
      >
      <div v-if="!success" class="flex justify-center mb-4">
        <TiempoEvaluacion :init="false" />
      </div>

      <span class="w-full text-center block font-normal text-base text-gray1"
        >Preguntas respondidas: {{ resumen.respondidas }}
      </span>
      <span
        class="w-full text-center block font-normal text-base text-gray1 mb-[14px]"
        >Preguntas en blanco: {{ resumen.pendientes }}</span
      >

      <div v-if="success && !resumen.pendientes" class="mb-4 text-gray1 text-sm leading-[21px] font-normal text-center">
        Usted desea pasar a la Competencia 02: Razonamiento Crítico
      </div>

      <div v-if="success && !resumen.pendientes" class="mb-4 text-gray1 text-xs leading-[18px] font-normal text-center">
        ¿Está seguro
        que desea avanzar y finalizar la competencia 01: Comprensión lectora?
      </div>

      <div
        v-if="success && resumen.pendientes > 0"
        class="mb-4 text-xs leading-[18px] font-normal text-gray1 text-center"
      >
        Por favor, complete las preguntas pendientes antes de que se agote el
        tiempo restante. Si no responde, las preguntas se considerarán sin
        respuesta y obtendrán 0 puntos.
      </div>

      <div
        v-if="!success"
        class="text-center text-neutron80 text-base font-medium mb-[14px]"
      >
        Usted está siendo redirigido automáticamente a la competencia 02:
        Razonamiento crítico
      </div>

      <div
        v-if="!success"
        class="font-normal text-base text-gray1 font-normal text-center"
      >
        Por favor, espere mientras se carga la competencia indicada.
      </div>

      <div
        v-if="success"
        class="pt-5 border border-[#E4E4E4] border-x-0 border-b-0 flex flex-wrap justify-center gap-[15px] items-center"
      >
        <BaseButton
          :color="BtnColor.blueLight"
          styles="!w-full max-w-[152px] text-white rounded-[6px]"
          @click="onBack"
        >
          {{ resumen.pendientes > 0 ? "Volver" : "No" }}
        </BaseButton>

        <BaseButton
          :color="BtnColor.blueLight"
          styles="!w-full max-w-[152px] text-white rounded-[6px]"
          @click="onNext"
        >
          {{ resumen.pendientes > 0 ? "Aceptar" : "Si" }}
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
