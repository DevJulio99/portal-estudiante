<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { Curso } from '~/types/cursos.types';
import ModuleAccordion from '../ModuleAccordion.vue';

const route = useRoute();
const { $api } = useNuxtApp();
const tokenStore = useTokenStore();

const curso = ref<Curso | null>(null);
const pending = ref(false);
const errorState = ref(false);

const codCurso = computed(() => {
  const param = route.params.codCurso;
  return Array.isArray(param) ? param[0] : param;
});

useHead({
  title: computed(() => curso.value?.descCurso || 'Detalle del Curso'),
});

const loadCursoDetalle = async () => {
  if (!tokenStore.getDataToken?.Id_Alumno || !codCurso.value) {
    console.warn("Faltan datos para cargar el detalle del curso.");
    errorState.value = true;
    return;
  }

  try {
    pending.value = true;
    errorState.value = false;
    const { data } = await $api.cursos.getCursosColegio(
      parseInt(tokenStore.getDataToken.Id_Alumno),
      0,
      ''
    );
    
    const todosLosCursos: Curso[] = data.value?.data || [];
    curso.value = todosLosCursos.find(c => c.codCurso == codCurso.value) || null;

    if (!curso.value) errorState.value = true;
  } catch (error) {
    console.error("Error al cargar el detalle del curso:", error);
    errorState.value = true;
  } finally {
    pending.value = false;
  }
};

onMounted(loadCursoDetalle);

const downloadingFile = ref<string | null>(null);

const downloadFile = async (file: { name: string, url: string }) => {
    if (downloadingFile.value) return;
    downloadingFile.value = file.name;

    try {
        const response = await fetch(file.url);
        const blob = await response.blob();

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = file.name;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error("Error al descargar el archivo:", error);
        alert("No se pudo descargar el archivo. Revisa la consola para más detalles.");
    } finally {
        downloadingFile.value = null;
    }
};

const generalDocs = [
    { name: 'Guía del Curso.pdf', url: 'https://morth.nic.in/sites/default/files/dd12-13_0.pdf' },
    { name: 'Sílabo 2024.pdf', url: 'https://morth.nic.in/sites/default/files/dd12-13_0.pdf' },
    { name: 'Reglamento del Aula Virtual.pdf', url: 'https://morth.nic.in/sites/default/files/dd12-13_0.pdf' },
];

// Datos de ejemplo para los módulos (esto debería venir de una API en el futuro)
const modulesData = [
    {
        title: 'Módulo 1: Introducción',
        examTitle: 'Examen Módulo 1',
        examDates: { opens: 'domingo 19 de septiembre de 2025 08:00', closes: 'domingo 26 de septiembre de 2025 23:59' },
        sessions: [
            {
                title: 'Sesión 1 (28 de septiembre)',
                resources: [
                    { type: 'Recurso', icon: 'icon-resources', iconBgColor: 'bg-green-200', title: 'Diapositivas', link: '#' },
                    { type: 'Carpeta', icon: 'icon-folder-outline', iconBgColor: 'bg-yellow-200', title: 'Material complementario', link: '/aula-virtual/material-complementario' },
                    { type: 'Página', icon: 'icon-page-flip', iconBgColor: 'bg-purple-200', title: 'Grabación de sesión 1', link: '#' },
                    { type: 'Tarea', icon: 'icon-upload-file', iconBgColor: 'bg-red-200', title: 'Infografía n° 1', link: '#', dates: { opens: 'lunes 29 de septiembre de 2025 08:00', closes: 'domingo 05 de octubre de 2025 23:59' } },
                ]
            },
            { title: 'Sesión 2 (05 de octubre)', resources: [ { type: 'Recurso', icon: 'icon-resources', iconBgColor: 'bg-green-200', title: 'Diapositivas', link: '#' }, { type: 'Página', icon: 'icon-page-flip', iconBgColor: 'bg-purple-200', title: 'Grabación de sesión 2', link: '#' } ] }
        ]
    },
    {
        title: 'Módulo 2: Desarrollo de Temas',
        examTitle: 'Examen Módulo 2',
        examDates: { opens: 'domingo 12 de octubre de 2025 08:00', closes: 'domingo 19 de octubre de 2025 23:59' },
        sessions: [
            { title: 'Sesión 3 (12 de octubre)', resources: [ { type: 'Recurso', icon: 'icon-resources', iconBgColor: 'bg-green-200', title: 'Diapositivas', link: '#' }, { type: 'Página', icon: 'icon-page-flip', iconBgColor: 'bg-purple-200', title: 'Grabación de sesión 3', link: '#' } ] },
            {
                title: 'Sesión 4 (19 de octubre)',
                resources: [
                    { type: 'Recurso', icon: 'icon-resources', iconBgColor: 'bg-green-200', title: 'Diapositivas', link: '#' },
                    { type: 'Página', icon: 'icon-page-flip', iconBgColor: 'bg-purple-200', title: 'Grabación de sesión 4', link: '#' },
                    { type: 'Tarea', icon: 'icon-upload-file', iconBgColor: 'bg-red-200', title: 'Infografía n° 2', link: '#', dates: { opens: 'lunes 20 de octubre de 2025 08:00', closes: 'domingo 26 de octubre de 2025 23:59' } },
                ]
            }
        ]
    },
    {
        title: 'Módulo 3: Aplicaciones Prácticas',
        examTitle: 'Examen Módulo 3',
        examDates: { opens: 'domingo 26 de octubre de 2025 08:00', closes: 'domingo 02 de noviembre de 2025 23:59' },
        sessions: [
            { title: 'Sesión 5 (26 de octubre)', resources: [ { type: 'Recurso', icon: 'icon-resources', iconBgColor: 'bg-green-200', title: 'Diapositivas', link: '#' }, { type: 'Página', icon: 'icon-page-flip', iconBgColor: 'bg-purple-200', title: 'Grabación de sesión 5', link: '#' } ] },
            { title: 'Sesión 6 (02 de noviembre)', resources: [ { type: 'Recurso', icon: 'icon-resources', iconBgColor: 'bg-green-200', title: 'Diapositivas', link: '#' }, { type: 'Página', icon: 'icon-page-flip', iconBgColor: 'bg-purple-200', title: 'Grabación de sesión 6', link: '#' }, { type: 'Tarea', icon: 'icon-upload-file', iconBgColor: 'bg-red-200', title: 'Infografía n° 3', link: '#', dates: { opens: 'lunes 03 de noviembre de 2025 08:00', closes: 'domingo 09 de noviembre de 2025 23:59' } } ] }
        ]
    },
    {
        title: 'Módulo 4: Evaluación Final',
        examTitle: 'Examen Módulo 4',
        examDates: { opens: 'domingo 09 de noviembre de 2025 08:00', closes: 'domingo 16 de noviembre de 2025 23:59' },
        sessions: [
            { title: 'Sesión 7 (09 de noviembre)', resources: [ { type: 'Recurso', icon: 'icon-resources', iconBgColor: 'bg-green-200', title: 'Diapositivas', link: '#' }, { type: 'Página', icon: 'icon-page-flip', iconBgColor: 'bg-purple-200', title: 'Grabación de sesión 7', link: '#' } ] },
            { title: 'Sesión 8 (16 de noviembre)', resources: [ { type: 'Recurso', icon: 'icon-resources', iconBgColor: 'bg-green-200', title: 'Diapositivas', link: '#' }, { type: 'Página', icon: 'icon-page-flip', iconBgColor: 'bg-purple-200', title: 'Grabación de sesión 8', link: '#' }, { type: 'Tarea', icon: 'icon-upload-file', iconBgColor: 'bg-red-200', title: 'Trabajo Final', link: '#', dates: { opens: 'lunes 17 de noviembre de 2025 08:00', closes: 'domingo 23 de noviembre de 2025 23:59' } } ] }
        ]
    }
];

</script>
<template>
    <BaseLayout :rightAside="false" class="relative" bgWhite>
      <div class="flex justify-between items-center mb-4">
        <BaseTitle :text="pending ? 'Cargando...' : (curso?.descCurso || 'Curso no encontrado')" />
        <NuxtLink to="/aula-virtual" class="text-sm text-primary hover:underline font-semibold flex items-center gap-1">
            <nuxt-icon name="arrow-go-back" />
            <span>Volver al Aula Virtual</span>
        </NuxtLink>
      </div>

      <div v-if="pending" class="text-center py-16">
        <BaseStatusLoading text="Cargando detalle del curso..." />
      </div>

      <div v-else-if="errorState || !curso" class="text-center py-16">
        <p class="text-lg text-gray-600">No se pudo encontrar la información del curso.</p>
      </div>

      <div v-else class="overflow-hidden rounded-xl shadow-lg border border-gray-100">
        <div class="bg-gray-50 p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            <div class="flex items-center gap-4">
                <nuxt-icon name="user-circle" class="text-3xl text-primary flex-shrink-0" />
                <div class="text-sm">
                    <p class="font-semibold text-gray-500">Docente a Cargo</p>
                    <p class="text-base text-gray-800">{{ curso.nombreDocente }}</p>
                </div>
            </div>
            <div class="flex items-center gap-4">
                <nuxt-icon name="academic-cap" class="text-3xl text-primary flex-shrink-0" />
                <div class="text-sm">
                    <p class="font-semibold text-gray-500">Grado</p>
                    <p class="text-base text-gray-800">{{ curso.grado }}</p>
                </div>
            </div>
            <div class="flex items-center gap-4">
                <nuxt-icon name="tag" class="text-3xl text-primary flex-shrink-0" />
                <div class="text-sm">
                    <p class="font-semibold text-gray-500">Sección</p>
                    <p class="text-base text-gray-800">{{ curso.seccion }}</p>
                </div>
            </div>
            <div class="flex items-center gap-4">
                <nuxt-icon name="home" class="text-3xl text-primary flex-shrink-0" />
                <div class="text-sm">
                    <p class="font-semibold text-gray-500">Salon</p>
                    <p class="text-base text-gray-800">{{ curso.salon }}</p>
                </div>
            </div>
        </div>
      </div>

      <div v-if="!pending && curso" class="mt-6 space-y-4">
        <BaseAcordion title="Documentos Generales">
          <div class="p-4 bg-white rounded-b-lg border border-t-0 border-gray-100">
            <ul class="space-y-1">
              <li v-for="(doc, index) in generalDocs" :key="index">
                <button
                  @click="downloadFile(doc)"
                  :disabled="!!downloadingFile"
                  class="w-full text-left text-blue-600 hover:underline flex items-center p-2 rounded-md hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
                >
                  <nuxt-icon name="upn-icon-download-box" class="mr-2 text-lg" />
                  {{ doc.name }}
                  <span v-if="downloadingFile === doc.name" class="text-sm text-primary ml-2">(Descargando...)</span>
                </button>
              </li>
            </ul>
          </div>
        </BaseAcordion>

        <ModuleAccordion
          v-for="(module, index) in modulesData"
          :key="index"
          :title="module.title"
          :exam-title="module.examTitle"
          :exam-dates="module.examDates"
          :sessions="module.sessions"
        />
      </div>
    </BaseLayout>
</template>