<script lang="ts" setup>
import type { Competencia, ResultadoEvaluacion } from '~/types/competencia.types';

const props = withDefaults(
  defineProps<{
    competencia: Competencia | null;
	data: ResultadoEvaluacion;
    approved: boolean;
}>(),
{
}
);

const valueStroke = !props.data ? 0 : 100 - props.data.puntaje;
</script>
<template>
    <div v-if="data" class="border border-gray_40 rounded-[10px] 
    overflow-hidden drop-shadow-[0px_4px_3.5px_-3px_rgba(0,0,0,0.09)]">
    <div
        class="bg-green_10 pt-[16px] pr-[13px] pb-[9px] pl-[7px] flex justify-between items-center border border-gray_40 border-x-0 border-t-0">
        <div class="flex gap-[7px] items-center">
            <nuxt-icon name="reading" class="text-[26px] no-margin" filled />
            <p class="text-gray-11 text-base font-bold capitalize">{{competencia?.nombreCompetencia.toLowerCase()}}</p>
        </div>
        
        <nuxt-icon :name="approved ? 'circle-check' : 'circle-x-mark'" class="text-2xl no-margin" filled />
        <!-- <img class="w-6 h-6" [src]="Approved ? iconCheck : iconMark" alt="icon-check"> -->
    </div>

    <div class="w-full text-black-1 pt-[19px] pb-[16px] text-sm leading-[21px] flex justify-center gap-1">N° total de preguntas: <p class="font-semibold">{{data.totalPreguntas}}</p> </div>

    <div class="flex flex-wrap justify-center items-center mb-5">
        <svg viewBox="0 0 36 36" class="w-[144px] h-[144px]">
            <path class="fill-none stroke-green_40 stroke-[3.8]" d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path class="circle-percentage stroke-green_20" :stroke-dasharray="`${valueStroke}, 100`" d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831" />
        </svg>
        <div class="absolute bg-white rounded-full flex w-[114px] h-[114px] items-center justify-center">
            <div class="flex flex-wrap h-fit">
                <p class="w-full text-base leading-[21px] text-blue-2 text-center">{{data.puntaje}} %</p>
                <p class="w-full text-sm leading-[21px] font-light text-blue-2 text-center">puntaje</p>
            </div>
        </div>
    </div>


    <div class="px-[22px] pb-[19px]">
        <div class="flex items-center mb-[15px]">
            <div class="w-[14px] h-[14px] rounded-full bg-green_40 mr-[3px]"></div>
            <p class="text-sm leading-[21px] text-black-1">N° de preguntas Correctas: </p>
            <p class="text-sm leading-[21px] font-semibold ml-[21px] text-gray-19">{{data.correctas}}</p>
         </div>
     
         <div class="flex items-center">
             <div class="w-[14px] h-[14px] rounded-full bg-green_20 mr-[3px]"></div>
             <p class="text-sm leading-[21px] text-black-1">N° de preguntas Incorrectas: </p>
             <p class="text-sm leading-[21px] font-semibold ml-[10px] text-gray-19">{{data.incorrectas}}</p>
          </div>
    </div>
</div>
</template>
<style>
.circle-percentage {
    fill: none;
    stroke-width: 3.8;
    stroke-linecap: butt;
    animation: progress 1s ease-out forwards;
}
</style>