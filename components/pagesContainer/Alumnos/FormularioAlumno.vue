<script lang="ts" setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import type { ActualizarAlumno, Alumno, RegistrarAlumno } from '~/types/alumno.types';
import BaseVeeInput from '~/components/base/BaseVeeInput.vue';
import { TipoInstitucion } from '~/types/institucion.types';

const props = withDefaults(defineProps<{
    data: Alumno | null;
    tipo: string;
}>(),
{
 tipo: 'register',
 data: null
})

const tokenStore = useTokenStore();
const alumnoStore = useAlumnoStore();
const gradoStore = useGradoStore();

const fechaMinima = computed(() => {
    const hoy = new Date();
    hoy.setFullYear(hoy.getFullYear() - 5);
    return hoy.toISOString().split('T')[0];
});

const formatearFechaInput = (fecha: string) => {
   const fecha_ = new Date(fecha);

   return fecha_.toISOString().split('T')[0];
}

const getGenero = (genero: string = '') => {
   if(genero.toLocaleLowerCase() === 'm') return {value: 1 , key : 'M'}
   return genero.toLocaleLowerCase() === 'f' ? {value: 2 , key : 'F'} : {value: 0 , key : ''}
}

const esInstitucionC = computed(() => tokenStore.getDataToken?.Tipo_Institucion === TipoInstitucion.Colegio);

const validationSchema = yup.object({
    idGrado: yup.number().when([], {
        is: () => esInstitucionC.value,
        then: schema => schema.required('El grado es obligatorio').min(1, 'Seleccione un grado'),
        otherwise: schema => schema.nullable().optional(),
    }),
    correo: yup.string().required('El correo es obligatorio').email('El correo no es válido'),
    contraseña: yup.string().when('tipo', {
        is: () => props.tipo === 'edit',
        then: (schema) => schema.transform(value => value || undefined).optional().min(6, 'Mínimo 6 caracteres'),
        otherwise: (schema) => schema.notRequired(),
    }),
    nombreUsuario: yup.string().required('El nombre es obligatorio'),
    apellidoPaterno: yup.string().required('El apellido paterno es obligatorio'),
    apellidoMaterno: yup.string().required('El apellido materno es obligatorio'),
    telefono: yup.string().required('El teléfono es obligatorio').matches(/^[9]\d{8}$/, 'Debe empezar con 9 y tener 9 dígitos'),
    numeroDocumento: yup.string().required('El DNI es obligatorio').matches(/^\d{8}$/, 'El DNI debe tener 8 dígitos'),
    fechaNacimiento: yup.date().required('La fecha de nacimiento es obligatoria').typeError('Fecha inválida'),
    direccion: yup.string().required('La dirección es obligatoria'),
    fotoPerfil: yup.string().optional(),
    genero: yup.string().required('El género es obligatorio'),
    tipoAlumno: yup.string().optional(),
    observaciones: yup.string().optional(),
    apoderado: yup.string().required('El apoderado es obligatorio'),
    habilitadoPrueba: yup.boolean(),
});

const initialValues = computed(() => {
    if (props.tipo === 'edit' && props.data) {
        return {
            correo: props.data.correo,
            contraseña: '',
            nombreUsuario: props.data.nombre,
            apellidoPaterno: props.data.apellidoPaterno,
            apellidoMaterno: props.data.apellidoMaterno,
            telefono: props.data.telefono,
            numeroDocumento: props.data.dni,
            fechaNacimiento: formatearFechaInput(props.data.fechaNacimiento),
            direccion: props.data.direccion,
            fotoPerfil: props.data.fotoPerfil,
            genero: props.data.genero,
            tipoAlumno: props.data.tipoAlumno,
            observaciones: props.data.observaciones,
            apoderado: props.data.apoderado,
            idGrado: props.data.idGrado,
            habilitadoPrueba: props.data.habilitadoPrueba,
        };
    }
    return {
        correo: '',
        nombreUsuario: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        telefono: '',
        numeroDocumento: '',
        fechaNacimiento: '',
        direccion: '',
        fotoPerfil: '',
        genero: '',
        tipoAlumno: '',
        observaciones: '',
        apoderado: '',
        idGrado: 0,
        habilitadoPrueba: false,
    };
});

const { values, errors, defineField, handleSubmit, resetForm, setFieldValue } = useForm({
    validationSchema,
    initialValues: initialValues.value,
});

// Observamos los cambios en los valores iniciales y reseteamos el formulario
watch(initialValues, (newInitialValues) => {
    resetForm({ values: newInitialValues });
});

const [idGrado, idGradoAttrs] = defineField('idGrado');
const [correo, correoAttrs] = defineField('correo');
const [contraseña, contraseñaAttrs] = defineField('contraseña');
const [nombreUsuario, nombreUsuarioAttrs] = defineField('nombreUsuario');
const [apellidoPaterno, apellidoPaternoAttrs] = defineField('apellidoPaterno');
const [apellidoMaterno, apellidoMaternoAttrs] = defineField('apellidoMaterno');
const [telefono, telefonoAttrs] = defineField('telefono');
const [numeroDocumento, numeroDocumentoAttrs] = defineField('numeroDocumento');
const [fechaNacimiento, fechaNacimientoAttrs] = defineField('fechaNacimiento');
const [direccion, direccionAttrs] = defineField('direccion');
const [fotoPerfil, fotoPerfilAttrs] = defineField('fotoPerfil');
const [genero, generoAttrs] = defineField('genero');
const [tipoAlumno, tipoAlumnoAttrs] = defineField('tipoAlumno');
const [observaciones, observacionesAttrs] = defineField('observaciones');
const [apoderado, apoderadoAttrs] = defineField('apoderado');
const [habilitadoPrueba, habilitadoPruebaAttrs] = defineField('habilitadoPrueba');

const guardar = handleSubmit(formValues => {
    if (props.tipo === 'register') {
        const payload = {
            ...formValues,
            codigoSede: tokenStore.getDataToken.Codigo_Sede,
            tipoInstitucion: tokenStore.getDataToken.Tipo_Institucion,
            idGrado: esInstitucionC.value ? formValues.idGrado : null,
        };
        alumnoStore.RegistrarAlumno(payload as RegistrarAlumno);
    }
    if (props.tipo === 'edit') {
        const payload = { 
            ...formValues,
            tipoInstitucion: tokenStore.getDataToken.Tipo_Institucion,
            idGrado: esInstitucionC.value ? formValues.idGrado : null,
        };
        alumnoStore.ActualizarAlumno(payload as ActualizarAlumno);
    }
});

const handleChangeSelect = (option: { id: string | number }, fieldName: keyof typeof values) => {
    setFieldValue(fieldName, option.id);
}

onMounted(async () => {
    if (esInstitucionC.value && gradoStore.listaGrados.length === 0) {
        await gradoStore.getGrados();
    }
});
</script>

<template>
<div class="flex flex-col flex-1 min-h-0">
    <BaseTitle :text="tipo == 'edit' ? 'Actualizar usuario' : 'Registrar usuario'" />
    <form @submit.prevent="guardar" class="flex flex-col flex-grow min-h-0" novalidate autocomplete="off">
    <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4 overflow-auto flex-grow px-2 py-2">
        <div v-if="esInstitucionC" class="flex flex-col">
            <BaseVeeSelectV2 :value="idGrado" v-bind="idGradoAttrs"
                id="idGrado"
                label="Grado"
                icon="NavArrowDown"
                class="w-full"
                borderDefault="border-celestial_white"
                placeholder="Seleccione un grado"
                :error="errors.idGrado"
                :options="gradoStore.listaGrados.map(grado => ({
                    id: grado.idGrado,
                    name: grado.descripcionGrado
                }))"
                @change="(option) => handleChangeSelect(option, 'idGrado')"
			/>
        </div>
        <BaseVeeInput
            label="Correo"
            name="correo"
            type="email"
            v-model="correo"
            :error="errors.correo"
        />

        <div v-if="tipo == 'edit'">
            <BaseVeeInput
                label="Contraseña"
                name="contraseña"
                type="password"
                v-model="contraseña"
                :error="errors.contraseña"
                autocomplete="new-password"
            />
        </div>

        <BaseVeeInput label="Nombre" name="nombreUsuario" v-model="nombreUsuario" :error="errors.nombreUsuario" />
        <BaseVeeInput label="Apellido paterno" name="apellidoPaterno" v-model="apellidoPaterno" :error="errors.apellidoPaterno" />
        <BaseVeeInput label="Apellido materno" name="apellidoMaterno" v-model="apellidoMaterno" :error="errors.apellidoMaterno" />
        <BaseVeeInput label="Teléfono" name="telefono" v-model="telefono" :error="errors.telefono" :maxlength="9" />
        <BaseVeeInput label="Número de documento" name="numeroDocumento" v-model="numeroDocumento" :error="errors.numeroDocumento" :maxlength="8" />

        <div class="flex flex-col">
            <span class="font-bold">Fecha de nacimiento</span>
            <input 
                class="w-full outline-none rounded border border-celestial_white px-2 py-1 h-[44px]" 
                type="date" name="fechaNacimiento"
                v-model="fechaNacimiento" v-bind="fechaNacimientoAttrs" :max="fechaMinima">
            <span v-if="errors.fechaNacimiento" class="text-error">{{ errors.fechaNacimiento }}</span>
        </div>

        <BaseVeeInput label="Dirección" name="direccion" v-model="direccion" :error="errors.direccion" />
        <BaseVeeInput label="Foto de perfil" name="fotoPerfil" v-model="fotoPerfil" />

        <div class="flex flex-col">
            <BaseVeeSelectV2 :value="genero" v-bind="generoAttrs"
                id="genero"
                label="Género"
                icon="NavArrowDown"
                class="w-full"
                borderDefault="border-celestial_white"
                placeholder="Seleccione un género"
                :error="errors.genero"
                :options="[
	              {
	              	id: 'M',
	              	name: 'Masculino',
	              },
	              {
	              	id: 'F',
	              	name: 'Femenino',
	              }
                ]"
                @change="(option) => handleChangeSelect(option, 'genero')"
			/>
        </div>

        <BaseVeeInput label="Tipo de alumno" name="tipoAlumno" v-model="tipoAlumno" />
        <BaseVeeInput label="Observaciones" name="observaciones" v-model="observaciones" />
        <BaseVeeInput label="Apoderado" name="apoderado" v-model="apoderado" :error="errors.apoderado" />

        <div class="flex items-center gap-2">
            <input type="checkbox" class="w-4 h-4"
                   v-model="habilitadoPrueba" v-bind="habilitadoPruebaAttrs" name="habilitadoPrueba">
            <span class="font-bold">Habilitado para prueba</span>
        </div>
    </div>

    <div class="flex justify-center py-3">
        <button 
            class="rounded px-3 py-2 text-white font-bold bg-primary hover:bg-[#1E6657] disabled:opacity-50 disabled:cursor-not-allowed" 
            type="submit" 
            :disabled="alumnoStore.pending">
            {{ alumnoStore.pending ? 'Guardando...' : 'Guardar' }}</button>
    </div>
    </form>
</div>
</template>

<style scoped>
.text-error {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}
</style>