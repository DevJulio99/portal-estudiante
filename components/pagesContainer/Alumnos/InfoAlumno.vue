<script lang="ts" setup>
import type { Alumno } from '~/types/alumno.types';


defineProps<{
    data: Alumno;
}>()


</script>

<template>
    <BaseTitle text="Información del usuario" />

<div class="grid grid-cols-4 gap-x-4 gap-y-10">
   <span>
    <p class="font-bold">Código del alumno:</p>
    <p>{{ data.codigoAlumno }}</p>
   </span>
   
   <span>
    <p class="font-bold">Número de documento</p>
    <p>{{ data.dni }}</p>
   </span>

   <span>
    <p class="font-bold">Fecha de nacimiento</p>
    <p>{{ data.fechaNacimiento }}</p>
   </span>

   <span>
    <p class="font-bold">Dirección</p>
    <p>{{ data.direccion }}</p>
   </span>

   <span>
    <p class="font-bold">Género</p>
    <p>{{ data.genero }}</p>
   </span>

   <span>
    <p class="font-bold">Tipo de alumno</p>
    <p>{{ data.tipoAlumno }}</p>
   </span>

   <span>
    <p class="font-bold">Observaciones</p>
    <p>{{ data.observaciones }}</p>
   </span>

   <span>
    <p class="font-bold">Apoderado</p>
    <p>{{ data.apoderado}}</p>
   </span>
</div>
</template>

<style>

</style>