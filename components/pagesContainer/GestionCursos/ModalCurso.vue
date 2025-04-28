<script lang="ts" setup>
import type { Course } from '~/types/gestionCursos.types';
import InfoCurso from './InfoCurso.vue';
import FormularioCurso from './FormularioCurso.vue';
import ModalEliminar from './ModalEliminar.vue';


const props = withDefaults(defineProps<{
    data: Course | null;
    type: 'edit' | 'info' | 'register' | 'delete';
    onClose: () => void;
}>(), 
{
    type: 'info'
})

const cursoStore = useCursoStore();

const accionEliminar = (status: boolean) => {
  if(status && props.data){
    cursoStore.EliminarCurso(props.data.idCurso);
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
        
    <InfoCurso v-if="type == 'info' && data" :data="data" />
    <FormularioCurso v-if="type == 'register' || type == 'edit'" :tipo="type" :data="data"/>
    <ModalEliminar v-if="type == 'delete'" :on-action="accionEliminar"/>
       
    </div>
    </div>

<div class="absolute top-0 left-0 w-full h-full bg-black_transparent" @click="onClose"></div>
</div>
</template>

<style>

</style>