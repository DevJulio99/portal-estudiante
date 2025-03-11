<script lang="ts" setup>
import Card from './card.vue';
import type { Competencia } from '~/types/competencia.types';

const props = withDefaults(defineProps<{
	tipo: 'detalle' | 'resultado';
  pending: boolean;
}>(),
{
  tipo : 'detalle'
}
);

  const competenciaStore = useCompetenciaStore();
  const competenciaResultadoStore = useResultadoCompetenciaStore();
  const dataCompetencia = ref<Competencia[]>([]);
  const router = useRouter();

  watch(() => competenciaStore.listaCompetencia, (competencias)  => {
  if(competencias.length){
    console.log('competencias lista', competencias)
    dataCompetencia.value = competencias;
  }
});

watch(() => competenciaResultadoStore.listaCompetencia, (competencias)  => {
  if(competencias.length){
    console.log('competencias finalizadas lista', competencias)
    dataCompetencia.value = competencias;
  }
});

const goDetail = (nombre: string, competencia: Competencia) => {
  props.tipo == 'detalle' && competenciaStore.setCompetenciaSeleccionada(competencia);
  props.tipo == 'resultado' && competenciaResultadoStore.setCompetenciaSeleccionada(competencia);
  props.tipo == 'detalle' && router.replace(`/evaluaciones/${nombre}`);
  props.tipo == 'resultado' && router.replace(`/resultado-competencias/detalle`);

}

</script>

<template>

<div class="flex flex-wrap mt-[15px] gap-5 lg:gap-[30px]" v-if="dataCompetencia.length">
  <Card v-for="lista in dataCompetencia" :data="lista" :on-detail="(nombre) => goDetail(nombre, lista)" :tipo="tipo"/>
</div>

<div v-if="!pending && !dataCompetencia.length" class="w-full py-10 px-3 font-nunito flex justify-center text-xl font-semibold">
  No se encontraron resultados
</div>
</template>