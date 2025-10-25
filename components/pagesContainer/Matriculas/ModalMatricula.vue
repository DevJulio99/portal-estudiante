<script lang="ts" setup>
import type { ResponseMatricula } from '~/types/matricula.types';
import BaseModal from '~/components/base/BaseModal.vue';
import FormularioMatricula from './FormularioMatricula.vue';

const props = withDefaults(defineProps<{
    data: ResponseMatricula | null;
    type: 'edit' | 'info' | 'register' | 'delete';
    onClose: () => void;
}>(), 
{
    type: 'info'
})
</script>

<template>
    <BaseModal :show="true" @close="onClose">
        <FormularioMatricula v-if="type == 'register' || type == 'edit'" :tipo="type" :data="data" :on-close="onClose"/>
    </BaseModal>
</template>