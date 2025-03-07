<script setup lang="ts">
import type { ErrorResponse } from '~/types/services.types';
import type { Curso } from '~/types/cursos.types';

const { $api } = useNuxtApp();
const profileStore = useProfileStore();
let dataAlumno = profileStore.profileData?.data;
const dataCursos = ref<Curso[]>([]);
const servicesError: Ref<ErrorResponse | null> = ref(null);
const tokenStore = useTokenStore();

const props = defineProps<{
  onLoad: () => void
}>();

const {
	data: CursosData,
	error: errorServices,
	pending: pendingServices,
} = await $api.cursos.getCursosColegio(parseInt(tokenStore.getDataToken.Id_Alumno), new Date().getFullYear() ,{
	lazy: true,
});

watch(CursosData, (response) => {
	if (response?.data.length) {
		dataCursos.value = response.data;
    props.onLoad();
	}

	if (response?.error) {
		servicesError.value = response.error;
	}
});

watch(() => profileStore.profileData?.data, (newData) => {
  dataAlumno = newData;
});

const currentDate = new Date();
// const formattedDate = currentDate.toLocaleDateString('es-ES', {
//   year: 'numeric',
//   month: 'long',
//   day: 'numeric',
// });
// const formattedTime = currentDate.toLocaleTimeString('es-ES', {
//   hour: '2-digit',
//   minute: '2-digit',
// });
const formattedDate = useDateFormat(currentDate, 'DD/MM/YYYY');
const formattedTime = useDateFormat(currentDate, 'hh:mm a');
</script>

<template>
  <div id="pdf-content" v-if="!pendingServices">
    <h1 class="title">FICHA DE MATRÍCULA</h1>
    <div class="content">
      <div class="single-column">
        <p><strong>Año:</strong> {{ currentDate.getFullYear() }}</p>
        <p><strong>Código del alumno:</strong> {{ dataAlumno?.codAlumno }}</p>
        <p><strong>Nombres y apellidos:</strong> {{ dataAlumno?.fullName }}</p>
        <p><strong>Periodo académico:</strong> {{ dataCursos[0]?.periodo }}</p>
        <p><strong>Dirección:</strong> {{ dataAlumno?.direccion }}</p>
        <p><strong>Celular:</strong> {{ dataAlumno?.telefono }}</p>
      </div>
    </div>

    <table class="courses-table">
      <thead>
        <tr>
          <th>Nº</th>
          <th>Código</th>
          <th class="curso-col">Asignatura</th>
          <th>Sección</th>
          <th>Nivel</th>
          <th>Modalidad</th>
          <th>Docente</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(curso, index) in dataCursos" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ curso.codCurso }}</td>
          <td class="curso-col">{{ curso.descCurso }}</td>
          <td>{{ curso.seccion }}</td>
          <td>{{ curso.nivel }}</td>
          <td>{{ curso.modalidad }}</td>
          <td>{{ curso.docente[0]?.nombresDocentes}}</td>
        </tr>
        <tr class="date-row">
          <td colspan="7" class="date-cell"><strong>Fecha: </strong>{{ `${formattedDate}` }} - <strong>Hora: </strong>{{ `${formattedTime}` }}</td>
        </tr>
      </tbody>
    </table>

    <div class="total-courses">
        <p>Total de cursos: {{ dataCursos?.length }}</p>
    </div>

    <div class="signature-container">
      <div class="signature-section">
        <p>_______________________________</p>
        <p>PADRE O APODERADO</p>
      </div>
      <div class="signature-section">
        <p>_______________________________</p>
        <p>COORDINADOR ACADÉMICO</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
#pdf-content {
  font-family: Arial, sans-serif;
  padding: 15px;
  margin-top: 100px;
  box-sizing: border-box;
  background: #fff;
  color: #000;
  text-transform: uppercase;
}

.title {
  text-align: center;
  font-size: 22px;
  margin-bottom: 40px;
  font-weight: bold;
}

.content {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
}

.single-column {
  width: 100%;
}

p {
  font-size: 14px;
}

.courses-table {
  width: 100%;
  margin-top: 20px;
  margin-bottom: 10px;
  border-collapse: collapse;
  border: 2px solid #000;
}

.courses-table th,
.courses-table td {
  word-break: break-word;
  border: 1px solid #000;
  text-align: center;
  vertical-align: middle;
  padding: 8px 8px 20px 8px;
  font-size: 12px;
  height: 18px;
  display: table-cell;
  border: none;
}

.courses-table .curso-col {
  text-align: left;
}

.courses-table th {
  font-weight: bold;
  border-bottom: 2px solid #000;
}

.courses-table .date-row .date-cell {
  text-align: left;
  border-top: 2px solid #000;
  font-size: 12px;
  padding: 0px 8px 12px 8px;
  vertical-align: middle;
  height: 30px;
}

.total-courses {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  font-size: 16px;
  font-weight: bold;
}

.signature-container {
  display: flex;
  justify-content: space-around;
  margin-top: 80px;
  text-align: center;
  font-size: 14px;
}

.signature-section {
  width: 45%;
}
</style>

