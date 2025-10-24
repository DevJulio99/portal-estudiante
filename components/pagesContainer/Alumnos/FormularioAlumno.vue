<script lang="ts" setup>
import BaseVeeSelect from '~/components/base/BaseVeeSelect.vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import type { ActualizarAlumno, Alumno, RegistrarAlumno } from '~/types/alumno.types';

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

const esInstitucionC = computed(() => tokenStore.getDataToken?.Tipo_Institucion === 'C');

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
<div class="flex flex-col h-full">
    <BaseTitle :text="tipo == 'edit' ? 'Actualizar usuario' : 'Registrar usuario'" />
    <form @submit.prevent="guardar" class="flex flex-col flex-grow min-h-0">
    <div class="w-full grid grid-cols-2 gap-4 overflow-auto flex-grow px-2 py-2">
        <div v-if="esInstitucionC" class="flex flex-col">
            <span class="font-bold">Grado</span>
            <BaseVeeSelectV2 :value="idGrado" v-bind="idGradoAttrs"
                id="idGrado"
                icon="NavArrowDown"
                class="w-full"
                borderDefault="border-celestial_white"
                label=""
                :options="gradoStore.listaGrados.map(grado => ({
                    id: grado.idGrado,
                    name: grado.descripcionGrado
                }))"
                @change="(option) => handleChangeSelect(option, 'idGrado')"
			/>
            <span v-if="errors.idGrado" class="text-error">{{ errors.idGrado }}</span>
        </div>
        <div>
            <span class="font-bold">Correo</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1 h-[44px]"
                   v-model="correo" v-bind="correoAttrs" name="correo">
            <span v-if="errors.correo" class="text-error">{{ errors.correo }}</span>
        </div>

        <div v-if="tipo == 'edit'">
            <span class="font-bold">Contraseña</span>
            <input type="password" class="w-full outline-none rounded border border-celestial_white px-2 py-1 h-[44px]"
                   v-model="contraseña" v-bind="contraseñaAttrs" name="contraseña">
            <span v-if="errors.contraseña" class="text-error">{{ errors.contraseña }}</span>
        </div>

        <div>
            <span class="font-bold">Nombre</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1 h-[44px]"
                   v-model="nombreUsuario" v-bind="nombreUsuarioAttrs" name="nombreUsuario">
            <span v-if="errors.nombreUsuario" class="text-error">{{ errors.nombreUsuario }}</span>
        </div>

        <div>
            <span class="font-bold">Apellido paterno</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1 h-[44px]"
                   v-model="apellidoPaterno" v-bind="apellidoPaternoAttrs" name="apellidoPaterno">
            <span v-if="errors.apellidoPaterno" class="text-error">{{ errors.apellidoPaterno }}</span>
        </div>

        <div>
            <span class="font-bold">Apellido materno</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1 h-[44px]"
                   v-model="apellidoMaterno" v-bind="apellidoMaternoAttrs" name="apellidoMaterno">
            <span v-if="errors.apellidoMaterno" class="text-error">{{ errors.apellidoMaterno }}</span>
        </div>

        <div>
            <span class="font-bold">Teléfono</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1 h-[44px]"
                   v-model="telefono" v-bind="telefonoAttrs" name="telefono" maxlength="9">
            <span v-if="errors.telefono" class="text-error">{{ errors.telefono }}</span>
        </div>

        <div>
            <span class="font-bold">Número de documento</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1 h-[44px]"
                   v-model="numeroDocumento" v-bind="numeroDocumentoAttrs" name="numeroDocumento" maxlength="8">
            <span v-if="errors.numeroDocumento" class="text-error">{{ errors.numeroDocumento }}</span>
        </div>

        <div>
            <span class="font-bold">Fecha de nacimiento</span>
            <input class="w-full outline-none rounded border border-celestial_white px-2 py-1 h-[44px]" type="date" name="fechaNacimiento"
                   v-model="fechaNacimiento" v-bind="fechaNacimientoAttrs" :max="fechaMinima">
            <span v-if="errors.fechaNacimiento" class="text-error">{{ errors.fechaNacimiento }}</span>
        </div>

        <div>
            <span class="font-bold">Dirección</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1 h-[44px]"
                   v-model="direccion" v-bind="direccionAttrs" name="direccion">
            <span v-if="errors.direccion" class="text-error">{{ errors.direccion }}</span>
        </div>

        <div>
            <span class="font-bold">Foto de perfil</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1 h-[44px]"
                   v-model="fotoPerfil" v-bind="fotoPerfilAttrs" name="fotoPerfil">
        </div>

        <div>
            <span class="font-bold">Género</span>
            <BaseVeeSelectV2 :value="genero" v-bind="generoAttrs"
                id="genero"
                icon="NavArrowDown"
                class="w-full"
                borderDefault="border-celestial_white"
                label=""
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
            <span v-if="errors.genero" class="text-error">{{ errors.genero }}</span>
        </div>

        <div>
            <span class="font-bold">Tipo de alumno</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1 h-[44px]"
                   v-model="tipoAlumno" v-bind="tipoAlumnoAttrs" name="tipoAlumno">
        </div>

        <div>
            <span class="font-bold">Observaciones</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1 h-[44px]"
                   v-model="observaciones" v-bind="observacionesAttrs" name="observaciones">
        </div>

        <div>
            <span class="font-bold">Apoderado</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1 h-[44px]"
                   v-model="apoderado" v-bind="apoderadoAttrs" name="apoderado">
            <span v-if="errors.apoderado" class="text-error">{{ errors.apoderado }}</span>
        </div>

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