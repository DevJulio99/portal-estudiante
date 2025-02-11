<script lang="ts" setup>
import check from "@/assets/icons/circle-check.svg";
import type { timeEvaluation } from "./tiempoEvaluacion.vue";
import TiempoEvaluacion from "./tiempoEvaluacion.vue";

const props = withDefaults(
  defineProps<{
    time?: timeEvaluation;
  }>(),
  {
    time: undefined
  }
);

const competenciaStore = useCompetenciaStore();

const vistaPrincipal = () => {
  return navigateTo("/evaluaciones", { replace: true });
}
</script>

<template>
  <div
    class="bg-white rounded-lg pt-[36px] px-6 pb-[45px] w-full max-w-[763px] flex flex-wrap justify-center items-center"
  >
    <img :src="check" alt="icon-check" class="mb-[15px]" />

    <div class="w-full mb-4 flex flex-wrap justify-center">
      <span class="mb-[13px] text-black font-normal text-[25px] leading-[30px] text-center"
        >¡Usted ha terminado la evaluación de {{competenciaStore.competenciaSeleccionada?.nombreCompetencia.toLocaleLowerCase()}}!</span
      >
      <p class="w-full max-w-[554px] text-gray1 text-[15px] leading-[18px] text-center">
        Puede regresar a la pantalla principal
      </p>
    </div>
    <!-- <TiempoEvaluacion
          :stop="true"
          :init="false"
          :time-defect="time"
        /> -->
      <div class="flex justify-center items-center">
           <button class="h-[40px] rounded-lg text-white bg-primary px-4" @click="vistaPrincipal">Regresar a evaluaciones</button>
      </div>
  </div>
</template>
