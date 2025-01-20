<script setup lang="ts">
import type { ErrorResponse } from '~/types/services.types';
import type { Curso } from '~/types/cursos.types';

const { $api } = useNuxtApp();
const profileStore = useProfileStore();
let dataAlumno = profileStore.profileData?.data;
const dataCursos = ref<Curso[]>([]);
const servicesError: Ref<ErrorResponse | null> = ref(null);
const tokenStore = useTokenStore();

const {
	data: CursosData,
	error: errorServices,
	pending: pendingServices,
} = await $api.cursos.getCursosColegio(parseInt(tokenStore.getDataToken.Id), new Date().getFullYear() ,{
	lazy: true,
});

watch(CursosData, (response) => {
	if (response?.data.length) {
		dataCursos.value = response.data;
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
  <div id="pdf-content">
    <h1 class="title">CONSOLIDADO DE MATRÍCULA</h1>
    <div class="content">
      <div class="column">
        <p><strong>Año:</strong> {{ currentDate.getFullYear() }}</p>
        <p><strong>Código del alumno:</strong> {{ dataAlumno?.codAlumno }}</p>

        <p><strong>Nombre del alumno:</strong> {{ dataAlumno?.fullName }}</p>
      </div>
      <div class="column">
        <p><strong>Fecha:</strong> {{ `${formattedDate}, ${formattedTime}` }}</p>
        <p><strong>Dirección:</strong> {{ dataAlumno?.direccion }}</p>
        <p><strong>Celular:</strong> {{ dataAlumno?.telefono }}</p>
      </div>
    </div>

    <table class="courses-table">
      <thead>
        <tr>
          <th>Código curso</th>
          <th>Nombre curso</th>
          <th>Sección</th>
          <th>Nivel</th>
          <th>Modalidad</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(curso, index) in dataCursos" :key="index">
          <td>{{ curso.codCurso }}</td>
          <td>{{ curso.descCurso }}</td>
          <td>{{ curso.seccion }}</td>
          <td>{{ curso.nivel }}</td>
          <td>{{ curso.modalidad }}</td>
        </tr>
      </tbody>
    </table>

    <div class="total-courses">
        <p>Total de cursos: {{ dataCursos?.length }}</p>
    </div>

    <div class="signature-section">
      <p>_______________________________</p>
      <p>Firma del padre o apoderado</p>
    </div>
  </div>
</template>

<style scoped>
#pdf-content {
  font-family: Arial, sans-serif;
  padding: 20px;
  margin-top: 40px;
  box-sizing: border-box;
  background: #fff;
  color: #000;
}

.title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 40px;
  font-weight: bold;
}

.content {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
}

.column {
  width: 48%;
}

p {
  font-size: 14px;
  margin: 8px 0;
}

.courses-table {
  width: 100%;
  margin-top: 20px;
  margin-bottom: 10px;
  border-collapse: collapse;
}

.courses-table th,
.courses-table td {
  word-break: break-word;
  border: 1px solid #000;
  text-align: left;
  vertical-align: middle;
  padding: 8px 8px 20px 8px;
  font-size: 14px;
  height: 36px;
  display: table-cell;
}

.courses-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.total-courses {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  font-size: 16px;
  font-weight: bold;
}

.signature-section {
  margin-top: 50px;
  text-align: center;
  font-size: 14px;
}
</style>

