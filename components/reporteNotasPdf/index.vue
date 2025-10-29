<script lang="ts" setup>
import type { ResponseNotasReporte } from '~/repository/modules/ReporteNotaModulo';

const props = defineProps<{
  notas: ResponseNotasReporte[];
  onLoad: () => void;
}>();

const profileStore = useProfileStore();
const profile = profileStore.profileData.data;

interface ReporteAgrupado {
  [key: string]: {
    cursos: { descripcionCurso: string; promedioCurso: number }[];
    promedioBimestre: number;
  };
}

const notasAgrupadas = computed<ReporteAgrupado>(() => {
  if (!props.notas || props.notas.length === 0) {
    return {};
  }
  return props.notas.reduce((acc: ReporteAgrupado, nota) => {
    const { descripcionSubperiodo, descripcionCurso, promedioCurso, promedioBimestre } = nota;
    if (!acc[descripcionSubperiodo]) {
      acc[descripcionSubperiodo] = {
        cursos: [],
        promedioBimestre,
      };
    }
    acc[descripcionSubperiodo].cursos.push({ descripcionCurso, promedioCurso });
    return acc;
  }, {});
});

const promedioAnual = computed(() => {
  return props.notas.length > 0 ? props.notas[0].promedioAnual : 0;
});

onMounted(() => {
  props.onLoad();
});
</script>

<template>
  <div class="pdf-content p-8 bg-white">
    <h1 class="text-2xl font-bold text-center mb-4">Reporte de Notas</h1>

    <div class="student-info mb-6">
      <p style="margin: 0; padding: 0; line-height: 1;">
        <strong style="padding-right: 0.5em;">Alumno:</strong>
        <span style="position: relative; top: -3px;">{{ profile?.fullName }}</span>
      </p>
    </div>

    <div v-for="(bimestre, nombreBimestre) in notasAgrupadas" :key="nombreBimestre" class="bimestre-section mb-6">
      <h2 class="text-xl font-semibold border-b-2 border-gray-300 pb-2 mb-3">{{ nombreBimestre }}</h2>
      <table class="w-full text-left border-collapse">
        <thead>
          <tr>
            <th class="border-b p-2">Curso</th>
            <th class="border-b p-2 text-right">Promedio</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="curso in bimestre.cursos" :key="curso.descripcionCurso">
            <td class="border-b p-2">{{ curso.descripcionCurso }}</td>
            <td class="border-b p-2 text-right">{{ curso.promedioCurso.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
      <div class="text-right mt-2 font-bold">
        Promedio Bimestre: {{ bimestre.promedioBimestre.toFixed(2) }}
      </div>
    </div>

    <div class="anual-average mt-8 text-right font-bold text-lg">
      Promedio Anual: {{ promedioAnual.toFixed(2) }}
    </div>
  </div>
</template>

<style scoped>
.pdf-content {
  font-family: 'Arial', sans-serif;
  color: #333;
}
.bimestre-section {
  page-break-inside: avoid;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, table td {
  border-bottom: 1px solid #ddd;
  padding: 8px;
}
th {
  background-color: #f2f2f2;
}
</style>
