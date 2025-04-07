<script lang="ts" setup>
import type { Competencia, ResultadoEvaluacion } from '~/types/competencia.types';
import TabResultado from './tabResultado.vue';

defineProps<{ onClose: () => void; }>();

const profileStore = useProfileStore();
const resultadoCompetenciaStore = useResultadoCompetenciaStore();

const dataResultado = ref<ResultadoEvaluacion>();
const dataCompetencia = ref<Competencia>();

onMounted(() => {
  if (resultadoCompetenciaStore.listaResultados.length) {
    dataResultado.value = resultadoCompetenciaStore.listaResultados[0];
  }
  if (resultadoCompetenciaStore.listaCompetencia.length) {
    dataCompetencia.value = resultadoCompetenciaStore.listaCompetencia[0];
  }
});
</script>

<template>
    <div class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
        <div class="w-full max-w-[950px] bg-white shadow-lg rounded-lg overflow-hidden max-h-[90vh] flex flex-col">
            <div class="bg-primary text-white py-2 px-6 flex items-center justify-between">
                <h2 class="text-base font-semibold">
                Resultados del alumno en el curso 
                {{ conditionedString(dataResultado?.competencia?.nombreCompetencia ?? '') }}
                </h2>
                <button class="text-white hover:text-gray-300 text-xl" @click="onClose">✕</button>
            </div>

            <div class="px-6 py-4 space-y-6 overflow-y-auto flex-grow">
                <section>
                <h3 class="text-base font-semibold text-primary mb-2">Datos del alumno</h3>
                <div class="bg-gray-50 p-4 rounded-lg border">
                    <div class="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>DNI:</strong> {{ conditionedString(profileStore.profileData.data?.documenIdentida ?? '') }}</div>
                    <div><strong>Nombres y apellidos:</strong> {{ conditionedString(profileStore.profileData.data?.fullName ?? '') }}</div>
                    <div><strong>Institución educativa:</strong> {{ conditionedString('-') }}</div>
                    <div><strong>Fecha de examen:</strong> {{ conditionedString(dataCompetencia?.tiempoFinalizado ?? '') }}</div>
                    <div><strong>Evaluación:</strong> {{ conditionedString(dataResultado?.competencia?.nombreCompetencia ?? '') }}</div>
                    <div><strong>Puntaje final:</strong> {{ conditionedString(dataResultado?.puntaje.toString() ?? '') }}</div>
                    </div>
                </div>
                </section>

                <section v-if="dataResultado">
                <h3 class="text-base font-semibold text-primary mb-2">Resultados de la evaluación</h3>
                <div class="overflow-visible">
                    <TabResultado :resultado="dataResultado" />
                </div>
                </section>
            </div>
        </div>
    </div>
</template>
  
<style scoped>
.bg-primary {
background-color: #287F6B;
}

.bg-primary-dark {
background-color: #1E5E52;
}

.text-primary {
color: #287F6B;
}

.shadow-lg {
box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}
</style>
  
