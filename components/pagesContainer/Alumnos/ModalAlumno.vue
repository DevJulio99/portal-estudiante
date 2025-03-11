<script lang="ts" setup>
import type { Alumno } from '~/types/alumno.types';
import InfoAlumno from './InfoAlumno.vue';
import FormularioAlumno from './FormularioAlumno.vue';
import ModalEliminar from './ModalEliminar.vue';


const props = withDefaults(defineProps<{
    data: Alumno | null;
    type: 'edit' | 'info' | 'register' | 'delete';
    onClose: () => void;
}>(), 
{
    type: 'info'
})

const alumnoStore = useAlumnoStore();

const accionEliminar = (status: boolean) => {
  if(status && props.data){
    alumnoStore.EliminarAlumno(props.data.dni);
  }
  props.onClose()
}


onMounted(() => {
    
})
</script>

<template>
    <div class="fixed flex justify-center items-center w-full h-full z-50 top-[56px] pt-[50px] pb-[106px] left-0">
    
<div class="w-full pt-[26px] pr-[26px] pl-[30px] bg-white z-10"
      :class="{
        'h-full max-w-[971px]' : type != 'delete',
        'h-min max-w-[450px]' : type == 'delete',
      }">
    <div class="relative">
        <span class="absolute top-[-10px] right-0" @click="onClose">
				<nuxt-icon
					name="closeIcon"
					class="cursor-pointer text-[24px]"
					alt="icon-close"
				/>
	</span>
        
    <InfoAlumno v-if="type == 'info' && data" :data="data" />
    <FormularioAlumno v-if="type == 'register' || type == 'edit'" :tipo="type" :data="data"/>
    <ModalEliminar v-if="type == 'delete'" :on-action="accionEliminar"/>
       
    </div>
    </div>

<div class="absolute top-0 left-0 w-full h-full bg-black_transparent" @click="onClose"></div>
</div>
</template>

<style>

</style>