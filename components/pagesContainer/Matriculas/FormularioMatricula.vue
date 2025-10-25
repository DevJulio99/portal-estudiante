<script lang="ts" setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import type { ResponseMatricula, RequestMatricula } from '~/types/matricula.types';
import { TipoInstitucion } from '~/types/institucion.types';
import BaseVeeTextarea from '~/components/base/BaseVeeTextarea.vue';

const props = defineProps<{
    data: ResponseMatricula | null;
    tipo: 'register' | 'edit';
    onClose: () => void;
}>();

const matriculaStore = useMatriculaStore();
const alumnoStore = useAlumnoStore();
const gradoStore = useGradoStore();
const tokenStore = useTokenStore();

const esInstitucionC = computed(() => tokenStore.getDataToken?.Tipo_Institucion === TipoInstitucion.Colegio);

const validationSchema = yup.object({
    idAlumno: yup.number().required('El alumno es obligatorio').min(1, 'Seleccione un alumno'),
    // idGrado: yup.number().when([], {
    //     is: () => esInstitucionC.value,
    //     then: schema => schema.required('El grado es obligatorio').min(1, 'Seleccione un grado'),
    //     otherwise: schema => schema.nullable().optional(),
    // }),
    idGrado: yup.number().required('El grado es obligatorio').min(1, 'Seleccione un grado'),
    idPeriodo: yup.number().required('El periodo es obligatorio').min(1, 'Seleccione un periodo'),
    tipoMatricula: yup.string().required('El tipo de matrícula es obligatorio'),
    estadoMatricula: yup.string().required('El estado es obligatorio'),
    observaciones: yup.string().optional(),
    activo: yup.boolean().optional(),
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
        activo: true,
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

const [idGrado, idGradoAttrs] = defineField('idGrado');
const [idPeriodo, idPeriodoAttrs] = defineField('idPeriodo');
const [tipoMatricula, tipoMatriculaAttrs] = defineField('tipoMatricula');
const [estadoMatricula, estadoMatriculaAttrs] = defineField('estadoMatricula');
const [observaciones, observacionesAttrs] = defineField('observaciones');
const [activo, activoAttrs] = defineField('activo');

// El idAlumno no necesita un defineField porque no es un input del usuario en este formulario

const guardar = handleSubmit(async (formValues) => {
    if (props.tipo === 'register') {
        const payload: RequestMatricula = {
            idAlumno: formValues.idAlumno,
            idPeriodo: formValues.idPeriodo,
            idGrado: formValues.idGrado,
            codigoSede: tokenStore.getDataToken.Codigo_Sede,
            tipoMatricula: formValues.tipoMatricula,
            estadoMatricula: formValues.estadoMatricula,
            observaciones: formValues.observaciones,
            usuarioRegistro: tokenStore.getDataToken.Dni_Usuario,
        };
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

onMounted(async () => {
    if (gradoStore.listaGrados.length === 0) {
        await gradoStore.getGrados();
    }
    if (matriculaStore.listaPeriodos.length === 0) {
        await matriculaStore.getPeriodos();
    }
});
</script>

<template>
    <div class="flex flex-col flex-1 min-h-0">
        <BaseTitle :text="tipo === 'edit' ? 'Actualizar Matrícula' : 'Registrar Matrícula'" />
        <form @submit.prevent="guardar" class="flex flex-col flex-1 min-h-0" novalidate autocomplete="off">
            <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4 overflow-auto flex-grow px-2 py-2">
                <BaseVeeSelectV2 :value="idGrado" v-bind="idGradoAttrs" id="idGrado" label="Grado" icon="NavArrowDown" class="w-full" borderDefault="border-celestial_white" :options="gradoStore.listaGrados.map(g => ({ id: g.idGrado, name: g.descripcionGrado }))" @change="(option) => handleChangeSelect(option, 'idGrado')" :disabled="tipo === 'edit'" :error="errors.idGrado" placeholder="Seleccione un grado" />

                <BaseVeeSelectV2 :value="idPeriodo" v-bind="idPeriodoAttrs" id="idPeriodo" label="Periodo" icon="NavArrowDown" class="w-full" borderDefault="border-celestial_white" :options="matriculaStore.listaPeriodos.map(p => ({ id: p.idPeriodo, name: p.descripcionPeriodo }))" @change="(option) => handleChangeSelect(option, 'idPeriodo')" :disabled="tipo === 'edit'" :error="errors.idPeriodo" placeholder="Seleccione un periodo" />

                <BaseVeeSelectV2 :value="tipoMatricula" v-bind="tipoMatriculaAttrs" id="tipoMatricula" label="Tipo de Matrícula" icon="NavArrowDown" class="w-full" borderDefault="border-celestial_white" :options="[{ id: 'Anual', name: 'Anual' }]" @change="(option) => handleChangeSelect(option, 'tipoMatricula')" :disabled="tipo === 'edit'" :error="errors.tipoMatricula" />

                <BaseVeeSelectV2 :value="estadoMatricula" v-bind="estadoMatriculaAttrs" id="estadoMatricula" label="Estado de Matrícula" icon="NavArrowDown" class="w-full" borderDefault="border-celestial_white" :options="[{ id: 'Activa', name: 'Activa' }, { id: 'Inactiva', name: 'Inactiva' }]" @change="(option) => handleChangeSelect(option, 'estadoMatricula')" :error="errors.estadoMatricula" />

                <BaseVeeTextarea
                    label="Observaciones"
                    name="observaciones"
                    v-model="observaciones"
                    :error="errors.observaciones"
                    :disabled="tipo === 'edit'"
                    class="md:col-span-2" />
                <!-- <div v-if="tipo === 'edit'" class="flex gap-3 items-center">
                    <span class="font-bold">Matrícula Activa</span>
                    <input type="checkbox" v-model="activo" v-bind="activoAttrs" name="activo" class="w-6 h-6 outline-none border border-celestial_white px-2 py-1">
                </div> -->
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