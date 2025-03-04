<script lang="ts" setup>
import Card from '~/components/pagesContainer/ResultadoEvaluacion/card.vue';
import type { ResultadoEvaluacion } from '~/types/competencia.types';

definePageMeta({
  middleware: "auth",
});

const { $api } = useNuxtApp();
const postulanteStore = usePostulanteStore();
const competenciaStore = useResultadoCompetenciaStore();
const estadoEvaluacion = ref('0');
const resultadoEvaluacion = ref<ResultadoEvaluacion[]>([]);
const router = useRouter();

const {data: dataResultados, error: errorEstados, pending} = await $api.resultadoCompetencia.listarCompetencias(postulanteStore.data?.idPostulante ?? 0, competenciaStore.competenciaSeleccionada?.id_compentencia ?? 0, {lazy: true,})

watch(dataResultados, (lista)  => {
    console.log('response resultados', lista)
  if(lista?.data.length){
    resultadoEvaluacion.value = lista.data;
    const sumapuntaje = lista.data.map(x => x.puntaje).reduce((acc, val) => acc + val, 0) / lista.data.length;
    estadoEvaluacion.value = lista.data.length ? (sumapuntaje >= 70 ? '1' : '2') : '0'
  }
});

const back = () => {
    router.push('/resultado-competencias')
}

</script>

<template>
    <div class="w-full max-w-[1083px] bg-white rounded-[10px] pt-[22px] pl-[25px] pb-[39px] pr-[19px]">
    <div
        class="w-full bg-green_30 rounded-[10px] flex justify-between items-center pt-[12px] pl-[19px] pb-[16px] pr-[15px]">
        <div class="flex gap-2.5 items-center">
            <nuxt-icon name="Chalkboard" class="text-[50px] no-margin" filled />
            <span>
                <p class="text-white font-semibold text-xl leading-[30px]">Puntaje total de evaluación: {{resultadoEvaluacion?.[0]?.puntaje}}pts</p>
                <p class="text-white font-semibold text-sm leading-[21px]">*Puntaje minimo aprobatorio: 70 pts</p>
            </span>
        </div>
        <div v-if="estadoEvaluacion !== '0'" 
        class="flex py-2.5 px-[9.5px] gap-[6px] rounded-[10px] items-center h-[46px]"
        :class="{
            'bg-error': estadoEvaluacion == '2',
            'bg-green_40': estadoEvaluacion == '1'
        }">
            <nuxt-icon name="book-mark" class="text-[26px] no-margin" filled />
            <p class="text-base text-white font-semibold">Condición: {{estadoEvaluacion == '1' ? 'Aprobado': 'Desaprobado'}}</p>
        </div>
    </div>

    <div v-if="pending" class="text-xs text-black py-16">
			<BaseStatusLoading />
	</div>

    <div class="w-full" v-else-if="!errorEstados">
        <div class="flex flex-wrap gap-[29px] mt-6 justify-center" v-if="resultadoEvaluacion.length">
            <Card v-for="data in resultadoEvaluacion" :data="data" 
                  :competencia="competenciaStore.competenciaSeleccionada" />
        </div>
    
        <div class="flex justify-center items-center gap-[21px] mt-10">
            <button
                class="flex items-center justify-center w-full max-w-[220px] rounded-md text-sm bg-green_20 text-black h-[34px] font-semibold"
                @click="back"
                >Volver</button>
            <button class="flex items-center justify-center w-full max-w-[220px] rounded-md text-sm 
                            h-[34px] bg-green_40 text-black font-semibold">Visualizar resultados</button>
        </div>
    </div>
</div>
</template>