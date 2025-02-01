<script lang="ts" setup>
import Lista from '~/components/pagesContainer/Evaluaciones/lista.vue';


</script>

<template>
  <BaseLayout :rightAside="false" bgWhite>
    <BaseTitle text="evaluaciones" />
    <div class="bg-cyan_40 p-4 rounded font-nunito border border-cyan_80 border-l-[10px]">
      <strong>¡La sección para rendir la evaluación de competencias generales ya está
      disponible!</strong> Es importante tener en cuenta que una vez que comience, no
      podrá acceder a otras secciones de la plataforma hasta terminar la
      evaluación.
    </div>

    <Lista />
  </BaseLayout>
</template>
