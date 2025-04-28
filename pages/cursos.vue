<script setup lang="ts">
import TablaCursos from '~/components/pagesContainer/GestionCursos/TablaCursos.vue';

definePageMeta({
	middleware: 'auth',
});

useHead({
  title: "Cursos",
});


const cursoStore = useCursoStore();

onMounted(() => {
    cursoStore.getCursos();
})

onBeforeUnmount(() => {
    cursoStore.resetCursos();
})
</script>
<template>

<BaseLayout :rightAside="false" class="relative" bgWhite>
    <BaseTitle text="Registro de cursos" />
    <TablaCursos />
</BaseLayout>
</template>