<script lang="ts" setup>
import type { Competencia, ResultadoEvaluacion } from '~/types/competencia.types';

const props = withDefaults(
  defineProps<{
    competencia: Competencia | null;
	data: ResultadoEvaluacion;
    approved: boolean;
}>(),
{}
);

const valueStroke = !props.data ? 0 : 100 - (props.data.puntaje + valueEnBlanco);
const dashOffset = props.data.porcentajeIncorrecto > props.data.porcentajeBlanco ? (props.data.porcentajeIncorrecto - props.data.porcentajeBlanco) : (props.data.porcentajeIncorrecto + props.data.porcentajeBlanco);
</script>

<template>
    <div v-if="data" class="relative rounded-3xl overflow-hidden bg-[#edf9f6] shadow-2xl">
        <div class="flex flex-col lg:flex-row">
            <div class="relative lg:w-1/3 p-10 bg-[#daf3ec] flex items-center justify-center">
                <svg viewBox="0 0 36 36" class="w-[140px] h-[140px]">
                    <path
                        class="fill-none stroke-[#22C55E] stroke-[4.2]"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                        class="circle-percentage stroke-[#F15656]"
                        :stroke-dasharray="`${data.porcentajeIncorrecto}, 100`"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                        class="circle-percentage stroke-[#FFE6FB]"
                        :stroke-dasharray="`${data.porcentajeBlanco}, 100`"
                        :stroke-dashoffset="`${data.porcentajeIncorrecto > 0 ? (dashOffset) : 0}`"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                </svg>
                <div class="absolute w-[105px] h-[105px] bg-white rounded-full flex items-center justify-center shadow-lg">
                    <div class="text-center">
                        <p class="text-2xl font-extrabold text-[#475569]">{{ data.puntaje }}%</p>
                        <p class="text-base text-[#64748B]">Puntaje</p>
                    </div>
                </div>
            </div>

            <div class="p-10 lg:w-2/3 flex flex-col gap-8">
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-4">
                        <nuxt-icon name="reading" class="text-3xl" filled />
                        <h3 class="text-2xl font-bold text-[#1F2937] capitalize">{{ competencia?.nombreCompetencia }}</h3>
                    </div>
                </div>

                <p class="text-[#475569] text-base">Total de preguntas: <span class="font-semibold">{{ data.totalPreguntas }}</span></p>

                <div class="lg:grid grid-cols-2 gap-6 lg:space-y-0 space-y-3">
                    <div class="flex items-center gap-4">
                        <div class="w-6 h-6 rounded-full bg-[#22C55E] aspect-square"></div>
                        <p class="text-base text-[#475569]">Correctas:</p>
                        <span class="ml-auto text-base font-semibold text-[#111827]">{{ data.correctas }}</span>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="w-6 h-6 rounded-full bg-[#F15656] aspect-square"></div>
                        <p class="text-base text-[#475569]">Incorrectas:</p>
                        <span class="ml-auto text-base font-semibold text-[#111827]">{{ data.incorrectas }}</span>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="w-6 h-6 rounded-full bg-magenta_10 aspect-square"></div>
                        <p class="text-base text-[#475569]">En blanco:</p>
                        <span class="ml-auto text-base font-semibold text-[#111827]">{{ data.enblanco }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>  

<style>
.circle-percentage {
  fill: none;
  stroke-width: 4.1;
  stroke-linecap: round;
  animation: progress 1.2s ease-out forwards;
}
</style>
