<script setup lang="ts">
import TablaAlumnos from '~/components/pagesContainer/Alumnos/tablaAlumnos.vue';

definePageMeta({
	middleware: 'auth',
});

useHead({
  title: "Alumnos",
});


const alumnoStore = useAlumnoStore();

onMounted(() => {
    alumnoStore.getAlumnos();
})

onBeforeUnmount(() => {
  alumnoStore.resetAlumnos();
})
</script>
<template>

<BaseLayout :rightAside="false" class="relative" bgWhite>
    <BaseTitle text="Registro de Alumnos" />
    <TablaAlumnos />
</BaseLayout>
</template>