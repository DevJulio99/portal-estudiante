<script setup lang="ts">
import TablaAlumnos from '~/components/pagesContainer/Alumnos/tablaAlumnos.vue';



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