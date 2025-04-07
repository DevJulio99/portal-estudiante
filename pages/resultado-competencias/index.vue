<script lang="ts" setup>
import Lista from '~/components/pagesContainer/Evaluaciones/lista.vue';
import { useProfileStore } from '~/stores/profile';
definePageMeta({
  middleware: "auth",
});

const profileStore = useProfileStore();
const postulanteStore = usePostulanteStore();
const resultadoCompetenciaStore = useResultadoCompetenciaStore();
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
  console.log('habilitado ev result', habilitado);
  if(habilitado === 1){
    resultadoCompetenciaStore.getLista();
    noHabilitado.value = false;
  }
  if(habilitado === 2) {
    noHabilitado.value = true;
    resultadoCompetenciaStore.pending = false;
  }
})



onMounted(() => {
  if(existeProfile.value){
    profileStore.postulanteHabilitado();
  }
})

onBeforeUnmount(() => {

});

</script>

<template>
  <BaseLayout :rightAside="false" bgWhite>
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

    <div class="w-full py-10 px-3 font-nunito flex justify-center text-xl font-semibold" v-else-if="noHabilitado">
      No tiene habilitado dar la prueba
    </div>

    <Lista :pending="resultadoCompetenciaStore.pending" tipo="resultado"/>
  </BaseLayout>
</template>
