<script lang="ts" setup>
import type { Course } from '~/types/gestionCursos.types';


defineProps<{
    data: Course;
}>()


</script>

<template>
    <BaseTitle text="Información del curso" />

<div class="grid grid-cols-4 gap-x-4 gap-y-10">
   <span>
    <p class="font-bold">Código del curso:</p>
    <p>{{ data.codigoCurso }}</p>
   </span>
   
   <span>
    <p class="font-bold">Nombre del curso</p>
    <p>{{ data.descripcion }}</p>
   </span>

   <span>
    <p class="font-bold">Créditos</p>
    <p>{{ data.creditos }}</p>
   </span>

   <span>
    <p class="font-bold">Modalidad</p>
    <p>{{ data.modalidad }}</p>
   </span>

   <span>
    <p class="font-bold">Nivel</p>
    <p>{{ data.nivel }}</p>
   </span>
</div>
</template>

<style>

</style>