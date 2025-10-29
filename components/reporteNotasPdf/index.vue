<script lang="ts" setup>
import type { ResponseNotasReporte } from '~/repository/modules/ReporteNotaModulo';

const props = defineProps<{
  notas: ResponseNotasReporte[];
  onLoad: () => void;
}>();

const profileStore = useProfileStore();
const profile = profileStore.profileData.data;

interface NotaProcesada {
  [curso: string]: {
    [bimestre: string]: number | null;
  };
}

const bimestres = computed(() => {
  if (!props.notas) return [];
  // Obtiene una lista única de bimestres ordenados
  const bimestreSet = new Set(props.notas.map(n => n.descripcionSubperiodo));
  return Array.from(bimestreSet).sort();
});

const cursos = computed(() => {
  if (!props.notas) return [];
  // Obtiene una lista única de cursos ordenados
  const cursoSet = new Set(props.notas.map(n => n.descripcionCurso));
  return Array.from(cursoSet).sort();
});

const notasPivote = computed<NotaProcesada>(() => {
  const data: NotaProcesada = {};
  if (!props.notas) return data;

  for (const curso of cursos.value) {
    data[curso] = {};
    for (const bimestre of bimestres.value) {
      const nota = props.notas.find(n => n.descripcionCurso === curso && n.descripcionSubperiodo === bimestre);
      data[curso][bimestre] = nota ? nota.promedioCurso : null;
    }
  }
  return data;
});

const promediosPorBimestre = computed(() => {
    const promedios: { [bimestre: string]: number } = {};
    if (!props.notas) return promedios;

    for (const bimestre of bimestres.value) {
        const notaBimestre = props.notas.find(n => n.descripcionSubperiodo === bimestre);
        if (notaBimestre) {
            promedios[bimestre] = notaBimestre.promedioBimestre;
        }
    }
    return promedios;
});

const getNotaCualitativa = (nota: number | null) => {
  if (nota === null || nota === undefined) return '-';
  if (nota > 12) return 'A';
  if (nota >= 10) return 'B';
  return 'C';
};

onMounted(() => {
  props.onLoad();
});
</script>

<template>
  <div class="print-container">
    <h2>Institución Educativa Privada</h2>
    <h1>"JORGE BASADRE"</h1>
    <h3>¡Formando triunfadores!</h3>

    <p class="titulo">INFORME DEL PROGRESO DE LAS NOTAS DEL ESTUDIANTE - 2025</p>
    <p class="subtitulo">NIVEL INICIAL</p>

    <table>
      <tr>
        <td><strong>APELLIDOS Y NOMBRES:</strong> {{ profile?.fullName }}</td>
        <td><strong>BIMESTRE:</strong> {{ bimestres.length > 0 ? bimestres[bimestres.length - 1] : '-' }}</td>
        <td><strong>N° ORDEN:</strong> 7</td>
      </tr>
      <tr>
        <td><strong>TUTOR(A):</strong> Maria torres</td>
        <td colspan="2"><strong>AÑO Y SECCIÓN:</strong> </td>
      </tr>
    </table>

    <table>
      <thead>
        <tr>
          <th rowspan="2">ASIGNATURAS</th>
          <th v-for="bimestre in bimestres" :key="bimestre" colspan="2">{{ String(bimestre).replace('Bimestre ', '').replace(' - 2025', '') }} BIMES.</th>
        </tr>
        <tr>
          <template v-for="bimestre in bimestres" :key="`sub-${bimestre}`">
            <th>Cuant.</th>
            <th>Cualit.</th>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr v-for="curso in cursos" :key="curso">
          <td><strong>{{ curso }}</strong></td>
          <template v-for="bimestre in bimestres" :key="`nota-${curso}-${bimestre}`">
            <td>{{ notasPivote[curso][bimestre] !== null ? notasPivote[curso][bimestre]?.toFixed(0) : '-' }}</td>
            <td>{{ getNotaCualitativa(notasPivote[curso][bimestre]) }}</td>
          </template>
        </tr>
      </tbody>
    </table>

    <p>
      <strong>Puntaje:</strong>
      <span v-for="(promedio, bimestre) in promediosPorBimestre" :key="`prom-${bimestre}`" class="mr-4">
        {{ String(bimestre).replace('Bimestre ', '').replace(' - 2025', '') }} BIMES: {{ promedio.toFixed(2) }}
      </span>
    </p>

    <table>
      <tr>
        <th>SITUACIÓN FINAL</th>
        <th>Promovido</th>
        <th>Requiere Recuperación</th>
        <th>Repite</th>
      </tr>
      <tr>
        <td></td>
        <td>X</td>
        <td></td>
        <td></td>
      </tr>
    </table>

    <table>
      <thead>
        <tr>
          <th></th>
          <th v-for="bimestre in bimestres" :key="bimestre">{{ String(bimestre).replace('Bimestre ', '').replace(' - 2025', '') }} BIMES.</th>
          <th>Prom. Final</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Comportamiento</strong></td>
          <td v-for="bimestre in bimestres" :key="`comp-${bimestre}`">20</td>
          <td>-</td>
        </tr>
        <tr>
          <td><strong>Conducta</strong></td>
          <td v-for="bimestre in bimestres" :key="`cond-${bimestre}`">18</td>
          <td>-</td>
        </tr>
      </tbody>
    </table>

    <div class="footer">
      <div class="firma">
        Maria torres<br>
        <em>Tutora</em>
      </div>
      <div class="firma">
        Lic. Hever Bazán Domínguez<br>
        <em>Director</em>
      </div>
    </div>
  </div>
</template>

<style scoped>
.print-container {
  font-family: "Arial", sans-serif;
  color: #333;
  background-color: #fff;
  padding: 1cm;
  box-sizing: border-box;
}

h1, h2, h3, h4 {
  text-align: center;
  margin: 5px 0;
}

h1 {
  font-size: 20px;
  margin-top: 10px;
}

h2 {
  font-size: 18px;
}

h3 {
  font-size: 14px;
  color: #c00;
  font-style: italic;
}

p {
  margin: 5px 0;
  font-size: 13px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
  font-size: 13px;
}

th, td {
  border: 1px solid #333;
  padding: 5px 6px;
  text-align: center;
}

td {
  text-align: left;
}

table table th, table table td {
    text-align: center;
}

th {
  background-color: #eaeaea;
}

.titulo {
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 2px;
}

.subtitulo {
  text-align: center;
  font-size: 13px;
  font-style: italic;
  margin-top: 0;
}

.footer {
  margin-top: 35px;
  display: flex;
  justify-content: space-between;
}

.firma {
  text-align: center;
  width: 45%;
  border-top: 1px solid #000;
  padding-top: 5px;
  font-size: 13px;
}
</style>