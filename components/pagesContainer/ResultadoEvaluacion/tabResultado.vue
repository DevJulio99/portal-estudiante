<script lang="ts" setup>
import type { PreguntaResultado } from '~/types/competencia.types';
import type { ResultadoEvaluacion } from '~/types/competencia.types';

const props = defineProps<{
    resultado: ResultadoEvaluacion;
}>();

const dividirArreglo = (arr: PreguntaResultado[], tamaño: number) => {
    const resultado = [];
    for (let i = 0; i < arr.length; i += tamaño) {
        resultado.push(arr.slice(i, i + tamaño));
    }
    return resultado;
}

const preguntas = dividirArreglo(props.resultado.preguntas,10);
const preguntasResponsive = dividirArreglo(props.resultado.preguntas,2);
const isLargeScreen = useMediaQuery('(min-width: 1024px)');
</script>
<template>
  <div>
    <!-- <div class="flex gap-0.5">
      <div
        class="bg-primary rounded-t-lg font-medium pr-[18px] pl-[19px] pt-[3px] pb-[2px] text-white transition-colors text-sm leading-[21px] bg-gray-21 cursor-pointer"
      >
        {{ resultado.competencia.nombreCompetencia }}
      </div>
    </div> -->

    <div
      class="w-full border border-green_10 rounded-lg pt-[22px] pr-[28px] pb-[17px] pl-[29px]"
    >
      <div class="flex justify-between items-center mb-6">
        <p
          class="text-sm leading-[21px] tracking-[0.15px] font-semibold text-gray-19"
        >
          Resumen de la evaluación:
        </p>
        <div
          class="rounded-[10px] border text-sm leading-[21px] font-semibold px-3.5 h-auto lg:h-[35px] flex gap-[6px] justify-center items-center"
          :class="{
            'border-[#92400E] text-[#92400E]': resultado.puntaje < resultado.competencia.puntajeMinimoAprobatorio,
            'border-[#065F46] text-[#065F46]' : resultado.puntaje >= resultado.competencia.puntajeMinimoAprobatorio
          }"
          >
          <nuxt-icon name="birreteIcon" class="text-[18px] no-margin" 
                     :class="{
                       'text-[#065F46]': resultado.puntaje >= resultado.competencia.puntajeMinimoAprobatorio,
                       'text-[#92400E]': resultado.puntaje < resultado.competencia.puntajeMinimoAprobatorio
                     }" />
          <p>
            Situación:
            {{
              resultado.puntaje >= resultado.competencia.puntajeMinimoAprobatorio
                ? "Aprobado"
                : "Desaprobado"
            }}
          </p>
        </div>
      </div>

      <div class="flex justify-center mb-9 rounded-lg shadow-[0_1px_4px_rgba(0,0,0,0.15)]">
        <div
          class="h-auto grid grid-cols-2 gap-3 py-3 lg:py-0 lg:gap-0 lg:flex flex-wrap lg:flex-nowrap items-center text-center rounded-[10px] border-[0.9px] border-white filter lg:h-[83px]"
        >
          <div class="pl-[15px] pr-[23px]">
            <p class="text-xs leading-[18px] font-medium mb-2 text-gray-16">
              Total Preguntas
            </p>
            <p class="font-bold text-[18px] leading-[27px] block text-center">
              {{ resultado.preguntas.length }}
            </p>
          </div>
          <div v-if="isLargeScreen" class="bg-gray-17 w-[1px] h-[35px]"></div>
          <div class="px-[23px]">
            <p class="text-xs leading-[18px] font-medium mb-2 text-gray-16">
              Puntos por pregunta
            </p>
            <p class="font-bold text-[18px] leading-[27px] block text-center">
              {{ resultado.competencia.puntajePregunta }}
            </p>
          </div>
          <div v-if="isLargeScreen" class="bg-gray-17 w-[1px] h-[35px]"></div>
          <div class="px-[23px]">
            <p class="text-xs leading-[18px] font-medium mb-2 text-gray-16">
              Correctas
            </p>
            <p class="font-bold text-[18px] leading-[27px] flex gap-[12px] justify-center lg:justify-center">
              <nuxt-icon name="circle-check" class="text-[26px] no-margin" filled />
              {{ resultado.correctas }}
            </p>
          </div>

          <div class="px-[23px]">
            <p class="text-xs leading-[18px] font-medium mb-2 text-gray-16">
              Incorrectas
            </p>
            <p class="font-bold text-[18px] leading-[27px] flex gap-[12px] justify-center lg:justify-center">
              <nuxt-icon name="circle-x-mark" class="text-[26px] no-margin" filled />
              {{ resultado.incorrectas }}
            </p>
          </div>

          <div class="px-[23px]">
            <p class="text-xs leading-[18px] font-medium mb-2 text-gray-16">
              Sin resolver
            </p>
            <p class="font-bold text-[18px] leading-[27px] flex gap-[12px] justify-center lg:justify-center">
              <nuxt-icon name="circle-question" class="text-[26px] no-margin" filled />
              {{ resultado.enblanco }}
            </p>
          </div>
          <div v-if="isLargeScreen" class="bg-gray-17 w-[1px] h-[35px]"></div>
          <div class="pl-[23px] pr-[15px] text-blue-ev">
            <p class="text-xs leading-[18px] font-medium mb-2">
              Puntaje obtenido
            </p>
            <p
              class="text-[18px] leading-[27px] block text-center font-extrabold"
            >
              {{ resultado.puntaje }}
            </p>
          </div>
        </div>
      </div>

      <span
        class="block text-gray-19 text-sm leading-[21px] tracking-[0.15px] font-semibold mb-[11px]"
        >Resultado por pregunta:</span
      >

      <div>
        <div
          class="w-full border border-green_20 border-x-0 border-t-0 rounded-[5px] overflow-hidden"
        >
          <div v-if="isLargeScreen">
            <div v-for="(arregloPreguntas, i_pre) in preguntas">
            <div
              class="bg-[#d4e4f1] flex justify-center items-center gap-[35px] h-[40px]"
            >
              <div
              v-for="(pregunta, i) in arregloPreguntas"
                class="text-gray15-color w-[45px] flex items-cemter text-xs leading-[18px] font-semibold"
              >
                N° {{ i + (i_pre > 0 ? i_pre * 11 : 1) }}
              </div>
            </div>
            <div class="flex justify-center items-center gap-[5px] lg:gap-[35px] h-[85px]">
              <div
              v-for="(fila, i) in arregloPreguntas"
                class="w-[45px]"
              >
              <nuxt-icon  :name="fila.estado === 1 ? 'circle-check' : (fila.estado === 2 ? 'circle-x-mark' : 'circle-question')" class="text-[26px] no-margin" filled />
              </div>
            </div>
          </div>
          </div>

          <div v-else>
            <div v-for="(arregloPreguntas, i_pre) in preguntasResponsive">
            <div
              class="bg-[#d4e4f1] grid grid-cols-2 justify-center items-center gap-[35px] h-[40px]"
            >
              <div
              v-for="(pregunta, i) in arregloPreguntas"
                class="w-full text-gray15-color w-[45px] flex items-center justify-center text-xs leading-[18px] font-semibold"
              >
                N° {{ i + (i_pre > 0 ? i_pre * 3 : 1) }}
              </div>
            </div>
            <div class="grid grid-cols-2 justify-center items-center gap-[35px] h-[85px]">
              <div
              v-for="(fila, i) in arregloPreguntas"
                class="w-full flex justify-center"
              >
              <nuxt-icon  :name="fila.estado === 1 ? 'circle-check' : (fila.estado === 2 ? 'circle-x-mark' : 'circle-question')" class="text-[26px] no-margin" filled />
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.filter-text-green40 {
  filter: brightness(0) saturate(100%) invert(80%) sepia(54%) saturate(360%) hue-rotate(63deg) brightness(106%) contrast(97%);
}

.filter-text-error {
    filter: brightness(0) saturate(100%) invert(17%) sepia(58%) saturate(5821%) hue-rotate(346deg) brightness(106%) contrast(73%);
}

</style>
