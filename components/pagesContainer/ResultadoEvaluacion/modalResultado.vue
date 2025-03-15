<script lang="ts" setup>
import type { Competencia, ResultadoEvaluacion } from '~/types/competencia.types';
import TabResultado from './tabResultado.vue';

defineProps<{
    onClose: () => void;
}>()

const profrileStore = useProfileStore();
const resultadoCompetenciaStore = useResultadoCompetenciaStore();

const dataResultado = ref<ResultadoEvaluacion>();
const dataCompetencia = ref<Competencia>();

onMounted(() => {
    if(resultadoCompetenciaStore.listaResultados.length){
        dataResultado.value = resultadoCompetenciaStore.listaResultados[0];
    }

    if(resultadoCompetenciaStore.listaCompetencia.length){
        dataCompetencia.value = resultadoCompetenciaStore.listaCompetencia[0];
    }
})
</script>

<template>
    <div class="fixed flex justify-center w-full h-full z-50 top-[56px] pt-[50px] pb-[106px] left-0">

<div class="w-full h-full max-w-[971px] pt-[26px] pr-[26px] pl-[30px] bg-white z-10">
    <div class="w-full max-w-[891px] flex gap-[7px] border border-green_10 border-x-0 border-t-0 pb-2.5 mb-[17px]">
        <nuxt-icon name="file-lines" class="text-2xl no-margin filter-green10" filled />
        <p class="text-blue-3 text-xl leading-[30px]">Resultados del postulante de la Evaluación de Competencias
            Generales</p>
    </div>

    <div class="content-scroll-results h-[70%] overflow-auto">
        <div class="pr-[18px]">
            <div class="bg-green_10 rounded-md h-[38px] text-blue-3 text-base font-semibold flex items-center px-[11px] mb-[17px]">
                Datos del Postulante</div>
            <div class="w-full rounded-lg border border-green_10 pt-2.5 px-[14px] pb-[11px] mb-[17px]">
                <div class="flex gap-5 text-sm leading-[21px] pt-[5px] pb-[4px] text-gray15-color">
                    <div class="w-[199px] font-semibold">DNI: </div>
                    <div>{{conditionedString(profrileStore.profileData.data?.documenIdentida ?? '')}}</div>
                </div>
                <div class="flex gap-5 text-sm leading-[21px] pt-[5px] pb-[4px] text-gray15-color">
                    <div class="w-[199px] font-semibold">Nombres Completo: </div>
                    <div>{{conditionedString(profrileStore.profileData.data?.fullName ?? '')}}</div>
                </div>
                <div class="flex gap-5 text-sm leading-[21px] pt-[5px] pb-[4px] text-gray15-color">
                    <div class="w-[199px] font-semibold">Región: </div>
                    <div>{{ conditionedString('-') }}</div>
                </div>
                <div class="flex gap-5 text-sm leading-[21px] pt-[5px] pb-[4px] text-gray15-color">
                    <div class="w-[199px] font-semibold">Institución educativa: </div>
                    <div>{{conditionedString('-')}}</div>
                </div>
                <div class="flex gap-5 text-sm leading-[21px] pt-[5px] pb-[4px] text-gray15-color">
                    <div class="w-[199px] font-semibold">Fecha de examen:  </div>
                    <div>{{conditionedString(dataCompetencia?.tiempoFinalizado ?? '')}}</div>
                </div>
                <div class="flex gap-5 text-sm leading-[21px] pt-[5px] pb-[4px] text-gray15-color">
                    <div class="w-[199px] font-semibold">Evaluación: </div>
                    <div>{{ conditionedString(dataCompetencia?.nombreCompetencia ?? '') }}</div>
                </div>
                <div class="flex gap-5 text-sm leading-[21px] pt-[5px] pb-[4px] text-gray15-color">
                    <div class="w-[199px] font-semibold">Puntaje final del postulante: </div>
                    <div>{{conditionedString(dataResultado?.puntaje.toString() ?? '')}}</div>
                </div>
            </div>
            
            <div class="w-full" v-if="dataResultado">
                <div class="bg-green_10 rounded-md h-[38px] text-blue-3 text-base font-semibold flex items-center px-[11px] mb-[17px]">
                    Resultados de la evaluación</div>
                    <TabResultado :resultado="dataResultado"/>
            </div>
        </div>
    </div>

    <div class="w-full flex justify-center items-center pt-[22px] pb-[25px]">
        <button class="rounded-md text-white h-[36px] w-full max-w-[147px] font-bold
        text-sm leading-5 bg-primary" @click="onClose">Cerrar</button>
    </div>
</div>

<div class="absolute top-0 left-0 w-full h-full bg-black_transparent" @click="onClose"></div>
</div>
</template>

<style>
.content-scroll-results::-webkit-scrollbar{
    width: 6px;
}

.content-scroll-results::-webkit-scrollbar-track{
    background-color: rgba(217, 217, 217, 1); 
    border-radius: 5px;
}

.content-scroll-results::-webkit-scrollbar-thumb{
    background:  #287F6B; 
    border-radius: 5px;
}

.filter-green20 {
    filter: brightness(0) saturate(100%) invert(97%) sepia(25%) saturate(328%) hue-rotate(52deg) brightness(95%) contrast(91%);
}
</style>