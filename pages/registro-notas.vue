<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

// Importar tipos
import type { Periodo } from '~/types/periodo.types';
import type { GradoSede } from '~/types/grado.types';
import type { Subperiodo } from '~/types/subperiodo.types';
import type { SeccionGrado } from '~/types/seccion.types';
import type { CursoGrado } from '~/types/curso.types';
import type { AlumnoFiltro } from '~/types/alumnoFiltro.types';
import type { NotaAlumno } from '~/types/notasAlumno.types';

useHead({ title: 'Registro de Notas' });

const { $api } = useNuxtApp();
const tokenStore = useTokenStore();
const profileStore = useProfileStore();

const breadcrumbsItem = [
  { name: 'Admin', current: false, url: '/admin' },
  { name: 'Notas', current: false, url: '/notas' },
  { name: 'Registro de Notas', current: true, url: '' },
];

// --- Formulario y Validación ---
const validationSchema = yup.object({
  idPeriodo: yup.number().required('El periodo es obligatorio').min(1, 'Seleccione un periodo'),
  idGrado: yup.number().required('El grado es obligatorio').min(1, 'Seleccione un grado'),
  idSeccion: yup.number().required('La sección es obligatoria').min(1, 'Seleccione una sección'),
  idCurso: yup.number().required('El curso es obligatorio').min(1, 'Seleccione un curso'),
  idSubperiodo: yup.number().required('El subperiodo es obligatorio').min(1, 'Seleccione un subperiodo'),
  idAlumno: yup.number().optional(), // El alumno es opcional para filtrar la tabla
});

const { values, errors, defineField, handleSubmit, setFieldValue, resetField } = useForm({
  validationSchema,
  initialValues: {
    idPeriodo: 0,
    idGrado: 0,
    idSeccion: 0,
    idCurso: 0,
    idSubperiodo: 0,
    idAlumno: 0,
  },
});

const [idPeriodo, idPeriodoAttrs] = defineField('idPeriodo');
const [idGrado, idGradoAttrs] = defineField('idGrado');
const [idSeccion, idSeccionAttrs] = defineField('idSeccion');
const [idCurso, idCursoAttrs] = defineField('idCurso');
const [idSubperiodo, idSubperiodoAttrs] = defineField('idSubperiodo');
const [idAlumno, idAlumnoAttrs] = defineField('idAlumno');

const handleChangeSelect = (option: { id: string | number }, fieldName: keyof typeof values) => {
    setFieldValue(fieldName, option.id);
}

// --- Datos para los Selects ---
const codSede = computed(() => profileStore.data?.codSede || tokenStore.getDataToken?.Codigo_Sede);
const tipoInstitucion = computed(() => profileStore.data?.tipoInstitucion || tokenStore.getDataToken?.Tipo_Institucion);

const { data: periodos, pending: pendingPeriodos } = await $api.periodoNotas.obtenerPeriodoPorSede({ codSede: codSede.value || '' });
const { data: grados, pending: pendingGrados } = await $api.gradoSede.GetGradoPorSede({ codSede: codSede.value || '' });

const subperiodos = ref<Subperiodo[]>([]);
const pendingSubperiodos = ref(false);
watch(idPeriodo, async (newId) => {
    resetField('idSubperiodo');
    subperiodos.value = [];
    if (newId > 0) {
        pendingSubperiodos.value = true;
        const { data } = await $api.subperiodo.GetSubperiodoPorPeriodo({ idPeriodo: newId });
        subperiodos.value = data.value?.data || [];
        pendingSubperiodos.value = false;
    }
});

const secciones = ref<SeccionGrado[]>([]);
const pendingSecciones = ref(false);
const cursos = ref<CursoGrado[]>([]);
const pendingCursos = ref(false);
watch(idGrado, async (newId) => {
    resetField('idSeccion');
    resetField('idCurso');
    secciones.value = [];
    cursos.value = [];
    if (newId > 0 && codSede.value && tipoInstitucion.value) {
        pendingSecciones.value = true;
        pendingCursos.value = true;
        const { data: dataSecciones } = await $api.seccionGrado.getSeccionPorGrado({ codSede: codSede.value, idGrado: newId, tipoInstitucion: tipoInstitucion.value, idCiclo: null });
        const { data: dataCursos } = await $api.cursoGradoModulo.GetCursoPorGrado({ codSede: codSede.value, idGrado: newId, tipoInstitucion: tipoInstitucion.value });
        secciones.value = dataSecciones.value?.data || [];
        cursos.value = dataCursos.value?.data || [];
        pendingSecciones.value = false;
        pendingCursos.value = false;
    }
});

const alumnos = ref<AlumnoFiltro[]>([]);
const pendingAlumnos = ref(false);

// --- Carga de Alumnos ---
// Se activa cuando todos los filtros necesarios tienen un valor válido.
watch([idPeriodo, idGrado, idSeccion, idCurso, idSubperiodo], async ([p, g, s, c, sp]) => {
    resetField('idAlumno');
    alumnos.value = [];

    if (p > 0 && g > 0 && s > 0 && c > 0 && sp > 0 && codSede.value) {
        pendingAlumnos.value = true;
        const { data } = await $api.alumnoFiltro.GetAlumnosPorFiltro({
            idPeriodo: p, idSubperiodo: sp, codSede: codSede.value, idGrado: g, idSeccion: s, idCurso: c
        });
        alumnos.value = data.value?.data || [];
        pendingAlumnos.value = false;
    }
}, {
    deep: true
});

// --- Carga y manejo de Notas del Alumno ---
const notasAlumno = ref<NotaAlumno[]>([]);
const pendingNotas = ref(false);
const observacionesNota = ref('');

const selectedAlumno = computed(() => {
    if (idAlumno.value > 0) {
        return alumnos.value.find(a => a.idAlumno === idAlumno.value);
    }
    return null;
});

watch(idAlumno, async (newId) => {
    notasAlumno.value = [];
    observacionesNota.value = '';
    if (newId > 0) {
        pendingNotas.value = true;
        const { data } = await $api.notasAlumno.getNotasAlumnos({
            idAlumno: newId,
            idCurso: values.idCurso,
            idPeriodo: values.idPeriodo,
            idSubperiodo: values.idSubperiodo,
        });
        notasAlumno.value = data.value?.data || [];
        pendingNotas.value = false;
    }
});

</script>

<template>
  <div class="p-4">
    <BaseBreadcrumbs :items="breadcrumbsItem" />
    <h1 class="text-2xl font-bold mb-4">Registro de Notas</h1>
    <div class="bg-white p-4 rounded-lg shadow-md mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <BaseVeeSelectV2 :value="idPeriodo" v-bind="idPeriodoAttrs" id="idPeriodo" label="Periodo" :options="periodos?.data?.map(p => ({ id: p.idPeriodo, name: p.descripcionPeriodo })) || []" @change="(option) => handleChangeSelect(option, 'idPeriodo')" :error="errors.idPeriodo" :disabled="pendingPeriodos" placeholder="Seleccione periodo" />

            <BaseVeeSelectV2 :value="idGrado" v-bind="idGradoAttrs" id="idGrado" label="Grado" :options="grados?.data?.map(g => ({ id: g.idGrado, name: g.descripcionGrado })) || []" @change="(option) => handleChangeSelect(option, 'idGrado')" :error="errors.idGrado" :disabled="pendingGrados" placeholder="Seleccione grado" />

            <BaseVeeSelectV2 :value="idSeccion" v-bind="idSeccionAttrs" id="idSeccion" label="Sección" :options="secciones.map(s => ({ id: s.idSeccion, name: s.descripcionSeccion }))" @change="(option) => handleChangeSelect(option, 'idSeccion')" :error="errors.idSeccion" :disabled="!idGrado || pendingSecciones" placeholder="Seleccione sección" />

            <BaseVeeSelectV2 :value="idCurso" v-bind="idCursoAttrs" id="idCurso" label="Curso" :options="cursos.map(c => ({ id: c.idCurso, name: c.descripcionCurso }))" @change="(option) => handleChangeSelect(option, 'idCurso')" :error="errors.idCurso" :disabled="!idGrado || pendingCursos" placeholder="Seleccione curso" />

            <BaseVeeSelectV2 :value="idSubperiodo" v-bind="idSubperiodoAttrs" id="idSubperiodo" label="Subperiodo" :options="subperiodos.map(sp => ({ id: sp.idSubperiodo, name: sp.descripcionSubperiodo }))" @change="(option) => handleChangeSelect(option, 'idSubperiodo')" :error="errors.idSubperiodo" :disabled="!idPeriodo || pendingSubperiodos" placeholder="Seleccione subperiodo" />

            <BaseVeeSelectV2 :value="idAlumno" v-bind="idAlumnoAttrs" id="idAlumno" label="Alumno" :options="alumnos.map(a => ({ id: a.idAlumno, name: a.nombreAlumno }))" @change="(option) => handleChangeSelect(option, 'idAlumno')" :error="errors.idAlumno" :disabled="pendingAlumnos || alumnos.length === 0" placeholder="Todos los alumnos" />
        </div>
    </div>

    <!-- Tarjeta de Notas del Alumno Seleccionado -->
    <div v-if="idAlumno > 0" class="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-6">
        <div v-if="pendingNotas" class="text-center">
            <p>Cargando notas del alumno...</p>
        </div>
        <div v-else-if="selectedAlumno">
            <div class="flex items-center mb-2">
                <span class="text-2xl mr-2">👤</span>
                <h2 class="text-xl font-bold text-gray-800">{{ selectedAlumno.nombreAlumno }}</h2>
            </div>
            <p class="text-sm text-gray-500 mb-4 border-b pb-4">Código: {{ selectedAlumno.codigoAlumno }}</p>

            <div v-if="notasAlumno.length > 0" class="space-y-3">
                <div v-for="notaItem in notasAlumno" :key="notaItem.idNota" class="flex justify-between items-center">
                    <label :for="`nota-${notaItem.idNota}`" class="text-gray-700">
                        {{ notaItem.tipoNota }} ({{ notaItem.peso * 100 }}%)
                    </label>
                    <input :id="`nota-${notaItem.idNota}`" type="number" v-model="notaItem.nota" class="w-20 text-center border rounded-md px-2 py-1" placeholder="0" />
                </div>
                <div class="flex justify-between items-center font-bold text-lg pt-3 border-t">
                    <span>Promedio:</span>
                    <span>17.0</span> 
                </div>
                <textarea v-model="observacionesNota" class="w-full border rounded-md p-2 mt-4" rows="2" placeholder="Observaciones..."></textarea>
                <button class="w-full mt-4 rounded px-4 py-2 text-white font-bold bg-primary hover:bg-[#1E6657]">💾 Guardar</button>
            </div>
            <p v-else class="text-center text-gray-500 py-4">No se encontraron notas para este alumno en el curso y periodo seleccionados.</p>
        </div>
    </div>
    <div v-else class="text-center text-gray-500 mt-6">
        <p>Seleccione todos los filtros y un alumno para ver o registrar sus notas.</p>
    </div>
  </div>
</template>