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
    <BaseLayout :rightAside="false" bgWhite>
        <BaseTitle :text="`Resultados del curso: ${ competenciaStore.competenciaSeleccionada?.nombreCompetencia }`" />

        <div class="w-full max-w-[1083px] bg-white rounded-[10px] pt-[22px] pl-[25px] pb-[39px] pr-[19px]">
            <div class="w-full bg-[#F5F5F5] rounded-2xl p-4 flex justify-between items-center shadow-lg">
                <div class="flex gap-4 items-center text-[#064E3B]">
                    <img src="@/assets/icons/exam-results.svg" class="w-[60px] no-margin" />
                    <div>
                        <p class="font-bold text-2xl leading-7 text-[#065F46]">Puntaje obtenido: {{ resultadoEvaluacion?.[0]?.puntaje }} pts</p>
                        <p class="text-base leading-6 font-medium text-[#065F46]">
                            *Puntaje mínimo requerido: {{ resultadoEvaluacion?.[0]?.competencia?.puntajeMinimoAprobatorio }} pts
                        </p>
                    </div>
                </div>

                <div v-if="estadoEvaluacion !== '0'"
                    class="flex items-center gap-2 py-2 px-4 rounded-xl shadow-md"
                    :class="{
                    'bg-[#FEF3C7] text-[#92400E]': estadoEvaluacion == '2',
                    'bg-[#A7F3D0] text-[#065F46]': estadoEvaluacion == '1'
                    }">
                    <nuxt-icon :name="estadoEvaluacion == '1' ? 'circle-check' : 'circle-x-mark'" class="text-2xl" />
                    <p class="text-base font-semibold">Situación: {{ estadoEvaluacion == '1' ? 'Aprobado' : 'Desaprobado' }}</p>
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
    </BaseLayout>
<ModalResultado v-if="mostrarModal" :on-close="cerraModal"/>
</template>