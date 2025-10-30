<script lang="ts" setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import type { ResponseMatricula, RequestMatricula, CursoSeccion } from '~/types/matricula.types';
import { TipoInstitucion } from '~/types/institucion.types';
import BaseVeeCheckbox from '~/components/base/BaseVeeCheckbox.vue';
import BaseVeeTextarea from '~/components/base/BaseVeeTextarea.vue';
import BaseVeeRadio from '~/components/base/BaseVeeRadio.vue';

const props = defineProps<{
    data: ResponseMatricula | null;
    tipo: 'register' | 'edit';
    onClose: () => void;
}>();

const matriculaStore = useMatriculaStore();
const alumnoStore = useAlumnoStore();
const gradoStore = useGradoStore();
const tokenStore = useTokenStore();

const esInstitucionI = computed(() => tokenStore.getDataToken?.Tipo_Institucion === TipoInstitucion.Instituto);

const validationSchema = yup.object({
    idAlumno: yup.number().required('El alumno es obligatorio').min(1, 'Seleccione un alumno'),
    idGrado: yup.number().required('El grado es obligatorio').min(1, 'Seleccione un grado'),
    idPeriodo: yup.number().required('El periodo es obligatorio').min(1, 'Seleccione un periodo'),
    tipoMatricula: yup.string().required('El tipo de matrícula es obligatorio'),
    estadoMatricula: yup.string().required('El estado es obligatorio'),
    observaciones: yup.string().optional(),
    cursosSeccion: yup.array().when([], {
        is: () => esInstitucionI.value,
        then: schema => schema.of(
            yup.object({
                idCurso: yup.number().required().notOneOf([0]),
                idSeccion: yup.number().required('Debe seleccionar una sección para cada curso').notOneOf([0], 'Debe seleccionar una sección para cada curso'),
            })
        ).min(1, 'Debe seleccionar al menos un curso y su sección'),
        otherwise: schema => schema.optional(),
    }),
});

const initialValues = computed(() => {
    // Fusionamos los valores por defecto con los datos recibidos.
    // Así, si una propiedad no viene en props.data, se usa el valor por defecto.
    return {
        idAlumno: 0,
        idGrado: 0,
        idPeriodo: 0,
        tipoMatricula: 'Anual',
        estadoMatricula: 'Activa',
        observaciones: '',
        cursosSeccion: [] as CursoSeccion[],
        ...props.data,
    };
});

const { values, errors, defineField, handleSubmit, resetForm, setFieldValue } = useForm({
    validationSchema,
    initialValues: initialValues.value,
});

watch(initialValues, (newInitialValues) => {
    resetForm({ values: newInitialValues });
});

watch(() => props.data, (newData) => {
    resetForm({ values: { ...initialValues.value, ...newData } });
}, { deep: true });

const [idGrado, idGradoAttrs] = defineField('idGrado');
const [idPeriodo, idPeriodoAttrs] = defineField('idPeriodo');
const [tipoMatricula, tipoMatriculaAttrs] = defineField('tipoMatricula');
const [estadoMatricula, estadoMatriculaAttrs] = defineField('estadoMatricula');
const [observaciones, observacionesAttrs] = defineField('observaciones');
const [cursosSeccion, cursosSeccionAttrs] = defineField('cursosSeccion');

// El idAlumno no necesita un defineField porque no es un input del usuario en este formulario

const guardar = handleSubmit(async (formValues) => {
    if (props.tipo === 'register') {
        const payload: RequestMatricula & { grados?: CursoSeccion[] } = {
            idAlumno: formValues.idAlumno,
            idPeriodo: formValues.idPeriodo,
            idGrado: formValues.idGrado,
            codigoSede: tokenStore.getDataToken.Codigo_Sede,
            tipoMatricula: formValues.tipoMatricula,
            estadoMatricula: formValues.estadoMatricula,
            observaciones: formValues.observaciones,
            usuarioRegistro: tokenStore.getDataToken.Dni_Usuario,
            tipoInstitucion: tokenStore.getDataToken.Tipo_Institucion,
        };
        if (esInstitucionI.value) {
            payload.grados = formValues.cursosSeccion;
        }
        const success = await matriculaStore.RegistrarMatricula(payload);
        if (success) {
            props.onClose();
        }
    } else if (props.tipo === 'edit' && props.data) {
        const success = await matriculaStore.ActualizarMatricula(props.data.idMatricula, formValues.estadoMatricula);
        if (success) {
            props.onClose();
        }
    }
});

const handleChangeSelect = (option: { id: string | number }, fieldName: keyof typeof values) => {
    setFieldValue(fieldName, option.id);
}

// Observador para el cambio de grado
watch(idGrado, async (newIdGrado) => {
    setFieldValue('cursosSeccion', []); // Limpiar cursos seleccionados al cambiar de grado
    // Primero, limpiamos los cursos anteriores para evitar mostrar datos incorrectos
    matriculaStore.clearCursosPorGrado();

    // Si es un instituto y se ha seleccionado un grado válido, buscamos los cursos
    if (esInstitucionI.value && newIdGrado && newIdGrado > 0) {
        await matriculaStore.fetchCursosPorGrado({
            idGrado: newIdGrado,
            tipoInstitucion: tokenStore.getDataToken.Tipo_Institucion,
        });
    }
});

const handleCourseSelection = (cursoId: number, isChecked: boolean) => {
    const currentSelection: CursoSeccion[] = [...(values.cursosSeccion || [])];
    if (isChecked) {
        if (!currentSelection.some(c => c.idCurso === cursoId)) {
            currentSelection.push({ idCurso: cursoId, idSeccion: 0 });
        }
    } else {
        const index = currentSelection.findIndex(c => c.idCurso === cursoId);
        if (index > -1) {
            currentSelection.splice(index, 1);
        }
    }
    setFieldValue('cursosSeccion', currentSelection);
};

const handleSectionSelection = (cursoId: number, seccionId: number) => {
    const updatedSelection = (values.cursosSeccion || []).map((cursoSeccion: CursoSeccion) => {
        if (cursoSeccion.idCurso === cursoId) {
            // Crea un nuevo objeto para asegurar la reactividad
            return { ...cursoSeccion, idSeccion: seccionId };
        }
        return cursoSeccion;
    });
    setFieldValue('cursosSeccion', updatedSelection);
};

const isCourseSelected = (cursoId: number) => values.cursosSeccion?.some((c: CursoSeccion) => c.idCurso === cursoId);

const getSelectedSectionForCourse = (cursoId: number) => {
    const selection = values.cursosSeccion?.find((c: CursoSeccion) => c.idCurso === cursoId);
    return selection ? selection.idSeccion : 0;
};

onMounted(async () => {
    if (gradoStore.listaGrados.length === 0) {
        await gradoStore.getGrados();
    }
    if (matriculaStore.listaPeriodos.length === 0) {
        await matriculaStore.getPeriodos();
    }
});

onUnmounted(() => {
    // Limpiamos los cursos al salir del componente para no mantener estado residual
    matriculaStore.clearCursosPorGrado();
});
</script>

<template>
    <div class="flex flex-col flex-1 min-h-0">
        <BaseTitle :text="tipo === 'edit' ? 'Actualizar Matrícula' : 'Registrar Matrícula'" />
        <form @submit.prevent="guardar" class="flex flex-col flex-1 min-h-0" novalidate autocomplete="off">
            <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4 overflow-auto flex-grow px-2 py-2">
                <BaseVeeSelectV2 :value="idGrado" v-bind="idGradoAttrs" id="idGrado" label="Grado" icon="NavArrowDown" class="w-full" borderDefault="border-celestial_white" :options="gradoStore.listaGrados.map(g => ({ id: g.idGrado, name: g.descripcionGrado }))" @change="(option) => handleChangeSelect(option, 'idGrado')" :disabled="tipo === 'edit'" :error="errors.idGrado" placeholder="Seleccione un grado" />

                <BaseVeeSelectV2 :value="idPeriodo" v-bind="idPeriodoAttrs" id="idPeriodo" label="Periodo" icon="NavArrowDown" class="w-full" borderDefault="border-celestial_white" :options="matriculaStore.listaPeriodos.map(p => ({ id: p.idPeriodo, name: p.descripcionPeriodo }))" @change="(option) => handleChangeSelect(option, 'idPeriodo')" :disabled="tipo === 'edit'" :error="errors.idPeriodo" placeholder="Seleccione un periodo" />

                <!-- INICIO: Nueva sección de Cursos por Grado -->
                <div v-if="esInstitucionI && idGrado > 0" class="md:col-span-2 border-t pt-4 mt-2">
                    <h3 class="font-bold text-lg mb-2">Cursos y Secciones Disponibles</h3>
                    <input v-bind="cursosSeccionAttrs" type="hidden" />

                    <!-- Estado de Carga -->
                    <div v-if="matriculaStore.pendingCursos" class="text-center text-gray-500">
                        Cargando cursos...
                    </div>

                    <!-- Lista de Cursos -->
                    <div v-else-if="matriculaStore.cursosPorGrado.length > 0" class="space-y-4 max-h-60 overflow-y-auto pr-2">
                        <label 
                            v-for="curso in matriculaStore.cursosPorGrado" 
                            :key="curso.id_curso" 
                            :for="`curso-${curso.id_curso}`" class="p-3 border rounded-md bg-gray-50 transition-all cursor-pointer block">
                            <BaseVeeCheckbox
                                :id="`curso-${curso.id_curso}`"
                                :name="`curso-${curso.id_curso}`"
                                :label="curso.descripcion_curso"
                                :modelValue="isCourseSelected(curso.id_curso)"
                                @update:modelValue="isChecked => handleCourseSelection(curso.id_curso, isChecked)"
                                class="font-bold text-primary"
                            />
                            
                            <div v-if="isCourseSelected(curso.id_curso)" class="pl-6 mt-3 space-y-2" @click.stop>
                                <BaseVeeRadio
                                    v-for="seccion in curso.secciones"
                                    :key="seccion.codigo_seccion"
                                    :modelValue="getSelectedSectionForCourse(curso.id_curso)"
                                    :name="`seccion-curso-${curso.id_curso}`"
                                    :value="seccion.id_seccion"
                                    :id="`seccion-${seccion.codigo_seccion}`"
                                    @update:modelValue="() => handleSectionSelection(curso.id_curso, seccion.id_seccion)"
                                >
                                    <template #label>
                                        <label :for="`seccion-${seccion.codigo_seccion}`" class="text-sm cursor-pointer">
                                            <span class="font-semibold">{{ seccion.descripcion_seccion }}</span> - 
                                            <span class="text-gray-600">{{ seccion.horario.nombre_dia }} de {{ seccion.horario.hora_inicio }} a {{ seccion.horario.hora_fin }} (Turno: {{ seccion.horario.turno }})</span>
                                        </label>
                                    </template>
                                </BaseVeeRadio>
                            </div>
                        </label>
                    </div>
                    <!-- Mensaje si no se encuentran cursos -->
                    <div v-else class="text-center text-gray-500 py-4">
                        No se encontraron cursos disponibles para el grado seleccionado.
                    </div>
                    <span v-if="errors.cursosSeccion" class="text-error">{{ errors.cursosSeccion }}</span>
                </div>
                <!-- FIN: Nueva sección de Cursos por Grado -->
                 
                <BaseVeeSelectV2 :value="tipoMatricula" v-bind="tipoMatriculaAttrs" id="tipoMatricula" label="Tipo de Matrícula" icon="NavArrowDown" class="w-full" borderDefault="border-celestial_white" :options="[{ id: 'Anual', name: 'Anual' }]" @change="(option) => handleChangeSelect(option, 'tipoMatricula')" :disabled="tipo === 'edit'" :error="errors.tipoMatricula" />

                <BaseVeeSelectV2 :value="estadoMatricula" v-bind="estadoMatriculaAttrs" id="estadoMatricula" label="Estado de Matrícula" icon="NavArrowDown" class="w-full" borderDefault="border-celestial_white" :options="[{ id: 'Activa', name: 'Activa' }, { id: 'Inactiva', name: 'Inactiva' }]" @change="(option) => handleChangeSelect(option, 'estadoMatricula')" :error="errors.estadoMatricula" />

                <BaseVeeTextarea
                    label="Observaciones"
                    name="observaciones"
                    v-model="observaciones"
                    :error="errors.observaciones"
                    :disabled="tipo === 'edit'"
                    class="md:col-span-2" />                

            </div>
            <div class="flex justify-center py-3">
                <button 
                    class="rounded px-3 py-2 text-white font-bold bg-primary hover:bg-[#1E6657] disabled:opacity-50 disabled:cursor-not-allowed" 
                    type="submit"
                    :disabled="matriculaStore.pendingActions">
                    {{ matriculaStore.pendingActions ? 'Guardando...' : 'Guardar' }}
                </button>
            </div>
        </form>
    </div>
</template>

<style scoped>
.text-error { color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem; }
</style>