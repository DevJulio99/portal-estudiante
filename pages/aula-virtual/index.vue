<script setup lang="ts">
import { onMounted } from 'vue';
import type { Curso } from '~/types/cursos.types';
import CursoCard from './CursoCard.vue';

useHead({
  title: "Aula Virtual",
  // Agregamos los colores de Tailwind que usaremos para que no sean purgados en producción
  bodyAttrs: { class: 'bg-blue-500 bg-green-500 bg-yellow-500 bg-red-500 bg-purple-500 bg-pink-500 bg-indigo-500 bg-teal-500' }
});

let breadcrumbsItem = [
	{ name: 'Inicio', current: false, url: '/inicio' },
	{ name: 'Aula Virtual', current: true, url: '' },
];

const cursosStore = useCursosAlumnoStore();

onMounted(() => {
  cursosStore.fetchCursosColegio();
});

</script>
<template>

<BaseLayout :rightAside="false" class="relative" bgWhite>
    <BaseBreadcrumbs :items="breadcrumbsItem"/>
    <BaseTitle text="Aula virtual" />

    <div v-if="cursosStore.pending" class="text-xs text-black py-16">
      <BaseStatusLoading text="Cargando tus cursos..." />
    </div>

    <div v-else-if="cursosStore.listaCursos.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      <CursoCard
        v-for="(curso, index) in cursosStore.listaCursos"
        :key="curso.codCurso"
        :title="curso.descCurso"
        :teacher="curso.nombreDocente"
        :codCurso="curso.codCurso"
        :progress="curso.porcentaje_avance || 0"
      />
    </div>

    <div v-else class="w-full py-10 px-3 font-nunito flex justify-center text-xl font-semibold text-gray-500">
      <p>No tienes cursos asignados en el aula virtual.</p>
    </div>

</BaseLayout>
</template>