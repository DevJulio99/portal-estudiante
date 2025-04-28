<script lang="ts" setup>
import BaseVeeSelect from '~/components/base/BaseVeeSelect.vue';
import type { ActualizarCurso, Course, RegistrarCurso } from '~/types/gestionCursos.types';

const props = withDefaults(defineProps<{
    data: Course | null;
    tipo: string;
}>(),
{
 tipo: 'register',
 data: null
})

const tokenStore = useTokenStore();
const cursoStore = useCursoStore();

const fechaMinima = computed(() => {
    const hoy = new Date();
    hoy.setFullYear(hoy.getFullYear() - 5);
    return hoy.toISOString().split('T')[0];
});
/*
export interface RequestCourse{
    descripcion: string;
    creditos: number;
    modalidad: string;
    nivel: string;
}

export interface RegistrarCurso extends RequestCourse {
    codigoSede: string;
}
*/
const registrarCurso = ref<RegistrarCurso>({
    descripcion: '',
    creditos: 0,
    modalidad: '',
    nivel: '',
    codigoSede: tokenStore.getDataToken.Codigo_Sede,
});
const actualizarCurso = ref<ActualizarCurso>({
    idCurso: 0,
    descripcion: '',
    creditos: 0,
    modalidad: '',
    nivel: '',
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
        registrarCurso.value = {
            ...registrarCurso.value,
            [e.target.name]: value
        };
    }

    if (props.tipo == 'edit') {
        actualizarCurso.value = {
            ...actualizarCurso.value,
            [e.target.name]: e.target.name == 'contraseña' ? value.trim().replace(/\s+/g, '') : value
        };
    }
};

const formActual = computed(() => props.tipo == 'register' ? registrarCurso.value : actualizarCurso.value);

const guardar = () => {

    const formCurso =  props.tipo == 'register' ? registrarCurso.value : actualizarCurso.value;

    const formValido = validateForm(formCurso, ['fotoPerfil', 'observaciones', 'habilitadoPrueba', 'tipoAlumno', 'contraseña']);
    
    if(props.tipo == 'register' && formValido){
        console.log('registrarAlumno',registrarCurso.value);
        cursoStore.RegistrarCurso(formCurso as RegistrarCurso);
    }
    if(props.tipo == 'edit' && formValido){
        console.log('actualizarAlumno',actualizarCurso.value);
        cursoStore.ActualizarCurso(formCurso as ActualizarCurso);
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
        registrarCurso.value = {
            ...registrarCurso.value,
            [name]: value
        };
    }

    if (props.tipo == 'edit') {
        actualizarCurso.value = {
            ...actualizarCurso.value,
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
        actualizarCurso.value.descripcion = props.data?.descripcion;
        actualizarCurso.value.creditos = props.data?.creditos;
        actualizarCurso.value.modalidad = props.data?.modalidad;
        actualizarCurso.value.nivel = props.data?.nivel;
    }
});
</script>

<template>
     <BaseTitle :text="tipo == 'edit' ? 'Actualizar curso' : 'Registrar curso'" />
    <div class="w-full grid grid-cols-2 gap-4 overflow-auto max-h-[300px] px-2">
        <!-- <div>
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
            <span v-if="alumnoStore.errorForm.includes('idGrado')" class="text-error">{{alumnoStore?.msgError?.idGrado}}</span>
        </div> -->
        <div>
            <span class="font-bold">Nombre del curso</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1 h-[44px]" 
                   @input="onChangeInput" name="descripcion" :value="formActual.descripcion">
                   <span v-if="cursoStore.errorForm.includes('descripcion')" class="text-error">{{cursoStore?.msgError?.descripcion}}</span>
        </div>

        <!-- <div v-if="tipo == 'edit'">
            <span class="font-bold">Contraseña</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1 h-[44px]" 
                   @input="onChangeInput" name="contraseña">
        </div> -->

        <div>
            <span class="font-bold">Créditos</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1 h-[44px]"
            @input="onChangeInput" name="creditos" :value="formActual.creditos">
            <span v-if="cursoStore.errorForm.includes('creditos')" class="text-error">{{cursoStore?.msgError?.creditos}}</span>
        </div>

        <div>
            <span class="font-bold">Modalidad</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1 h-[44px]"
            @input="onChangeInput" name="modalidad" :value="formActual.modalidad">
            <span v-if="cursoStore.errorForm.includes('modalidad')" class="text-error">{{cursoStore?.msgError?.modalidad}}</span>
        </div>

        <div>
            <span class="font-bold">Nivel</span>
            <input type="text" class="w-full outline-none rounded border border-celestial_white px-2 py-1 h-[44px]"
            @input="onChangeInput" name="nivel" :value="formActual.nivel">
            <span v-if="cursoStore.errorForm.includes('nivel')" class="text-error">{{cursoStore?.msgError?.nivel}}</span>
        </div>
    </div>
    <div class="flex justify-center mt-3">
        <button class="rounded px-3 py-2 text-white font-bold bg-primary hover:bg-[#1E6657]" @click="guardar">Guardar</button>
    </div>
</template>

<style>

</style>