<script lang="ts" setup>
import BaseVeeSelect from '~/components/base/BaseVeeSelect.vue';
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

const formActual = computed(() => props.tipo == 'register' ? registrarAlumno.value : actualizarAlumno.value);

const guardar = () => {

    const formGuardar =  props.tipo == 'register' ? registrarAlumno.value : actualizarAlumno.value;

    const formValido = validateForm(formGuardar, ['fotoPerfil', 'observaciones', 'habilitadoPrueba', 'tipoAlumno', 'contraseña']);
    
    if(props.tipo == 'register' && formValido == 0){
        console.log('registrarAlumno',registrarAlumno.value);
        alumnoStore.RegistrarAlumno(formGuardar as RegistrarAlumno);
    }
    if(props.tipo == 'edit' && formValido == 0){
        console.log('actualizarAlumno',actualizarAlumno.value);
        alumnoStore.ActualizarAlumno(formGuardar as ActualizarAlumno);
    }

}

const formatearFechaInput = (fecha: string) => {
   const fecha_ = new Date(fecha);

   return fecha_.toISOString().split('T')[0];
}

const handleChangeSelect = (val: any, id?: string) => {
  if(id === 'genero'){
    const genero = getGenero(val.id == 1 ? 'M' : 'F');
    setSelectData(id, genero.key)
  }
}

const setSelectData = (name: string, value: string) => {
    if (props.tipo == 'register') {
        registrarAlumno.value = {
            ...registrarAlumno.value,
            [name]: value
        };
    }

    if (props.tipo == 'edit') {
        actualizarAlumno.value = {
            ...actualizarAlumno.value,
            [name]: value
        };
    }
}

const getGenero = (genero: string = '') => {
   if(genero.toLocaleLowerCase() === 'm') return {value: 1 , key : 'M'}
   return genero.toLocaleLowerCase() === 'f' ? {value: 2 , key : 'F'} : {value: 0 , key : ''}
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
    <div class="w-full grid grid-cols-2 gap-4 overflow-auto max-h-[300px] px-2">
        <div>
            <span class="font-bold">Grado</span>
            <select 
                class="w-full outline-none rounded border border-celestial_white px-2 py-1"
                name="idGrado"
                @change="onChangeInput"
                :value="formActual.idGrado">
                <option value="" disabled>Seleccione un grado</option>
                <option v-for="grado in gradoStore.listaGrados" :key="grado.idGrado" :value="grado.idGrado">
                    {{ grado.descripcionGrado }}
                </option>
            </select>
            <span v-if="alumnoStore.errorForm.includes('idGrado')" class="text-error">Grado obligatorio</span>
        </div>
        <div>
            <span class="font-bold">Correo</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1 h-[44px]" 
                   @input="onChangeInput" name="correo" :value="formActual.correo">
                   <span v-if="alumnoStore.errorForm.includes('correo')" class="text-error">Correo obligatorio</span>
        </div>

        <div v-if="tipo == 'edit'">
            <span class="font-bold">Contraseña</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1 h-[44px]" 
                   @input="onChangeInput" name="contraseña">
        </div>

        <div>
            <span class="font-bold">Nombre</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1 h-[44px]"
            @input="onChangeInput" name="nombreUsuario" :value="formActual.nombreUsuario">
            <span v-if="alumnoStore.errorForm.includes('nombreUsuario')" class="text-error">Nombre obligatorio</span>
        </div>

        <div>
            <span class="font-bold">Apellido paterno</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1 h-[44px]"
            @input="onChangeInput" name="apellidoPaterno" :value="formActual.apellidoPaterno">
            <span v-if="alumnoStore.errorForm.includes('apellidoPaterno')" class="text-error">Apellido Paterno obligatorio</span>
        </div>

        <div>
            <span class="font-bold">Apellido materno</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1 h-[44px]"
            @input="onChangeInput" name="apellidoMaterno" :value="formActual.apellidoMaterno">
            <span v-if="alumnoStore.errorForm.includes('apellidoMaterno')" class="text-error">Apellido Materno obligatorio</span>
        </div>

        <div>
            <span class="font-bold">Teléfono</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1 h-[44px]"
            @input="onChangeInput" name="telefono" :value="formActual.telefono">
            <span v-if="alumnoStore.errorForm.includes('telefono')" class="text-error">Telefono obligatorio</span>
        </div>

        <div>
            <span class="font-bold">Número de documento</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1 h-[44px]"
            @input="onChangeInput" name="numeroDocumento" :value="formActual.numeroDocumento">
            <span v-if="alumnoStore.errorForm.includes('numeroDocumento')" class="text-error">Numero de documento obligatorio</span>
        </div>

        <div>
            <span class="font-bold">Fecha de nacimiento</span>
            <input class="w-full outline-none rounded border border-celestial_white px-2 py-1 h-[44px]" type="date" name="fechaNacimiento"
            :value="formActual.fechaNacimiento" @input="onChangeInput"
            :max="fechaMinima">
            <span v-if="alumnoStore.errorForm.includes('fechaNacimiento')" class="text-error">Fecha de nacimiento obligatorio</span>
        </div>

        <div>
            <span class="font-bold">Dirección</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1 h-[44px]"
            @input="onChangeInput" name="direccion" :value="formActual.direccion">
            <span v-if="alumnoStore.errorForm.includes('direccion')" class="text-error">Direccion obligatorio</span>
        </div>

        <div>
            <span class="font-bold">Foto de perfil</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1 h-[44px]"
            @input="onChangeInput" name="fotoPerfil" :value="formActual.fotoPerfil">
        </div>

        <div>
            <span class="font-bold">Género</span>
            <!-- <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1"
            @input="onChangeInput" name="genero" :value="props.tipo === 'register' ? registrarAlumno.genero : actualizarAlumno.genero"> -->
            <BaseVeeSelectV2
				id="genero"
				:value="getGenero(formActual.genero).value"
				icon="NavArrowDown"
				class="w-full"
                borderDefault="border-celestial_white"
				label=""
				:options="[
	              {
	              	id: 1,
	              	name: 'Masculino',
	              },
	              {
	              	id: 2,
	              	name: 'Femenino',
	              }
                ]"
				@change="handleChangeSelect"
			/>
            <span v-if="alumnoStore.errorForm.includes('genero')" class="text-error">Genero obligatorio</span>
        </div>

        <div>
            <span class="font-bold">Tipo de alumno</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1 h-[44px]"
            @input="onChangeInput" name="tipoAlumno" :value="formActual.tipoAlumno">
        </div>

        <div>
            <span class="font-bold">Observaciones</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1 h-[44px]"
            @input="onChangeInput" name="observaciones" :value="formActual.observaciones">
        </div>

        <div>
            <span class="font-bold">Apoderado</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1 h-[44px]"
            @input="onChangeInput" name="apoderado" :value="formActual.apoderado">
            <span v-if="alumnoStore.errorForm.includes('apoderado')" class="text-error">Apoderado obligatorio</span>
        </div>

        <div class="flex gap-3">
            <span class="font-bold">Habilitado para prueba</span>
            <input type="checkbox"
                @change="onChangeInput"
                name="habilitadoPrueba"
                :checked="formActual.habilitadoPrueba"
                class="w-6 h-6 outline-none border border-celestial_white px-2 py-1">
        </div>
    </div>
    <div class="flex justify-center mt-3">
        <button class="rounded px-3 py-2 text-white font-bold bg-primary hover:bg-[#1E6657]" @click="guardar">Guardar</button>
    </div>
</template>

<style>

</style>