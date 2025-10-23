<script lang="ts" setup>
import type { ResponseMatricula } from '~/types/matricula.types';
import FormularioMatricula from './FormularioMatricula.vue';

const props = withDefaults(defineProps<{
    data: ResponseMatricula | null;
    type: 'edit' | 'info' | 'register' | 'delete';
    onClose: () => void;
}>(), 
{
    type: 'info'
})

onMounted(() => {
    toggleHiddenScroll();
})

onUnmounted(() => {
    toggleHiddenScroll();
})
</script>

<template>
    <div class="fixed flex justify-center items-center w-full h-full z-50 top-[56px] pt-[50px] pb-[106px] left-0">
        <div class="w-full pt-[26px] pr-[26px] pl-[30px] bg-white z-10 h-min max-w-[700px]">
            <div class="relative h-full">
                <span class="absolute top-[-10px] right-0" @click="onClose"><nuxt-icon name="closeIcon" class="cursor-pointer text-[24px]" alt="icon-close" /></span>
                <FormularioMatricula v-if="type == 'register' || type == 'edit'" :tipo="type" :data="data" :on-close="onClose"/>
            </div>
        </div>
        <div class="absolute top-0 left-0 w-full h-full bg-black_transparent" @click="onClose"></div>
    </div>
</template>