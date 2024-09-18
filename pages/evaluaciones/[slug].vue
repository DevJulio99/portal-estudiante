<script lang="ts" setup>
import { BtnColor } from "~/types/helper.types";
import Opciones from "./opciones.vue";
import Preguntas, { type ResumenPregunta } from "./preguntas.vue";
import TiempoEvaluacion, { type timeEvaluation } from "./tiempoEvaluacion.vue";
import ModalEstado from "./ModalEstado.vue";
import CompletedEvaluation from "./completedEvaluation.vue";
import imgZoom from "@/assets/icons/Icon-flat-search.svg";
import PreviewImage from "./PreviewImage.vue";

const route = useRoute();

const title = `${route.params.slug}`;
const preguntaRespondida = ref(false);
const savedAnswer = ref(false);
const currentSelect = ref("");
const totalQuestions = ref(20);
const summaryEvaluation = ref<ResumenPregunta>({
  currentQuestion: 1,
  pendientes: 0,
  respondidas: 0,
  idsAnswered: []
});
const finishQuestion = ref(false);
const showModal = ref(false);
const finishAllQuestions = ref(false);
const timeData = ref<timeEvaluation>();
const contentQuestion = ref('');
const showPreviewImage = ref({
  status: false,
  url: ''
});
const finalizedBefore = ref(false);
const wasNotSaved = ref(true);
const forceNext = ref(false);
const responsesData = ref<any[]>([]);

let breadcrumbsItem = [
  { name: "Evaluaciones", current: false, url: "/evaluaciones" },
  { name: title, current: true, url: "" },
];

const onResponse = (option: string) => {
  // console.log('option select', option);
  // console.log('summaryEvaluation', summaryEvaluation.value);
  const isRegister = responsesData.value.findIndex((x: any) => x.id === summaryEvaluation.value.currentQuestion);
  if(isRegister < 0) {
    responsesData.value = [...responsesData.value, {id: summaryEvaluation.value.currentQuestion, response: option}]
  }
  if(isRegister >= 0) {
    responsesData.value[isRegister] = {...responsesData.value[isRegister], response: option};
  }
  savedAnswer.value = true;
  currentSelect.value = option;
  wasNotSaved.value = true;
};

const guardarRespuesta = () => {
  savedAnswer.value && (preguntaRespondida.value = true);
  if (totalQuestions.value === summaryEvaluation.value?.currentQuestion) {
    summaryEvaluation.value = {
      ...summaryEvaluation.value,
      respondidas: finalizedBefore.value ? summaryEvaluation.value.respondidas : summaryEvaluation.value.respondidas + 1,
    };
    console.log("fin de la evaluacion", { ...summaryEvaluation.value });
    finishQuestion.value = true;
    finalizedBefore.value = true;
    showModal.value = true;
  }
  wasNotSaved.value = false;
};

const onNextFinish = () => {
  finishQuestion.value = true;
  showModal.value = true;
}

const resetRespuesta = () => {
  savedAnswer.value = false;
  preguntaRespondida.value = false;
  finishQuestion.value = false;
  currentSelect.value = "";
};

const onActionQuestion = (resumen: ResumenPregunta) => {
  resetRespuesta();
  summaryEvaluation.value = resumen;
  forceNext.value = false;
};

const onBack = (resumen: ResumenPregunta) => {
  onActionQuestion(resumen);
}

const onNext = (resumen: ResumenPregunta) => {
  onActionQuestion(resumen);
}

const EvaluacionExpirada = () => {
  wasNotSaved.value = false;
  summaryEvaluation.value.currentQuestion === 1 &&
    (summaryEvaluation.value = {
      currentQuestion: 1,
      pendientes: totalQuestions.value,
      respondidas: 0,
      idsAnswered: []
    });
  showModal.value = true;
};

const OnNextNotSave = () => {
   // console.log('paso sin guardar');
   forceNext.value = true;
   wasNotSaved.value = false;
   showModal.value = false;
}

const onAskNext = () => {
  wasNotSaved.value = true;
  showModal.value = true;
}

onMounted(() => {
 const content = `
<p>              Había una vez tres cerditos que vivían al aire libre cerca del
              bosque. A menudo se sentían inquietos porque por allí solía pasar
              un lobo malvado y peligroso que amenazaba con comérselos. Un día
              se pusieron de acuerdo en que lo más prudente era que cada uno
              construyera una casa para estar más protegidos. El cerdito más
              pequeño, que era muy vago, decidió que su casa sería de paja.
              Durante unas horas se dedicó a apilar cañitas secas y en un
              santiamén, construyó su nuevo hogar. Satisfecho, se fue a jugar. –
              ¡Ya no le temo al lobo feroz! – le dijo a sus hermanos. El cerdito
              mediano era un poco más decidido que el pequeño, pero tampoco
              tenía muchas ganas de trabajar. Pensó que una casa de madera sería
              suficiente para estar seguro, así que se internó en el bosque y
              acarreó todos los troncos que pudo para construir las paredes y el
              techo. En un par de días la había terminado y muy contento, se fue
              a charlar con otros animales. akdaoskdaoskdp aksodkaspdkaops
              aksdoaksopdkasopd aksdoaksopdkasopd aksdoaksodsk aksodakospd
              askdoaskdpaksopdaksopd askdaoskdpaoskdopaksopdkas
              aksodkapsdkaopskd aksodkasod aksodkoa askdoaskpdas aksdoakspdas
              askdoaskdpaoks askdoaskdpaksopdaksopdakd ajsdiasjdioasjd
              ajsdioajsoidas asdaskdoas aksdokaso asdkoaskdoa asdkaoskd
              askdoaskdp asdkasodkasp asdkoaskdas aksdoaspkdas ajsdiasjdoias
              asjdiasjid asjdijas asjdaisjdi asdjiasja asjdiasjod asjdiasjd
              asjdiasjod.
              Where does it come from?
Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.</p>
<br>
<img src="https://concepto.de/wp-content/uploads/2015/03/paisaje-2-e1549600987975.jpg" alt="img-default">
`;
const elementImg = content.match(/<img\s.*?src=(?:'|\")([^'\">]+)(?:'|\").*?\/?>/g);

if(elementImg?.length){
  const text = content.replace(/<img\s.*?src=(?:'|\")([^'\">]+)(?:'|\").*?\/?>/g, `<div id="cont-img" class="relative container-img">
    <div id="zoom-img" class="flex justify-center items-center absolute top-[-15px] right-[-10px] rounded-full w-[28px] h-[28px] bg-[#3A5475]">
      
      <img class="icon-zoom" src="${imgZoom}" alt="img-zoom">
      </div>
    ${elementImg[0]}
    </div>`)
  contentQuestion.value = text;
}

setTimeout(() => {
  const container = document.getElementById('cont-img');

  const allImg = container?.getElementsByTagName('img');
  
  if(allImg?.length){
    for(const img of allImg) {
      if(!img.className.startsWith('icon-zoom')) {
        img.addEventListener('click', (ev: any) => {
          showPreviewImage.value = {
            status: true,
            url: ev.target.src
          }
        })
      }
     
    }
  }
}, 0);
})
</script>

<template>
  <BaseLayout :rightAside="false" bgGray>
    <div v-if="!finishAllQuestions">
      <BaseBreadcrumbs :items="breadcrumbsItem" />
      <div class="flex flex-wrap justify-between my-5">
        <div
          class="text-xl font-bold pb-2 border border-gray_50 border-x-0 border-t-0 flex items-center"
        >
          <p>{{ title }}</p>
        </div>

        <TiempoEvaluacion
          :onExpired="EvaluacionExpirada"
          :stop="finishQuestion"
          :onfinish="(data) => timeData = data"
        />
      </div>

      <div
        class="bg-white shadow-[0_4px_4px_#8c8c8c40] rounded-[6px] pt-[13px] pr-[29px] pb-[17px] pl-[19px]"
      >
        <div class="w-full flex gap-[25px]">
          <div class="w-full">
            <div
              class="w-full text-cyan_80 font-base font-semibold mb-5 font-grotesk"
            >
              TEXTO I:
            </div>
            <div
              class="content-ev overflow-auto h-[425px] pr-[37px] font-sm font-light text-justify"
              v-html="contentQuestion"
            >

            </div>
          </div>
          <Opciones :onResponse="onResponse" :checkedOption="currentSelect" />
        </div>
        <div class="w-full flex justify-end mt-[11px]">
          <BaseButton
            :color="BtnColor.blueLight"
            styles="!w-full max-w-[183px] text-white rounded-[6px]"
            :disabled="!savedAnswer"
            @click="guardarRespuesta"
          >
            Guardar respuesta
          </BaseButton>
        </div>
      </div>

      <Preguntas
        :cantidad="totalQuestions"
        :onBack="onBack"
        :onNext="onNext"
        :preguntaRespondida="preguntaRespondida"
        :finish="finishQuestion"
        :was-not-saved="wasNotSaved"
        :force-next="forceNext"
        :on-ask-next="onAskNext"
        :on-next-finish="onNextFinish"
      />
      <ModalEstado
        :show="showModal"
        :resumen="summaryEvaluation"
        :success="finishQuestion"
        :was-not-saved="wasNotSaved"
        :next-not-save="OnNextNotSave"
        :on-close="
          () => {
            showModal = false;
            finishQuestion = false;
          }
        "
        :finish="() => finishAllQuestions = true"
      />

      <PreviewImage :show="showPreviewImage.status" :url="showPreviewImage.url" :on-close="() => showPreviewImage.status = false"/>
    </div>

    <div class="flex justify-center">
      <CompletedEvaluation v-if="finishAllQuestions" :time="timeData"/>
    </div>
  </BaseLayout>
</template>
