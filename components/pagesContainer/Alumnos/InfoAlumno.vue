<script lang="ts" setup>
import type { Alumno } from '~/types/alumno.types';
import { useDateFormat } from '@vueuse/core';

const props = defineProps<{
    data: Alumno;
}>();

const formattedDate = computed(() => {
    if (props.data.fechaNacimiento) {
        return useDateFormat(props.data.fechaNacimiento, 'DD/MM/YYYY').value;
    }
    return '-';
});

const displayValue = (value: string | null | undefined) => value || '-';

</script>

<template>
    <BaseTitle text="Información del usuario" />

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 py-4">
        <div class="info-item">
            <p class="info-label">Código del alumno:</p>
            <p class="info-value">{{ displayValue(data.codigoAlumno) }}</p>
        </div>
        <div class="info-item">
            <p class="info-label">Número de documento</p>
            <p class="info-value">{{ displayValue(data.dni) }}</p>
        </div>
        <div class="info-item">
            <p class="info-label">Fecha de nacimiento</p>
            <p class="info-value">{{ formattedDate }}</p>
        </div>
        <div class="info-item sm:col-span-2 lg:col-span-3">
            <p class="info-label">Dirección</p>
            <p class="info-value">{{ displayValue(data.direccion) }}</p>
        </div>
        <div class="info-item">
            <p class="info-label">Género</p>
            <p class="info-value">{{ displayValue(data.genero === 'M' ? 'Masculino' : 'Femenino') }}</p>
        </div>
        <div class="info-item">
            <p class="info-label">Apoderado</p>
            <p class="info-value">{{ displayValue(data.apoderado) }}</p>
        </div>
        <div class="info-item sm:col-span-2 lg:col-span-3">
            <p class="info-label">Observaciones</p>
            <p class="info-value">{{ displayValue(data.observaciones) }}</p>
        </div>
    </div>
</template>

<style lang="postcss" scoped>
.info-label {
    @apply text-sm font-bold text-darkBlue mb-1;
}
.info-value {
    @apply text-base text-midnightBlue;
}
</style>