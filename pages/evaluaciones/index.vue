<script lang="ts" setup>
import Lista from '~/components/pagesContainer/Evaluaciones/lista.vue';
import { useProfileStore } from '~/stores/profile';
definePageMeta({
  middleware: "auth",
});

const profileStore = useProfileStore();
const postulanteStore = usePostulanteStore();
const competenciaStore = useCompetenciaStore();
const examenStore = useExamenStore();
const existeProfile = ref(0);
const noHabilitado = ref();

let breadcrumbsItem = [
  { name: 'Inicio', current: false, url: '/inicio' },
  { name: "Evaluaciones", current: true, url: "/evaluaciones" }
];

if(profileStore.profileData.data){
  existeProfile.value = 1;
}


watch(() => profileStore.profileData.data , (profileData) => {
  if(!existeProfile.value && profileData){
    profileStore.postulanteHabilitado();
  }
})

watch(() => postulanteStore.habilitado , (habilitado) => {
  if(habilitado === 1){
    competenciaStore.getLista();
    noHabilitado.value = false;
  }
  if(habilitado === 2) {
    noHabilitado.value = true;
    competenciaStore.pending = false;
  }
})



onMounted(() => {
  if(existeProfile.value){
    profileStore.postulanteHabilitado();
    competenciaStore.finalizoCompetencia = false;
    examenStore.resetExamen();
  }
})

</script>

<template>
  <BaseLayout :rightAside="false" bgWhite>
    <BaseBreadcrumbs :items="breadcrumbsItem" />

    <BaseTitle text="evaluaciones" />
    <div class="bg-cyan_40 p-4 rounded font-nunito border border-cyan_80 border-l-[10px]">
      <strong>¡La sección para rendir la evaluación de los cursos ya está
      disponible!</strong> Es importante tener en cuenta que una vez que comience, no
      se podrá acceder a otras secciones de la plataforma hasta terminar la
      evaluación.
    </div>

    <div v-if="competenciaStore.pending" class="text-xs text-black py-16">
			<BaseStatusLoading />
		</div>

    <div class="w-full py-10 px-3 font-nunito flex justify-center text-xl font-semibold" v-else-if="noHabilitado">
      No tiene habilitado dar la prueba
    </div>

    <Lista tipo="detalle" :pending="competenciaStore.pending"/>
  </BaseLayout>
</template>
