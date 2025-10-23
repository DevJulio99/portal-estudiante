<script lang="ts" setup>
import TablaMatriculas from '~/components/pagesContainer/Matriculas/tablaMatriculas.vue';




useHead({
  title: "Matriculas",
});
const matriculaStore = useMatriculaStore();

onMounted(() => {
  matriculaStore.getMatriculas();
})
</script>
<template>
    <div class="w-full p-4">
        <BaseTitle text="Gestión de Matrículas" />
        <TablaMatriculas />
    </div>
</template>