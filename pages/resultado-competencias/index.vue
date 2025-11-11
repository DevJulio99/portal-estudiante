<script lang="ts" setup>
import Lista from '~/components/pagesContainer/Evaluaciones/lista.vue';
import { HabilitadoState } from '~/utils/enums';
import { useProfileStore } from '~/stores/profile';

const profileStore = useProfileStore();
const postulanteStore = usePostulanteStore();
const resultadoCompetenciaStore = useResultadoCompetenciaStore();
const noHabilitado = ref();

let breadcrumbsItem = [
  { name: 'Inicio', current: false, url: '/inicio' },
  { name: "Resultado de evaluaciones", current: true, url: "/resultado-competencias" }
];
 
watch(() => profileStore.profileData.data , (profileData) => {
  if(profileData){
    profileStore.postulanteHabilitado();
  }
}, { immediate: true });

watch(() => postulanteStore.habilitado , (habilitado) => {
  console.log('habilitado ev result', habilitado);
  if(habilitado === HabilitadoState.HABILITADO){
    resultadoCompetenciaStore.getLista();
    noHabilitado.value = false;
  }
  if(habilitado === HabilitadoState.NO_HABILITADO) {
    noHabilitado.value = true;
    resultadoCompetenciaStore.pending = false;
  }
})

onBeforeUnmount(() => {
  postulanteStore.setHabilitado(HabilitadoState.PENDIENTE);
});

</script>

<template>
  <BaseLayout :rightAside="false" bgWhite>
    <BaseBreadcrumbs :items="breadcrumbsItem" />

    <BaseTitle text="Resultado de evaluaciones" />
    <div class="bg-cyan_40 p-4 rounded font-nunito border border-cyan_80 border-l-[10px]">
      Para consultar los resultados, acceda a la sección correspondiente de cada evaluación.
    </div>

    <div v-if="resultadoCompetenciaStore.pending" class="text-xs text-black py-16">
			<BaseStatusLoading />
		</div>

    <div class="w-full py-10 px-3 font-nunito flex justify-center text-xl font-semibold" v-else-if="noHabilitado">
      No tiene habilitado dar la prueba
    </div>

    <Lista :pending="resultadoCompetenciaStore.pending" tipo="resultado"/>
  </BaseLayout>
</template>
