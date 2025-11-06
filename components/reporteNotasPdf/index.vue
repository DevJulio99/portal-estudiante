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

const puntajesPorBimestre = computed(() => {
    const puntajes: { [bimestre: string]: number } = {};
    if (!props.notas) return puntajes;

    for (const bimestre of bimestres.value) {
        let suma = 0;
        for (const curso of cursos.value) {
            const nota = notasPivote.value[curso]?.[bimestre];
            if (nota !== null && nota !== undefined) {
                suma += nota;
            }
        }
        puntajes[bimestre] = suma;
    }
    return puntajes;
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
    <h2 style="position: relative; top: -6px;">Institución Educativa Privada</h2>
    <h1 style="position: relative; top: -6px;">"JORGE BASADRE"</h1>
    <h3 style="position: relative; top: -6px;">¡Formando triunfadores!</h3>

    <p class="titulo" style="position: relative; top: -6px;">INFORME DEL PROGRESO DE LAS NOTAS DEL ESTUDIANTE - {{ new Date().getFullYear() }}</p>
    <p class="subtitulo" style="position: relative; top: -6px;">Nivel {{ profile?.desNivel }}</p>

    <table>
      <tr>
        <td><strong style="position: relative; top: -6px;">APELLIDOS Y NOMBRES:</strong> <span style="position: relative; top: -6px;">{{ profile?.fullName }}</span></td>
        <td><strong style="position: relative; top: -6px;">BIMESTRE:</strong> <span style="position: relative; top: -6px;">{{ bimestres.length > 0 ? bimestres[bimestres.length - 1] : '-' }}</span></td>
        <td><strong style="position: relative; top: -6px;">N° ORDEN:</strong> <span style="position: relative; top: -6px;">7</span></td>
      </tr>
      <tr>
        <td><strong style="position: relative; top: -6px;">TUTOR(A):</strong> <span style="position: relative; top: -6px;">María Torres</span></td>
        <td colspan="2"><strong style="position: relative; top: -6px;">AÑO Y SECCIÓN:</strong> <span style="position: relative; top: -6px;">{{  profile?.desGrado }} - {{ profile?.desSeccion }}</span> </td>
      </tr>
    </table>

    <table>
      <thead>
        <tr>
          <th rowspan="2"><span style="position: relative; top: -6px;">ASIGNATURAS</span></th>
          <th v-for="bimestre in bimestres" :key="bimestre" colspan="2"><span style="position: relative; top: -6px;">{{ String(bimestre).replace('Bimestre ', '').replace(' - 2025', '') }} BIMES.</span></th>
        </tr>
        <tr>
          <template v-for="bimestre in bimestres" :key="`sub-${bimestre}`">
            <th><span style="position: relative; top: -6px;">Cuant.</span></th>
            <th><span style="position: relative; top: -6px;">Cualit.</span></th>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr v-for="curso in cursos" :key="curso">
          <td><strong style="position: relative; top: -6px;">{{ curso }}</strong></td>
          <template v-for="bimestre in bimestres" :key="`nota-${curso}-${bimestre}`">
            <td style="text-align: center;"><span style="position: relative; top: -6px;">{{ notasPivote[curso][bimestre] !== null ? notasPivote[curso][bimestre]?.toFixed(0) : '-' }}</span></td>
            <td style="text-align: center;"><span style="position: relative; top: -6px;">{{ getNotaCualitativa(notasPivote[curso][bimestre]) }}</span></td>
          </template>
        </tr>
        <tr>
          <td><strong style="position: relative; top: -6px;">Puntaje</strong></td>
          <template v-for="bimestre in bimestres" :key="`puntaje-${bimestre}`">
            <td colspan="2" style="text-align: center;">
              <span style="position: relative; top: -6px;">{{ puntajesPorBimestre[bimestre]?.toFixed(0) || '-' }}</span>
            </td>
          </template>
        </tr>
      </tbody>
    </table>

    <table>
      <tr>
        <th><span style="position: relative; top: -6px;">SITUACIÓN FINAL</span></th>
        <th><span style="position: relative; top: -6px;">Promovido</span></th>
        <th><span style="position: relative; top: -6px;">Requiere Recuperación</span></th>
        <th><span style="position: relative; top: -6px;">Repite</span></th>
      </tr>
      <tr>
        <td></td>
        <td style="text-align: center;"><span style="position: relative; top: -6px;">X</span></td>
        <td></td>
        <td></td>
      </tr>
    </table>

    <table>
      <thead>
        <tr>
          <th></th>
          <th v-for="bimestre in bimestres" :key="bimestre"><span style="position: relative; top: -6px;">{{ String(bimestre).replace('Bimestre ', '').replace(' - 2025', '') }} BIMES.</span></th>
          <th><span style="position: relative; top: -6px;">Prom. Final</span></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong style="position: relative; top: -6px;">Comportamiento</strong></td>
          <td style="text-align: center;" v-for="bimestre in bimestres" :key="`comp-${bimestre}`"><span style="position: relative; top: -7px;">20</span></td>
          <td style="text-align: center;"><span style="position: relative; top: -7px;">-</span></td>
        </tr>
        <tr>
          <td><strong style="position: relative; top: -6px;">Conducta</strong></td>
          <td style="text-align: center;" v-for="bimestre in bimestres" :key="`cond-${bimestre}`"><span style="position: relative; top: -7px;">18</span></td>
          <td style="text-align: center;"><span style="position: relative; top: -7px;">-</span></td>
        </tr>
      </tbody>
    </table>

    <div class="footer">
      <div class="firma">
        María Torres<br>
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
  margin-top: 60px;
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