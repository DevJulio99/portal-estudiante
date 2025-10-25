<script lang="ts" setup>
import type { Alumno } from '~/types/alumno.types';
import BaseModal from '~/components/base/BaseModal.vue';
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

const maxWidthClass = computed(() => {
    if (props.type === 'delete') return 'max-w-[450px]';
    return 'max-w-[971px]';
});

const maxHeightClass = computed(() => {
    if (props.type === 'register' || props.type === 'edit') return 'max-h-[95vh]';
    return 'max-h-[90vh]'; // Altura por defecto para 'info' y 'delete'
});
</script>

<template>
    <BaseModal :show="true" :max-width="maxWidthClass" :max-height="maxHeightClass" @close="onClose">
        <InfoAlumno v-if="type == 'info' && data" :data="data" />
        <FormularioAlumno v-if="type == 'register' || type == 'edit'" :tipo="type" :data="data"/>
        <ModalEliminar v-if="type == 'delete'" :on-action="accionEliminar"/>
    </BaseModal>
</template>

<style>

</style>