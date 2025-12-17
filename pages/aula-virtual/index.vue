<script setup lang="ts">
import { ref, onMounted } from 'vue';
import CursoCard from './CursoCard.vue';
import type { Curso } from '~/types/cursos.types';

useHead({
  title: "Aula Virtual",
  // Agregamos los colores de Tailwind que usaremos para que no sean purgados en producción
  bodyAttrs: { class: 'bg-blue-500 bg-green-500 bg-yellow-500 bg-red-500 bg-purple-500 bg-pink-500 bg-indigo-500 bg-teal-500' }
});

let breadcrumbsItem = [
	{ name: 'Inicio', current: false, url: '/inicio' },
	{ name: 'Aula Virtual', current: true, url: '' },
];

const { $api } = useNuxtApp();
const tokenStore = useTokenStore();

const cursosColegio = ref<Curso[]>([]);
const pendingCursos = ref(false);

const loadCursos = async () => {
  if (!tokenStore.getDataToken?.Id_Alumno) {
    console.warn("No se encontró el Id_Alumno en el token.");
    return;
  }

  try {
    pendingCursos.value = true;
    const { data } = await $api.cursos.getCursosColegio(parseInt(tokenStore.getDataToken.Id_Alumno), 0, '');
    cursosColegio.value = data.value?.data || [];
  } catch (error) {
    console.error("Error al cargar los cursos del colegio:", error);
    cursosColegio.value = [];
  } finally {
    pendingCursos.value = false;
  }
};

onMounted(loadCursos);

</script>
<template>

<BaseLayout :rightAside="false" class="relative" bgWhite>
    <BaseBreadcrumbs :items="breadcrumbsItem"/>
    <BaseTitle text="Aula virtual" />

    <div v-if="pendingCursos" class="text-xs text-black py-16">
      <BaseStatusLoading text="Cargando tus cursos..." />
    </div>

    <div v-else-if="cursosColegio.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      <CursoCard
        v-for="(curso, index) in cursosColegio"
        :key="curso.codCurso"
        :title="curso.descCurso"
        :teacher="curso.nombreDocente"
        :cod-curso="curso.codCurso"
        :progress="(index * 15 + 20) % 100"
      />
    </div>

    <div v-else class="w-full py-10 px-3 font-nunito flex justify-center text-xl font-semibold text-gray-500">
      <p>No tienes cursos asignados en el aula virtual.</p>
    </div>

</BaseLayout>
</template>