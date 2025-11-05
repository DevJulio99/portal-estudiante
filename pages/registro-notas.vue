<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

// Importar tipos
import type { Subperiodo } from '~/types/subperiodo.types';
import type { SeccionGrado } from '~/types/seccion.types';
import type { CursoGrado } from '~/types/curso.types';
import type { AlumnoFiltro } from '~/types/alumnoFiltro.types';
import type { NotaAlumno } from '~/types/notasAlumno.types';
import type { RequestGestionarNotas } from '~/repository/modules/RegistroNotaModulo';
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
    const id_val = Number(option.id);
    setFieldValue(fieldName, id_val);
}

// --- Datos para los Selects ---
const codSede = computed(() =>tokenStore.getDataToken?.Codigo_Sede);
const tipoInstitucion = computed(() => tokenStore.getDataToken?.Tipo_Institucion);

const { data: periodos, pending: pendingPeriodos } = await $api.periodoNotas.obtenerPeriodoPorSede({ codSede: codSede.value || '' });
const { data: grados, pending: pendingGrados } = await $api.gradoSede.GetGradoPorSede({ codSede: codSede.value || '' });

const subperiodos = ref<Subperiodo[]>([]);
const pendingSubperiodos = ref(false);
watch(idPeriodo, async (newId) => {
    resetField('idSubperiodo');
    subperiodos.value = [];
    if (newId > 0) {
        pendingSubperiodos.value = true;
        const { data } = await $api.subperiodo.GetSubperiodoPorPeriodo({ idPeriodo: Number(newId) });
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
        const { data: dataSecciones } = await $api.seccionGrado.getSeccionPorGrado({ codSede: codSede.value, idGrado: Number(newId), tipoInstitucion: tipoInstitucion.value, idCiclo: null });
        const { data: dataCursos } = await $api.cursoGradoModulo.GetCursoPorGrado({ codSede: codSede.value, idGrado: Number(newId), tipoInstitucion: tipoInstitucion.value });
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
            idPeriodo: Number(p), idSubperiodo: Number(sp), codSede: codSede.value, idGrado: Number(g), idSeccion: Number(s), idCurso: Number(c)
        });
        alumnos.value = data.value?.data || [];
        pendingAlumnos.value = false;
    }
}, {
    deep: true
});

// --- Carga y manejo de Notas del Alumno ---
const notasAlumno = ref<NotaAlumno[]>([]);
const notasOriginales = ref<NotaAlumno[]>([]); // Para comparar cambios
const pendingNotas = ref(false);
const observacionesNota = ref('');

const selectedAlumno = computed(() => {
    // No hay cambios aquí
    if (idAlumno.value > 0) {
        return alumnos.value.find(a => a.idAlumno === idAlumno.value);
    }
    return null;
});

const recargarNotas = async () => {
    notasAlumno.value = [];
    notasOriginales.value = [];
    observacionesNota.value = '';
    if (idAlumno.value > 0) {
        pendingNotas.value = true;
        const { data } = await $api.notasAlumno.getNotasAlumnos({
            idAlumno: Number(idAlumno.value),
            idCurso: Number(values.idCurso),
            idPeriodo: Number(values.idPeriodo),
            idSubperiodo: Number(values.idSubperiodo),
        });
        notasAlumno.value = data.value?.data || [];
        notasOriginales.value = JSON.parse(JSON.stringify(data.value?.data || []));
        pendingNotas.value = false;
    }
};

watch(idAlumno, async (newId) => {
    await recargarNotas();
});

// --- Funcionalidad de Notas ---
const agregarNota = () => {
    if (!idAlumno.value) return;
    const nuevaNota: NotaAlumno = {
        idNota: Date.now(), // ID temporal para el v-for key
        nota: 0,
        peso: 0,
        tipoNota: '',
        idAlumno: idAlumno.value,
    };
    notasAlumno.value.push(nuevaNota);
};

const validarPeso = (notaItem: NotaAlumno) => {
    if (notaItem.peso === null) return;
    const pesoActual = Number(notaItem.peso);

    if (pesoActual > 1) {
        notaItem.peso = 1;
    } else if (pesoActual < 0) {
        notaItem.peso = 0;
    }

    // Opcional: Limitar también los decimales del peso para consistencia
    const pesoString = String(notaItem.peso);
    if (pesoString.includes('.') && pesoString.split('.')[1]?.length > 2) {
        notaItem.peso = Number(pesoActual.toFixed(2));
    }
};

const validarNota = (notaItem: NotaAlumno) => {
    if (notaItem.nota === null) return;
    const notaActual = Number(notaItem.nota);

    if (notaActual > 20) {
        // Convertimos el número a string, eliminamos el último dígito y lo volvemos a convertir a número.
        const valorCorregido = String(notaItem.nota).slice(0, -1);
        notaItem.nota = valorCorregido === '' ? 0 : Number(valorCorregido);
    } else if (Number(notaItem.nota) < 0) {
        // Para valores negativos, simplemente lo reseteamos a 0.
        notaItem.nota = 0;
    }

    // Validar y limitar a dos decimales
    const notaString = String(notaItem.nota);
    if (notaString.includes('.')) {
        const decimalPart = notaString.split('.')[1];
        if (decimalPart && decimalPart.length > 2) {
            notaItem.nota = Number(Number(notaItem.nota).toFixed(2));
        }
    }
};

const onPesoKeyDown = (event: KeyboardEvent) => {
    const key = event.key;
    const target = event.target as HTMLInputElement;
    const currentValue = target.value;

    // Permitir teclas de control
    if (['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key)) {
        return;
    }

    // Prevenir cualquier caracter que no sea un número o un punto.
    if (!/^[0-9.]$/.test(key)) {
        event.preventDefault();
    }

    // Si ya hay un punto y se intenta escribir un número, verificar la longitud de los decimales
    if (currentValue.includes('.') && /[0-9]/.test(key)) {
        const decimalPart = currentValue.split('.')[1];
        if (decimalPart && decimalPart.length >= 2) {
            event.preventDefault(); // Prevenir la escritura de más de 2 decimales
        }
    }
};

const onNotaKeyDown = (event: KeyboardEvent) => {
    const key = event.key;
    const target = event.target as HTMLInputElement;
    const currentValue = target.value;

    // Permitir teclas de control (Backspace, Tab, flechas, etc.)
    if (['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key)) {
        return;
    }

    // Prevenir un segundo punto decimal
    if (key === '.' && currentValue.includes('.')) {
        event.preventDefault();
    }

    // Prevenir cualquier caracter que no sea un número o un punto.
    // Esto bloquea '-', '+', 'e', etc.
    if (!/^[0-9.]$/.test(key)) {
        event.preventDefault();
    }
};

// --- Cálculo de Promedio ---
const notasParaPromedio = computed(() => {
    return notasAlumno.value.filter(n => n.tipoNota !== 'Promedio Final');
});

const promedioCalculado = computed(() => {
    const notas = notasParaPromedio.value;
    if (!notas.length) {
        return 0;
    }

    const sumaPonderada = notas.reduce((acc, notaItem) => {
        // Suma de (nota * peso)
        return acc + (Number(notaItem.nota || 0) * Number(notaItem.peso || 0));
    }, 0);

    // Suma total de los pesos (debería ser 100 para un promedio completo)
    const sumaPesos = notas.reduce((acc, notaItem) => acc + Number(notaItem.peso || 0), 0);

    if (sumaPesos === 0) return 0;

    // El promedio es la suma ponderada dividida por la suma de los pesos.
    return parseFloat((sumaPonderada / sumaPesos).toFixed(2));
});

// --- Guardar Notas ---
const isSaving = ref(false);
const msgPopupStore = useMsgPopUpStore();

const guardarNotas = async () => {
    const notasActuales = notasParaPromedio.value;

    // 1. Identificar notas nuevas (las que tienen un ID temporal grande)
    const notasNuevas = notasActuales.filter(n => n.idNota > 1000000000);

    // 2. Identificar notas modificadas (las que existían y han cambiado)
    const notasModificadas = notasActuales.filter(notaActual => {
        // Solo nos interesan las notas que no son nuevas
        if (notaActual.idNota <= 1000000000) {
            const notaOriginal = notasOriginales.value.find(n => n.idNota === notaActual.idNota);
            // Si no se encuentra la original, o si algún valor ha cambiado, se considera modificada.
            return !notaOriginal ||
                   notaOriginal.nota !== notaActual.nota ||
                   notaOriginal.peso !== notaActual.peso ||
                   notaOriginal.tipoNota !== notaActual.tipoNota;
        }
        return false;
    });

    if (notasNuevas.length === 0 && notasModificadas.length === 0) {
        msgPopupStore.showWarning('No hay cambios para guardar.');
        return;
    }

    isSaving.value = true;
    try {
        const pesoTotalProyectado = notasParaPromedio.value.reduce((acc, n) => acc + Number(n.peso || 0), 0);
        
        if (pesoTotalProyectado > 1) {
            msgPopupStore.showError(`El peso total (${pesoTotalProyectado.toFixed(2)}) superaría el máximo permitido (1.00).`);
            isSaving.value = false;
            return;
        }

        const payload: RequestGestionarNotas = {
            idAlumno: Number(idAlumno.value),
            idCurso: Number(idCurso.value),
            idPeriodo: Number(idPeriodo.value),
            idSubperiodo: Number(idSubperiodo.value),
            notasInsertar: notasNuevas.map(n => ({
                tipo_nota: n.tipoNota,
                nota: n.nota, // Se mantiene como null si está vacío
                peso: Number(n.peso || 0),
            })),
            notasActualizar: notasModificadas.map(n => ({
                id_nota: n.idNota,
                tipo_nota: n.tipoNota,
                nota: n.nota, // Se mantiene como null si está vacío
                peso: Number(n.peso || 0),
            })),
        };

        const { data, error } = await $api.registroNota.gestionarNotas(payload);

         if (error.value || data.value?.success === false) {
            const errorMessage = data.value?.message || error.value?.data?.message || 'Ocurrió un error al guardar las notas.';
            msgPopupStore.showError(errorMessage);
        } else {
            msgPopupStore.showSuccess('Cambios guardados correctamente.');
            await recargarNotas();
        }

    } catch (e: any) {
        msgPopupStore.showError(e.data?.message || 'Error de red al guardar las notas.');
    } finally {
        isSaving.value = false;
    }
};
</script>

<template>
  <div class="p-4">
    <BaseBreadcrumbs :items="breadcrumbsItem" />
    <h1 class="text-2xl font-bold mb-4">Registro de Notas</h1>
    <div class="bg-white p-4 rounded-lg shadow-md mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <BaseVeeSelectV2 :value="idPeriodo" v-bind="idPeriodoAttrs" id="idPeriodo" label="Periodo" :options="periodos?.data?.map(p => ({ id: p.idPeriodo, name: p.descripcionPeriodo })) || []" @change="(option) => handleChangeSelect(option, 'idPeriodo')" :error="errors.idPeriodo" :disabled="pendingPeriodos" placeholder="Seleccione periodo" borderDefault="border-gray-300" />

            <BaseVeeSelectV2 :value="idGrado" v-bind="idGradoAttrs" id="idGrado" label="Grado" :options="grados?.data?.map(g => ({ id: g.idGrado, name: g.descripcionGrado })) || []" @change="(option) => handleChangeSelect(option, 'idGrado')" :error="errors.idGrado" :disabled="pendingGrados" placeholder="Seleccione grado" borderDefault="border-gray-300" />

            <BaseVeeSelectV2 :value="idSeccion" v-bind="idSeccionAttrs" id="idSeccion" label="Sección" :options="secciones.map(s => ({ id: s.idSeccion, name: s.descripcionSeccion }))" @change="(option) => handleChangeSelect(option, 'idSeccion')" :error="errors.idSeccion" :disabled="!idGrado || pendingSecciones" placeholder="Seleccione sección" borderDefault="border-gray-300" />

            <BaseVeeSelectV2 :value="idCurso" v-bind="idCursoAttrs" id="idCurso" label="Curso" :options="cursos.map(c => ({ id: c.idCurso, name: c.descripcionCurso }))" @change="(option) => handleChangeSelect(option, 'idCurso')" :error="errors.idCurso" :disabled="!idGrado || pendingCursos" placeholder="Seleccione curso" borderDefault="border-gray-300" />

            <BaseVeeSelectV2 :value="idSubperiodo" v-bind="idSubperiodoAttrs" id="idSubperiodo" label="Subperiodo" :options="subperiodos.map(sp => ({ id: sp.idSubperiodo, name: sp.descripcionSubperiodo }))" @change="(option) => handleChangeSelect(option, 'idSubperiodo')" :error="errors.idSubperiodo" :disabled="!idPeriodo || pendingSubperiodos" placeholder="Seleccione subperiodo" borderDefault="border-gray-300" />

            <BaseVeeSelectV2 :value="idAlumno" v-bind="idAlumnoAttrs" id="idAlumno" label="Alumno" :options="alumnos.map(a => ({ id: a.idAlumno, name: a.nombreAlumno }))" @change="(option) => handleChangeSelect(option, 'idAlumno')" :error="errors.idAlumno" :disabled="pendingAlumnos || alumnos.length === 0" placeholder="Todos los alumnos" borderDefault="border-gray-300" />
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

            <div class="space-y-3">
                <!-- Encabezados -->
                <div class="grid grid-cols-12 gap-2 text-xs font-bold text-gray-500">
                    <div class="col-span-5">Tipo de Nota</div>
                    <div class="col-span-3 text-center">Peso (%)</div>
                    <div class="col-span-3 text-center">Nota</div>
                    <div class="col-span-1"></div>
                </div>

                <p v-if="notasParaPromedio.length === 0" class="text-center text-gray-500 py-4 col-span-12">
                    No se encontraron notas. Haz clic en "Agregar Nueva Nota" para comenzar.
                </p>

                <!-- Inputs de Notas -->
                <div v-for="(notaItem, index) in notasParaPromedio" :key="notaItem.idNota" class="grid grid-cols-12 gap-2 items-center">
                    <input :id="`tipo-${notaItem.idNota}`" type="text" v-model="notaItem.tipoNota" class="col-span-5 border rounded-md px-2 py-1 text-sm" placeholder="Ej: Práctica 1" />
                    <input :id="`peso-${notaItem.idNota}`" type="number" v-model.number="notaItem.peso" @input="validarPeso(notaItem)" @keydown="onPesoKeyDown" class="col-span-3 text-center border rounded-md px-2 py-1 text-sm" placeholder="0.2" min="0" max="1" step="0.1" />
                    <input :id="`nota-${notaItem.idNota}`" type="number" v-model.number="notaItem.nota" @input="validarNota(notaItem)" @keydown="onNotaKeyDown" class="col-span-3 text-center border rounded-md px-2 py-1 font-bold" placeholder="0" min="0" max="20" step="0.1" />
                    <button v-if="notaItem.idNota > 1000000000" @click="notasAlumno.splice(notasAlumno.findIndex(n => n.idNota === notaItem.idNota), 1)" type="button" class="col-span-1 text-red-500 hover:text-red-700">
                        🗑️
                    </button>
                </div>
                <button @click="agregarNota" type="button" class="w-full mt-3 text-sm rounded px-4 py-2 text-primary border border-primary hover:bg-primary hover:text-white transition-colors">
                    + Agregar Nueva Nota
                </button>
                <div class="flex justify-between items-center font-bold text-lg pt-3 border-t">
                    <span>Promedio:</span>
                    <span>{{ promedioCalculado }}</span> 
                </div>
                <textarea v-model="observacionesNota" class="w-full border rounded-md p-2 mt-4" rows="2" placeholder="Observaciones..."></textarea>
                <button @click="guardarNotas" type="button" class="w-full mt-4 rounded px-4 py-2 text-white font-bold bg-primary hover:bg-[#1E6657] disabled:opacity-50 disabled:cursor-not-allowed" :disabled="isSaving">{{ isSaving ? 'Guardando...' : 'Guardar' }}</button>
            </div>
        </div>
    </div>
    <div v-else class="text-center text-gray-500 mt-6">
        <p>Seleccione todos los filtros y un alumno para ver o registrar sus notas.</p>
    </div>
  </div>
</template>