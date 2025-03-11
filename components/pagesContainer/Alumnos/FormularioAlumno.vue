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
    tipoInstitucion: tokenStore.getDataToken.Tipo_Institucion
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
    tipoInstitucion: tokenStore.getDataToken.Tipo_Institucion
});

const onChangeInput = (e: any) => {

    if(props.tipo == 'register'){
        registrarAlumno.value = {
        ...registrarAlumno.value,
        [e.target.name]: e.target.value
    }
    }
   
    if(props.tipo == 'edit'){
        actualizarAlumno.value = {
        ...actualizarAlumno.value,
        [e.target.name]: e.target.name == 'contraseña' ? e.target.value.trim().replace(/\s+/g, '') : e.target.value
    }
    }
    
}

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

onMounted(() => {
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
    }
});
</script>

<template>
     <BaseTitle :text="tipo == 'edit' ? 'Actualizar usuario' : 'Registrar usuario'" />
    <div class="w-full grid grid-cols-2 gap-4 overflow-auto max-h-[300px]">
        <div>
            <span class="font-bold">Correo</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1" 
                   @input="onChangeInput" name="correo" :value="actualizarAlumno.correo">
        </div>

        <div v-if="tipo == 'edit'">
            <span class="font-bold">Contraseña</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1" 
                   @input="onChangeInput" name="contraseña">
        </div>

        <div>
            <span class="font-bold">Nombre</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1"
            @input="onChangeInput" name="nombreUsuario" :value="actualizarAlumno.nombreUsuario">
        </div>

        <div>
            <span class="font-bold">Apellido Paterno</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1"
            @input="onChangeInput" name="apellidoPaterno" :value="actualizarAlumno.apellidoPaterno">
        </div>

        <div>
            <span class="font-bold">Apellido Materno</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1"
            @input="onChangeInput" name="apellidoMaterno" :value="actualizarAlumno.apellidoMaterno">
        </div>

        <div>
            <span class="font-bold">Telefono</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1"
            @input="onChangeInput" name="telefono" :value="actualizarAlumno.telefono">
        </div>

        <div>
            <span class="font-bold">Numero de Documento</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1"
            @input="onChangeInput" name="numeroDocumento" :value="actualizarAlumno.numeroDocumento">
        </div>

        <div>
            <span class="font-bold">Fecha de nacimiento</span>
            <!-- <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1"
            @input="onChangeInput" name="fechaNacimiento" :value="actualizarAlumno.fechaNacimiento"> -->
            <input class="w-full outline-none rounded border border-celestial_white px-2 py-1" type="date" name="fechaNacimiento"
            :value="actualizarAlumno.fechaNacimiento" @input="onChangeInput">
        </div>

        <div>
            <span class="font-bold">Direccion</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1"
            @input="onChangeInput" name="direccion" :value="actualizarAlumno.direccion">
        </div>

        <div>
            <span class="font-bold">Foto de perfil</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1"
            @input="onChangeInput" name="fotoPerfil" :value="actualizarAlumno.fotoPerfil">
        </div>

        <div>
            <span class="font-bold">Genero</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1"
            @input="onChangeInput" name="genero" :value="actualizarAlumno.genero">
        </div>

        <div>
            <span class="font-bold">Tipo de alumno</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1"
            @input="onChangeInput" name="tipoAlumno" :value="actualizarAlumno.tipoAlumno">
        </div>

        <div>
            <span class="font-bold">Observaciones</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1"
            @input="onChangeInput" name="observaciones" :value="actualizarAlumno.observaciones">
        </div>

        <div>
            <span class="font-bold">Apoderado</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1"
            @input="onChangeInput" name="apoderado" :value="actualizarAlumno.apoderado">
        </div>
    </div>
    <div class="flex justify-center mt-3">
        <button class="rounded px-3 py-2 text-white bg-green_40" @click="guardar">Guardar</button>
    </div>
</template>

<style>

</style>