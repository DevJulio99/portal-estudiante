<script lang="ts" setup>
import Card from '~/components/pagesContainer/ResultadoEvaluacion/card.vue';
import ModalResultado from '~/components/pagesContainer/ResultadoEvaluacion/modalResultado.vue';
import type { ResultadoEvaluacion } from '~/types/competencia.types';

definePageMeta({
  middleware: "auth",
});

const { $api } = useNuxtApp();
const postulanteStore = usePostulanteStore();
const competenciaStore = useResultadoCompetenciaStore();
const estadoEvaluacion = ref('0');
const resultadoEvaluacion = ref<ResultadoEvaluacion[]>([]);
const mostrarModal = ref(false);
const router = useRouter();

const {data: dataResultados, error: errorEstados, pending} = await $api.resultadoCompetencia.listarCompetencias(postulanteStore.data?.idPostulante ?? 0, competenciaStore.competenciaSeleccionada?.id_compentencia ?? 0, {lazy: true,})

watch(dataResultados, (lista)  => {
    console.log('response resultados', lista)
  if(lista?.data.length){
    resultadoEvaluacion.value = lista.data;
    competenciaStore.setResultados(lista.data);
    const sumapuntaje = lista.data.map(x => x.puntaje).reduce((acc, val) => acc + val, 0) / lista.data.length;
    estadoEvaluacion.value = lista.data.length ? (sumapuntaje >= lista.data[0].competencia.puntajeMinimoAprobatorio ? '1' : '2') : '0'
  }
});

const back = () => {
    router.push('/resultado-competencias')
}

const abrirModal = () =>  mostrarModal.value = true;
const cerraModal = () =>  mostrarModal.value = false;

onBeforeUnmount(() => {
    competenciaStore.setResultados([]);
});

</script>

<template>
    <div class="w-full max-w-[1083px] bg-white rounded-[10px] pt-[22px] pl-[25px] pb-[39px] pr-[19px]">
    <div
        class="w-full bg-green_10 rounded-[10px] flex justify-between items-center pt-[12px] pl-[19px] pb-[16px] pr-[15px]">
        <div class="flex gap-2.5 items-center text-[#0c2520]">
            <nuxt-icon name="Chalkboard" class="text-[50px] no-margin" />
            <span>
                <p class="font-semibold text-xl leading-[30px]">Puntaje total de evaluación: {{resultadoEvaluacion?.[0]?.puntaje}} pts</p>
                <p class="font-semibold text-sm leading-[21px]">*Puntaje mínimo aprobatorio: {{resultadoEvaluacion?.[0]?.competencia?.puntajeMinimoAprobatorio}} pts</p>
            </span>
        </div>
        <div v-if="estadoEvaluacion !== '0'" 
        class="flex py-2.5 px-[9.5px] gap-[6px] rounded-[10px] items-center h-[46px] shadow-md"
        :class="{
            'bg-[#FFF3CD] text-[#664D03]': estadoEvaluacion == '2',
            'bg-[#b8eec4] text-[#155724]': estadoEvaluacion == '1'
        }">
            <nuxt-icon name="book-mark" class="text-[26px] no-margin" />
            <p class="text-base font-semibold">Condición: {{estadoEvaluacion == '1' ? 'Aprobado': 'Desaprobado'}}</p>
        </div>
    </div>

    <div v-if="pending" class="text-xs text-black py-16">
			<BaseStatusLoading />
	</div>

    <div class="w-full" v-else-if="!errorEstados">
        <div class="flex flex-wrap gap-[29px] mt-6 justify-center" v-if="resultadoEvaluacion.length">
            <Card v-for="data in resultadoEvaluacion" :data="data" 
                  :competencia="competenciaStore.competenciaSeleccionada" :approved="data.puntaje >= data.competencia.puntajeMinimoAprobatorio"/>
        </div>
    
        <div class="flex justify-center items-center gap-[21px] mt-10">
            <button
                class="flex items-center justify-center w-full max-w-[220px] rounded-md text-sm bg-secondary text-white h-[36px] font-semibold"
                @click="back"
                >Volver</button>
            <button class="flex items-center justify-center w-full max-w-[220px] rounded-md text-sm 
                            h-[36px] bg-primary text-white font-semibold" @click="abrirModal">Visualizar resultados</button>
        </div>
    </div>
</div>
<ModalResultado v-if="mostrarModal" :on-close="cerraModal"/>
</template>