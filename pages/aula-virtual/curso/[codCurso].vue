<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { Curso } from '~/types/cursos.types';
import type { IUnidad } from '~/types/silabo';
import ModuleAccordion from '../ModuleAccordion.vue';

const route = useRoute();
const { $api } = useNuxtApp();
const tokenStore = useTokenStore();

const curso = ref<Curso | null>(null);
const silaboData = ref<IUnidad[]>([]);
const silaboPending = ref(false);
const silaboError = ref(false);

const pending = ref(false);
const errorState = ref(false);

const codCurso = computed(() => {
  const param = route.params.codCurso;
  return Array.isArray(param) ? param[0] : param;
});

useHead({
  title: computed(() => curso.value?.descCurso || 'Detalle del Curso'),
});

const breadcrumbsItem = computed(() => [
	{ name: 'Inicio', current: false, url: '/inicio' },
	{ name: 'Aula Virtual', current: false, url: '/aula-virtual' },
	{ name: curso.value?.descCurso || 'Detalle del Curso', current: true, url: '' },
]);


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

    if (curso.value) {
      await loadSilabo(curso.value.codCurso);
    } else {
      errorState.value = true;
    }
  } catch (error) {
    console.error("Error al cargar el detalle del curso:", error);
    errorState.value = true;
  } finally {
    pending.value = false;
  }
};

const loadSilabo = async (codCurso: string) => {
  try {
    silaboPending.value = true;
    silaboError.value = false;
    const { data, error } = await $api.silabo.obtenerSilaboPorCurso({ codCurso });
    
    if (error.value || !data.value?.success) {
      throw error.value || new Error('La respuesta de la API de sílabo no fue exitosa');
    }
    silaboData.value = data.value.data;
  } catch (err) {
    console.error("Error al cargar el sílabo:", err);
    silaboError.value = true;
  } finally {
    silaboPending.value = false;
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

const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
};

const modulesData = computed(() => {
    if (!silaboData.value) return [];
    return silaboData.value.map(unidad => ({
        title: unidad.unidad_titulo,
        examTitle: `${unidad.unidad_titulo}`,
        examDates: { opens: formatDate(unidad.fecha_inicio), closes: formatDate(unidad.fecha_fin) },
        sessions: unidad.sesiones?.map(sesion => ({
            title: sesion.titulo,
            date: sesion.fecha,
            resources: sesion.contenido_sesion?.flatMap(contenido =>
                contenido.contenido_hijo.map(hijo => ({
                    type: contenido.tipo,
                    title: hijo.titulo,
                    material: hijo.tiene_material,
                    dates: (hijo.fecha_apertura || hijo.fecha_cierre)
                        ? {
                            opens: formatDate(hijo.fecha_apertura),
                            closes: formatDate(hijo.fecha_cierre),
                          }
                        : undefined,
                }))
            ) || [],
        })) || [],
    }));
});

</script>
<template>
    <BaseLayout :rightAside="false" class="relative" bgWhite>
      <BaseBreadcrumbs :items="breadcrumbsItem"/>
      <div class="flex justify-between items-center mb-4">
        <BaseTitle :text="pending ? 'Cargando...' : (curso?.descCurso || 'Curso no encontrado')" />
        <NuxtLink to="/aula-virtual" class="text-sm text-primary hover:underline font-semibold flex items-center gap-1">
            <nuxt-icon name="arrow-go-back" />
            <span>Volver al Aula Virtual</span>
        </NuxtLink>
      </div>

      <div v-if="pending || silaboPending" class="text-center py-16">
        <BaseStatusLoading text="Cargando detalle del curso..." />
      </div>

      <div v-else-if="errorState || !curso" class="text-center py-16">
        <p class="text-lg text-gray-600">No se pudo encontrar la información del curso.</p>
      </div>

      <div v-else class="overflow-hidden rounded-xl shadow-lg border border-gray-100">
        <div class="bg-gray-50 p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            <div class="flex items-center gap-4">
                <nuxt-icon name="user-circle-outline" class="text-3xl text-primary flex-shrink-0" />
                <div class="text-sm">
                    <p class="font-semibold text-gray-500">Docente a Cargo</p>
                    <p class="text-base text-gray-800">{{ curso.nombreDocente }}</p>
                </div>
            </div>
            <div class="flex items-center gap-4">
                <nuxt-icon name="academic-cap-outline" class="text-3xl text-primary flex-shrink-0" />
                <div class="text-sm">
                    <p class="font-semibold text-gray-500">Grado</p>
                    <p class="text-base text-gray-800">{{ curso.grado }}</p>
                </div>
            </div>
            <div class="flex items-center gap-4">
                <nuxt-icon name="tag-outline" class="text-3xl text-primary flex-shrink-0" />
                <div class="text-sm">
                    <p class="font-semibold text-gray-500">Sección</p>
                    <p class="text-base text-gray-800">{{ curso.seccion }}</p>
                </div>
            </div>
            <div class="flex items-center gap-4">
                <nuxt-icon name="homeIcon" class="text-3xl text-primary flex-shrink-0" />
                <div class="text-sm">
                    <p class="font-semibold text-gray-500">Salon</p>
                    <p class="text-base text-gray-800">{{ curso.salon }}</p>
                </div>
            </div>
        </div>
      </div>

      <div v-if="!pending && !silaboPending && curso" class="mt-6 space-y-4">
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

        <template v-if="modulesData && modulesData.length > 0">
          <ModuleAccordion
            v-for="(module, index) in modulesData"
            :key="index"
            :title="module.title"
            :exam-title="module.examTitle"
            :exam-dates="module.examDates"
            :sessions="module.sessions"
          />
        </template>
        <div v-else class="text-center text-gray-500 py-8 bg-white rounded-lg border border-gray-100">
            <p>No se encontró contenido para el sílabo de este curso.</p>
        </div>

      </div>
    </BaseLayout>
</template>