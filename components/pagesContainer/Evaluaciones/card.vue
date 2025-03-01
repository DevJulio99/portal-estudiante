<script lang="ts" setup>
import type { Competencia } from '~/types/competencia.types';
import imgEv2 from '@/assets/images/evaluacion_2.png';

const props = defineProps<{
	data: Competencia;
  onDetail: (name: string) => void;
}>();

//const router = useRouter();


// const goDetail = (name: string) => {
//   router.replace(`/evaluaciones/${name}`);
// }

const validarFechas = (fechaInicio: string, fechaFin: string) => {
  if(!fechaInicio.trim().length || !fechaFin.trim().length) return false
  const fechaInicio_ = transformarFecha(fechaInicio);
  const fechaFin_ = transformarFecha(fechaFin);
  const fechaActual = new Date();

  //console.log('fechaInicio_', fechaInicio_)

  //if(fechaInicio_ == 'Invalid Date' || fechaFin_ == 'Invalid Date')

  const dentroRango = fechaActual.getTime() >= fechaInicio_.getTime() && fechaActual.getTime() <= fechaFin_.getTime();
  const rangoDesfasado = fechaFin_.getTime() < fechaActual.getTime();

  return dentroRango ? 1 : (rangoDesfasado ? 3 : 2)
}

const transformarFecha = (date: string) => {
   const [dia, mes, año] = date.split(' ')[0].split('/');
   const dia_ = dia ?? -1;
   const mes_ = mes ?? -1;
   const año_ = año ?? -1;


   if(parseInt(dia_) < 0 || parseInt(mes_) < 0 || parseInt(año_) < 0) return new Date(0)

   return new Date(`${mes}/${dia}/${año}`)
}

const stadoFecha = validarFechas(props.data.fechaInicio, props.data.fechaFin);

const status = () => (stadoFecha == 1 || props.data.finalizado) ? 'bg-green_70' : (stadoFecha == 2 ? 'bg-yellow' : 'bg-error');
</script>

<template>
  <div
    class="relative shadow-[0_4px_4px_#00000040] border border-gray_50 py-[15px] pr-[13px] pl-[10px] w-full h-auto lg:max-w-[341px] rounded-[6px] bg-white"
    >
    <div
        class="z-10 w-full py-[5px] text-xs text-white font-nunito rounded-[16px] absolute top-[9px] left-[10px] text-center lg:max-w-[201px]"
        :class="status()"
        >
        {{data.finalizado ? 'Finalizado' : (stadoFecha == 1 ? 'Disponible ahora' : (stadoFecha == 2 ? `Disponible desde ${transformarFecha(data.fechaInicio).toLocaleDateString()}` : 'Desfasado'))}}
      </div>
    <div class="h-full" :class="{
      'completed': data.finalizado
    }">
      <div class="relative w-full mb-[12px]">
      <div class="w-full h-[157px] rounded-[6px] overflow-hidden">
        <img :src="data.urlImagen" alt="img-card-competencia">
      </div>
    </div>
    <span class="text-base font-bold text-blue_link pb-[9px] mb-[7px] block border border-gray_50 border-x-0 border-t-0">{{ data.nombreCompetencia }}</span>
    <span class="text-xs mb-[90px] block">
      <p>{{ data.descripcion }}</p>
      <!-- <a v-if="data.link.trim().length" class="underline text-url font-nunito" :href="data.link" target="_blank">{{ data.nameLink }}</a> -->
    </span>
    <div class="w-full absolute bottom-[15px] left-0 pr-[13px] pl-[10px]">
      <BaseButton
			styles="!w-full !bg-blue_light text-white rounded-[6px]"
      v-if="!data.finalizado && stadoFecha === 1"
      @click="() => onDetail(data.nombreCompetencia)"
		>
			Rendir Evaluación
		</BaseButton>
    </div>
    </div>
  </div>
</template>

<style>
 .completed {
  opacity: 0.5;
  filter: grayscale(100%);
  cursor: not-allowed;
 }
</style>
