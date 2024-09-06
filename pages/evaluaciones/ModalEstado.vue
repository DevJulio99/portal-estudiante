<script lang="ts" setup>
import loader from "@/assets/images/expired-loader.png";
import TiempoEvaluacion from "./tiempoEvaluacion.vue";
const props = defineProps<{
  show: boolean;
}>();
</script>

<template>
  <div
    v-if="show"
    class="fixed w-full h-full bg-black_transparent flex items-center justify-center top-0 left-0 z-40"
  >
    <div class="bg-white w-full max-w-[447px] p-6 rounded-lg xl:pt-10">
      <div class="w-full flex justify-center mb-[22px]">
        <img class="spinner" :src="loader" alt="loader" />
      </div>
      <span class="block text-xl font-medium mb-[6px] text-center font-telegraf"
        >¡Se acabo el tiempo!</span
      >
      <div class="flex justify-center mb-4">
        <TiempoEvaluacion :init="false" />
      </div>

      
        <span class="w-full text-center block font-normal text-base text-gray1"
          >Preguntas respondidas: 20
        </span>
        <span class="w-full text-center block font-normal text-base text-gray1 mb-[14px]"
          >Preguntas en blanco: 0</span
        >

      <div class="text-center text-neutron80 text-base font-medium mb-[14px]">
        Usted está siendo redirigido automáticamente a la competencia 02:
        Razonamiento crítico
      </div>

      <div class="font-normal text-base text-gray1 font-normal text-center">
        Por favor, espere mientras se carga la competencia indicada.
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
        transform: rotate(0deg)
    }

    100% {
        transform: rotate(360deg)
    }
}
</style>
