<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Curso } from '~/types/cursos.types';

useHead({
  title: "Aula Virtual",
  // Agregamos los colores de Tailwind que usaremos para que no sean purgados en producción
  bodyAttrs: { class: 'bg-blue-500 bg-green-500 bg-yellow-500 bg-red-500 bg-purple-500 bg-pink-500 bg-indigo-500 bg-teal-500' }
});

const { $api } = useNuxtApp();
const tokenStore = useTokenStore();

const cursosColegio = ref<Curso[]>([]);
const pendingCursos = ref(false);

const cardColors = [
  'border-blue-500',
  'border-green-500',
  'border-yellow-500',
  'border-red-500',
  'border-purple-500',
  'border-pink-500',
  'border-indigo-500',
  'border-teal-500',
];

const getCardColor = (index: number) => cardColors[index % cardColors.length];

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
    <BaseTitle text="Aula virtual" />

    <div v-if="pendingCursos" class="text-xs text-black py-16">
      <BaseStatusLoading text="Cargando tus cursos..." />
    </div>

    <div v-else-if="cursosColegio.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      <NuxtLink v-for="(curso, index) in cursosColegio"
        :key="curso.codCurso"
        :to="`/aula-virtual/curso/${curso.codCurso}`"
        :class="[
          'group block bg-white rounded-lg shadow-sm p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer border-t-4 hover:shadow-lg hover:-translate-y-1',
          getCardColor(index)
        ]"
      >
        <div class="flex-grow">
          <h3 class="font-bold text-lg text-primary mb-2 leading-tight group-hover:text-blue-600 transition-colors">{{ curso.descCurso }}</h3>
          <p class="text-sm text-gray-500">{{ curso.nombreDocente }}</p>
        </div>
        <div class="flex justify-end items-center mt-4 text-gray-400 group-hover:text-blue-500 transition-colors">
          <span class="text-xs mr-2">Ingresar</span>
          <nuxt-icon name="arrow-right-circle" class="text-xl" />
        </div>
      </NuxtLink>
    </div>

    <div v-else class="w-full py-10 px-3 font-nunito flex justify-center text-xl font-semibold text-gray-500">
      <p>No tienes cursos asignados en el aula virtual.</p>
    </div>

</BaseLayout>
</template>