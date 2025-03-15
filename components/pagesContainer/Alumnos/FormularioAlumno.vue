<script lang="ts" setup>
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

const registrarAlumno = ref<RegistrarAlumno>({
    correo: '',
    nombreUsuario: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    telefono: '',
    numeroDocumento: '',
    codigoSede: tokenStore.getDataToken.Codigo_Sede,
    fechaNacimiento: '',
    direccion: '',
    fotoPerfil: '',
    genero: '',
    tipoAlumno: '',
    observaciones: '',
    apoderado: '',
    tipoInstitucion: tokenStore.getDataToken.Tipo_Institucion,
    idGrado: 0,
    habilitadoPrueba: false
});
const actualizarAlumno = ref<ActualizarAlumno>({
    correo: '',
    contraseña: '',
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
    tipoInstitucion: tokenStore.getDataToken.Tipo_Institucion,
    idGrado: 0,
    habilitadoPrueba: false
});

const onChangeInput = (e: any) => {
    let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    if (e.target.name === 'telefono') {
        value = value.replace(/\D/g, '');

        if (value.length > 0 && value[0] !== '9') {
            value = '';
        }

        if (value.length > 9) {
            value = value.slice(0, 9);
        }
    }

    if (e.target.name === 'numeroDocumento') {
        value = value.replace(/\D/g, '');

        if (value.length > 8) {
            value = value.slice(0, 8);
        }
    }

    if (props.tipo == 'register') {
        registrarAlumno.value = {
            ...registrarAlumno.value,
            [e.target.name]: value
        };
    }

    if (props.tipo == 'edit') {
        actualizarAlumno.value = {
            ...actualizarAlumno.value,
            [e.target.name]: e.target.name == 'contraseña' ? value.trim().replace(/\s+/g, '') : value
        };
    }
};

const guardar = () => {

    if(props.tipo == 'register'){
        console.log('registrarAlumno',registrarAlumno.value);
        alumnoStore.RegistrarAlumno(registrarAlumno.value);
    }
    if(props.tipo == 'edit'){
        console.log('actualizarAlumno',actualizarAlumno.value);
        alumnoStore.ActualizarAlumno(actualizarAlumno.value);
    }

}

const formatearFechaInput = (fecha: string) => {
   const fecha_ = new Date(fecha);

   return fecha_.toISOString().split('T')[0];
}

onMounted(async () => {
    console.log('tokenStore.getDataToken', tokenStore.getDataToken)
    if(props.tipo == 'edit' && props.data){
        actualizarAlumno.value.correo = props.data?.correo;
        actualizarAlumno.value.nombreUsuario = props.data?.nombre;
        actualizarAlumno.value.apellidoPaterno = props.data?.apellidoPaterno;
        actualizarAlumno.value.apellidoMaterno = props.data?.apellidoMaterno;
        actualizarAlumno.value.telefono = props.data?.telefono;
        actualizarAlumno.value.numeroDocumento = props.data?.dni;
        actualizarAlumno.value.fechaNacimiento = formatearFechaInput(props.data.fechaNacimiento);
        actualizarAlumno.value.direccion = props.data?.direccion;
        actualizarAlumno.value.fotoPerfil = props.data?.fotoPerfil;
        actualizarAlumno.value.genero = props.data?.genero;
        actualizarAlumno.value.tipoAlumno = props.data?.tipoAlumno;
        actualizarAlumno.value.observaciones = props.data?.observaciones;
        actualizarAlumno.value.apoderado = props.data?.apoderado;
        actualizarAlumno.value.idGrado = props.data?.idGrado;
        actualizarAlumno.value.habilitadoPrueba = props.data?.habilitadoPrueba;
    }

    if (gradoStore.listaGrados.length === 0) {
        await gradoStore.getGrados();
    }
});
</script>

<template>
     <BaseTitle :text="tipo == 'edit' ? 'Actualizar usuario' : 'Registrar usuario'" />
    <div class="w-full grid grid-cols-2 gap-4 overflow-auto max-h-[300px]">
        <div>
            <span class="font-bold">Grado</span>
            <select 
                class="w-full outline-none rounded border border-celestial_white px-2 py-1"
                name="idGrado"
                @change="onChangeInput"
                :value="props.tipo === 'register' ? registrarAlumno.idGrado : actualizarAlumno.idGrado">
                <option value="" disabled>Seleccione un grado</option>
                <option v-for="grado in gradoStore.listaGrados" :key="grado.idGrado" :value="grado.idGrado">
                    {{ grado.descripcionGrado }}
                </option>
            </select>
        </div>
        <div>
            <span class="font-bold">Correo</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1" 
                   @input="onChangeInput" name="correo" :value="props.tipo === 'register' ? registrarAlumno.correo : actualizarAlumno.correo">
        </div>

        <div v-if="tipo == 'edit'">
            <span class="font-bold">Contraseña</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1" 
                   @input="onChangeInput" name="contraseña">
        </div>

        <div>
            <span class="font-bold">Nombre</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1"
            @input="onChangeInput" name="nombreUsuario" :value="props.tipo === 'register' ? registrarAlumno.nombreUsuario : actualizarAlumno.nombreUsuario">
        </div>

        <div>
            <span class="font-bold">Apellido paterno</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1"
            @input="onChangeInput" name="apellidoPaterno" :value="props.tipo === 'register' ? registrarAlumno.apellidoPaterno : actualizarAlumno.apellidoPaterno">
        </div>

        <div>
            <span class="font-bold">Apellido materno</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1"
            @input="onChangeInput" name="apellidoMaterno" :value="props.tipo === 'register' ? registrarAlumno.apellidoMaterno : actualizarAlumno.apellidoMaterno">
        </div>

        <div>
            <span class="font-bold">Teléfono</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1"
            @input="onChangeInput" name="telefono" :value="props.tipo === 'register' ? registrarAlumno.telefono : actualizarAlumno.telefono">
        </div>

        <div>
            <span class="font-bold">Número de documento</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1"
            @input="onChangeInput" name="numeroDocumento" :value="props.tipo === 'register' ? registrarAlumno.numeroDocumento : actualizarAlumno.numeroDocumento">
        </div>

        <div>
            <span class="font-bold">Fecha de nacimiento</span>
            <!-- <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1"
            @input="onChangeInput" name="fechaNacimiento" :value="actualizarAlumno.fechaNacimiento"> -->
            <input class="w-full outline-none rounded border border-celestial_white px-2 py-1" type="date" name="fechaNacimiento"
            :value="props.tipo === 'register' ? registrarAlumno.fechaNacimiento : actualizarAlumno.fechaNacimiento" @input="onChangeInput"
            :max="fechaMinima">
        </div>

        <div>
            <span class="font-bold">Dirección</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1"
            @input="onChangeInput" name="direccion" :value="props.tipo === 'register' ? registrarAlumno.direccion : actualizarAlumno.direccion">
        </div>

        <div>
            <span class="font-bold">Foto de perfil</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1"
            @input="onChangeInput" name="fotoPerfil" :value="props.tipo === 'register' ? registrarAlumno.fotoPerfil : actualizarAlumno.fotoPerfil">
        </div>

        <div>
            <span class="font-bold">Género</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1"
            @input="onChangeInput" name="genero" :value="props.tipo === 'register' ? registrarAlumno.genero : actualizarAlumno.genero">
        </div>

        <div>
            <span class="font-bold">Tipo de alumno</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1"
            @input="onChangeInput" name="tipoAlumno" :value="props.tipo === 'register' ? registrarAlumno.tipoAlumno : actualizarAlumno.tipoAlumno">
        </div>

        <div>
            <span class="font-bold">Observaciones</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1"
            @input="onChangeInput" name="observaciones" :value="props.tipo === 'register' ? registrarAlumno.observaciones : actualizarAlumno.observaciones">
        </div>

        <div>
            <span class="font-bold">Apoderado</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1"
            @input="onChangeInput" name="apoderado" :value="props.tipo === 'register' ? registrarAlumno.apoderado : actualizarAlumno.apoderado">
        </div>

        <div class="flex gap-3">
            <span class="font-bold">Habilitado para prueba</span>
            <input type="checkbox"
                @change="onChangeInput"
                name="habilitadoPrueba"
                class="w-6 h-6 outline-none border border-celestial_white px-2 py-1">
        </div>
    </div>
    <div class="flex justify-center mt-3">
        <button class="rounded px-3 py-2 text-white font-bold bg-primary hover:bg-[#1E6657]" @click="guardar">Guardar</button>
    </div>
</template>

<style>

</style>