<script lang="ts" setup>
import Card from './card.vue';
import imgEv1 from '@/assets/images/evaluacion_1.png';
import imgEv2 from '@/assets/images/evaluacion_2.png';
import imgEv3 from '@/assets/images/evaluacion_3.png';
import type { Competencia } from '~/types/competencia.types';

const listas = [
    {
      title: 'Evaluación de competencias generales',
      description: `En esta sección podrá rendir su examen y ver los 
      resultados obtenidos.`,
      nameButton: 'Rendir evaluación',
      img: imgEv1,
      alt: 'img',
      status: 1,
      textStatus: 'Disponible ahora',
      link: ''
    },
    {
      title: 'Evaluación de competencias generales',
      description: `En esta sección podrá rendir su examen y ver los 
      resultados obtenidos.`,
      nameButton: 'Rendir evaluación',
      img: imgEv2,
      alt: 'img',
      status: 0,
      textStatus: 'Disponible desde 01/05/2025',
      link: ''
    },
    {
      title: 'Evaluación del proceso de enseñanza aprendizaje',
      description: `En esta sección podrá subir el video de su clase modelo y ver los resultados obtenidos.`,
      nameButton: 'Subir clase modelo',
      img: imgEv3,
      alt: 'img',
      status: 1,
      textStatus: 'Disponible hasta el 15/02/25',
      link: 'https://www.google.com/',
      nameLink: 'Revise los criterios para grabar el video aquí.'
    }
  ]

  const competenciaStore = useCompetenciaStore();
  const dataCompetencia = ref<Competencia[]>([]);
  const router = useRouter();

  watch(() => competenciaStore.listaCompetencia, (competencias)  => {
  if(competencias.length){
    console.log('competencias lista', competencias)
    // dataCompetencia.value = competencias.map(x => ({
    //   title: x.nombreCompetencia,
    //   description: x.descripcion,
    //   nameButton: 'Rendir evaluación',
    //   img: imgEv2,
    //   alt: 'img',
    //   status: 1,
    //   textStatus: 'Disponible ahora',
    //   link: ''
    // }))
    dataCompetencia.value = competencias;
  }
});

const goDetail = (nombre: string, competencia: Competencia) => {
  competenciaStore.setCompetenciaSeleccionada(competencia);
  router.replace(`/evaluaciones/${nombre}`);
  
}

</script>

<template>

<div class="flex flex-wrap mt-[15px] gap-5 lg:gap-[30px]" v-if="dataCompetencia.length">
  <Card v-for="lista in dataCompetencia" :data="lista" :on-detail="(nombre) => goDetail(nombre, lista)"/>
</div>
</template>