<script lang="ts" setup>
import { BtnColor } from "~/types/helper.types";
import Opciones from "./opciones.vue";
import Preguntas, { type ResumenPregunta } from "./preguntas.vue";
import TiempoEvaluacion from "./tiempoEvaluacion.vue";
import ModalEstado from "./ModalEstado.vue";

const route = useRoute();

const title = `${route.params.slug}`;
const preguntaRespondida = ref(false);
const respuesta = ref(false);
const currentSelect = ref('');
const showModal = ref(false);

let breadcrumbsItem = [
  { name: "Evaluaciones", current: false, url: "/evaluaciones" },
  { name: title, current: true, url: "" },
];

const onResponse = (option: string) => {
  respuesta.value = true;
  currentSelect.value = option;
}

const guardarRespuesta = () => {
  respuesta.value && (preguntaRespondida.value = true);
}

const resetRespuesta = () => {
  respuesta.value = false;
  preguntaRespondida.value = false;
  currentSelect.value = '';
};

const EvaluacionExpirada = () => {
  showModal.value = true;
}

const onEnd = (resumen: ResumenPregunta) => {
   console.log('resumen', resumen);
}
</script>

<template>
  <BaseLayout :rightAside="false" bgGray>
    <BaseBreadcrumbs :items="breadcrumbsItem" />
    <div class="flex flex-wrap justify-between my-5">
      <div
        class="text-xl font-bold pb-2 border border-gray_50 border-x-0 border-t-0 flex items-center"
      >
        <p>{{ title }}</p>
      </div>

      <TiempoEvaluacion :onExpired="EvaluacionExpirada"/>
    </div>

    <div
      class="bg-white shadow-[0_4px_4px_#8c8c8c40] rounded-[6px] pt-[13px] pr-[29px] pb-[17px] pl-[19px]"
    >
      <div class="w-full flex gap-[25px]">
        <div class="w-full max-w-[562px]">
        <div
          class="w-full text-cyan_80 font-base font-semibold mb-5 font-grotesk"
        >
          TEXTO I:
        </div>
        <div
          class="content-ev overflow-auto h-[425px] max-w-[562px] pr-[37px] font-sm font-light text-justify"
        >
          Había una vez tres cerditos que vivían al aire libre cerca del bosque.
          A menudo se sentían inquietos porque por allí solía pasar un lobo
          malvado y peligroso que amenazaba con comérselos. Un día se pusieron
          de acuerdo en que lo más prudente era que cada uno construyera una
          casa para estar más protegidos. El cerdito más pequeño, que era muy
          vago, decidió que su casa sería de paja. Durante unas horas se dedicó
          a apilar cañitas secas y en un santiamén, construyó su nuevo hogar.
          Satisfecho, se fue a jugar. – ¡Ya no le temo al lobo feroz! – le dijo
          a sus hermanos. El cerdito mediano era un poco más decidido que el
          pequeño, pero tampoco tenía muchas ganas de trabajar. Pensó que una
          casa de madera sería suficiente para estar seguro, así que se internó
          en el bosque y acarreó todos los troncos que pudo para construir las
          paredes y el techo. En un par de días la había terminado y muy
          contento, se fue a charlar con otros animales. akdaoskdaoskdp
          aksodkaspdkaops aksdoaksopdkasopd aksdoaksopdkasopd aksdoaksodsk
          aksodakospd askdoaskdpaksopdaksopd askdaoskdpaoskdopaksopdkas
          aksodkapsdkaopskd aksodkasod aksodkoa askdoaskpdas aksdoakspdas
          askdoaskdpaoks askdoaskdpaksopdaksopdakd ajsdiasjdioasjd
          ajsdioajsoidas asdaskdoas aksdokaso asdkoaskdoa asdkaoskd askdoaskdp
          asdkasodkasp asdkoaskdas aksdoaspkdas ajsdiasjdoias asjdiasjid
          asjdijas asjdaisjdi asdjiasja asjdiasjod asjdiasjd asjdiasjod.
        </div>
      </div>
      <Opciones :onResponse="onResponse" :checkedOption="currentSelect"/>
      </div>
      <div class="w-full flex justify-end mt-[11px]">
      <BaseButton
      :color="BtnColor.blueLight"
      styles="!w-full max-w-[183px] text-white rounded-[6px]"
      :disabled="!respuesta"
      
        @click="guardarRespuesta"
      >
        Guardar respuesta
      </BaseButton>
    </div>
    </div>

    <Preguntas :cantidad="20" :onBack="resetRespuesta" :onNext="resetRespuesta" 
               :preguntaRespondida="preguntaRespondida" :on-end="onEnd"/>
    <ModalEstado :show="showModal" />
  </BaseLayout>
</template>
