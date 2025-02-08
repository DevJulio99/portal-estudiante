<script lang="ts" setup>
import Lista from '~/components/pagesContainer/Evaluaciones/lista.vue';
import { useProfileStore } from '~/stores/profile';
definePageMeta({
  middleware: "auth",
});

const profileStore = useProfileStore();
const postulanteStore = usePostulanteStore();
const competenciaStore = useCompetenciaStore();
const existeProfile = ref(0);
const noHabilitado = ref();

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
    //console.log('habilitado', habilitado);
    competenciaStore.getLista();
    noHabilitado.value = false;
  }else {
    //console.log('deshabilitado', habilitado);
    noHabilitado.value = true;
  }
})



onMounted(() => {
  if(existeProfile.value){
    profileStore.postulanteHabilitado();
  }
})

onBeforeUnmount(() => {
  postulanteStore.setHabilitado(0);
});

</script>

<template>
  <BaseLayout :rightAside="false" bgWhite>
    <BaseTitle text="evaluaciones" />
    <div class="bg-cyan_40 p-4 rounded font-nunito border border-cyan_80 border-l-[10px]">
      <strong>¡La sección para rendir la evaluación de competencias generales ya está
      disponible!</strong> Es importante tener en cuenta que una vez que comience, no
      podrá acceder a otras secciones de la plataforma hasta terminar la
      evaluación.
    </div>

    <div class="w-full py-10 px-3 font-nunito flex justify-center text-xl font-semibold" v-if="noHabilitado">
      No tiene habilitado dar la prueba
    </div>

    <Lista v-else/>
  </BaseLayout>
</template>
