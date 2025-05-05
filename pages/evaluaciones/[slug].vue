<script lang="ts" setup>
import imgZoom from "@/assets/icons/Icon-flat-search.svg";
import type { ResumenPregunta } from "~/components/pagesContainer/Evaluaciones/preguntas.vue";
import type { timeEvaluation } from "~/components/pagesContainer/Evaluaciones/tiempoEvaluacion.vue";
import TiempoEvaluacion from "~/components/pagesContainer/Evaluaciones/tiempoEvaluacion.vue";
import Preguntas from "~/components/pagesContainer/Evaluaciones/preguntas.vue";
import ModalEstado from "~/components/pagesContainer/Evaluaciones/ModalEstado.vue";
import PreviewImage from "~/components/pagesContainer/Evaluaciones/PreviewImage.vue";
import CompletedEvaluation from "~/components/pagesContainer/Evaluaciones/completedEvaluation.vue";
import Opciones from "~/components/pagesContainer/Evaluaciones/opciones.vue";
import { FinalizarCompetencia, RegistrarEstado } from "~/services/estadoCompetencia";
import type { Competencia } from "~/types/competencia.types";
import { getExamenes } from "~/services/examen";
import InterfazPreguntas from "~/components/pagesContainer/Evaluaciones/interfazPreguntas.vue";

definePageMeta({
  middleware: "auth",
});

const route = useRoute();
const router = useRouter();
const { $api } = useNuxtApp();
// const EstadoCompetenciaStore = useEstadoCompetenciaStore();
// const profileStore = useProfileStore();
const postulanteStore = usePostulanteStore();
const competenciaStore = useCompetenciaStore();
const examenStore = useExamenStore();
const preguntaStore = usePreguntaStore();

const title = `${route.params.slug}`;
const preguntaRespondida = ref(false);
const savedAnswer = ref(false);
const currentSelect = ref("");
const totalQuestions = ref(0);
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
const wasNotSaved = ref(false);
const forceNext = ref(false);
const responsesData = ref<any[]>([]);

const competencia = ref<Competencia | null>();
const tiempoCompetencia = ref<number>(0);
//const opcionSeleccionada = ref<string>('');
const preguntaActualNumero = ref<number>(1);

let breadcrumbsItem = [
  { name: "Evaluaciones", current: false, url: "/evaluaciones" },
  { name: title, current: true, url: "" },
];

const competenciaActual = computed(() => competenciaStore.competenciaSeleccionada)
const preguntaActual = computed(() => examenStore.preguntaActual)
const opcionSeleccionada = computed(() => preguntaStore.opcionSeleccionada)

console.log('postulanteStore.data', postulanteStore.data);
const {data: dataEstados, error: errorEstados} = await $api.estado.getListarEstado(postulanteStore.data?.idPostulante ?? 0,competenciaActual.value?.id_compentencia ?? 0, {lazy: true,})


watch(dataEstados, (estados)  => {
  if(estados?.data.length){
    console.log('estados', estados);
    getExamenes();
  }
});

const unWatchEstado = watch(errorEstados, async(err: any)  => {
  if(err?.data?.success == false){
    console.log('err', err?.data)
    await RegistrarEstado(postulanteStore.data?.idPostulante ?? 0, competenciaStore.competenciaSeleccionada?.id_compentencia ?? 0);
    unWatchEstado();
  }
});

watch(() => examenStore.lista, (examenes)  => {
  if(examenes.length){
    console.log('examenes', examenes);
    totalQuestions.value = examenes.length;
    preguntaStore.totalPreguntas = examenes.length;
    examenStore.setpreguntaActual();
  }
});

const numeroEnGrupo = computed(() => {
  if (!preguntaActual.value?.preguntas.grupo) return null;

  const grupo = preguntaActual.value?.preguntas.grupo;
  const preguntasGrupo = examenStore.lista.filter(
    (e) => e.preguntas.grupo === grupo
  );
  return preguntasGrupo.findIndex(
    (p) => p.examenGenerado.idPregunta === preguntaActual.value?.examenGenerado.idPregunta
  ) + 1;
});

const totalPreguntasGrupo = computed(() => {
  if (!preguntaActual.value?.preguntas.grupo) return null;

  const grupo = preguntaActual.value?.preguntas.grupo;
  return examenStore.lista.filter((e) => e.preguntas.grupo === grupo).length;
});

// const unWatch = watch(error, (err: any)  => {
//   console.log('err', err?.data)
//   if(!err?.data?.success){
//     generarExamen();
//     unWatch();
//   }
// });

// watch(() => competenciaStore.listaCompetencia, (lista)  => {
//   if(lista.length){
//     console.log('competencias', lista);
//     const primeraCompetencia = lista[0];
//     postulanteStore.data?.idPostulante && getEstados(postulanteStore.data.idPostulante, primeraCompetencia.id_compentencia)//EstadoCompetenciaStore.getEstado(postulanteStore.data.idPostulante);
//   }
// });

// watch(() => EstadoCompetenciaStore.lista, (lista)  => {
//   if(lista.length){
//     console.log('estados de la competancia', lista);
//   }
// });


const onResponse = (id: string, option: string) => {
  // console.log('option select', option);
  // console.log('summaryEvaluation', summaryEvaluation.value);
  // const isRegister = responsesData.value.findIndex((x: any) => x.id === summaryEvaluation.value.currentQuestion);
  // if(isRegister < 0) {
  //   responsesData.value = [...responsesData.value, {id: summaryEvaluation.value.currentQuestion, response: option}]
  // }
  // if(isRegister >= 0) {
  //   responsesData.value[isRegister] = {...responsesData.value[isRegister], response: option};
  // }
  preguntaStore.setOpcionSeleccionada(option)
  //opcionSeleccionada.value = option;
  savedAnswer.value = true;
  // currentSelect.value = option;
  // wasNotSaved.value = true;
};

const guardarRespuesta = () => {
  savedAnswer.value && (preguntaRespondida.value = true);
  wasNotSaved.value = false;
  const data = {
    numeroPregunta: preguntaActual.value?.preguntas.numeroPregunta ?? 0,
    respuestaSeleccionada: opcionSeleccionada.value
  }
  data.respuestaSeleccionada.trim().length && examenStore.setBancoRespuesta(data);
  // console.log('responsesData', responsesData.value)
};

const ultimaPregunta = () => {
  summaryEvaluation.value = {
      ...summaryEvaluation.value,
      currentQuestion: totalQuestions.value,
      respondidas: finalizedBefore.value ? summaryEvaluation.value.respondidas : summaryEvaluation.value.respondidas + 1,
    };
    console.log("fin de la evaluacion", { ...summaryEvaluation.value });
    
    finishQuestion.value = true;
    finalizedBefore.value = true;
    preguntaStore.setResumenActivo(true);
    if(opcionSeleccionada.value.trim().length){
      const data = {
       numeroPregunta: totalQuestions.value,
       respuestaSeleccionada: opcionSeleccionada.value
      }
      examenStore.setBancoRespuesta(data);
      examenStore.setpreguntaActual(totalQuestions.value);
      //opcionSeleccionada.value = '';
      preguntaStore.setOpcionSeleccionada('');
    }
}

const getValueOption = () => {
  const question = responsesData.value.find(x => x.id === summaryEvaluation.value.currentQuestion);
  return  question ?? ""
}

const onNextFinish = () => {
  finishQuestion.value = true;
  preguntaStore.setResumenActivo(true);
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
  opcionSeleccionada.value.trim().length && guardarRespuesta();
  onActionQuestion(resumen);
  //opcionSeleccionada.value = '';
  preguntaStore.setOpcionSeleccionada('');
  examenStore.setpreguntaActual(resumen.currentQuestion);
}

const onSelectPage = (page: number) => {
  //opcionSeleccionada.value = '';
  preguntaStore.setOpcionSeleccionada('')
  //examenStore.setpreguntaActual(page);
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
    preguntaStore.setResumenActivo(true);
  !competenciaStore.finalizoCompetencia && FinalizarCompetencia(false);
  setTimeout(() => {
    router.push('/evaluaciones');
  }, 3000);
};

const OnNextNotSave = () => {
   // console.log('paso sin guardar');
   forceNext.value = true;
   wasNotSaved.value = false;
   preguntaStore.setResumenActivo(false);
}

const onAskNext = () => {
  //wasNotSaved.value = false;
  //showModal.value = true;
}

const finalizarCompetencia = () => {
  //finishAllQuestions = true
  !competenciaStore.finalizoCompetencia && FinalizarCompetencia();
  preguntaStore.setResumenActivo(false);
}

onMounted(() => {
  if(competenciaActual.value){
    competencia.value = competenciaActual.value;
    competenciaStore.setTiempoCompetencia(competenciaActual.value);
    //getExamenes();
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

onBeforeUnmount(() => {
  postulanteStore.setHabilitado(0);
  competenciaStore.resetCompetencia();
  preguntaStore.setPregunta(1);
  preguntaStore.setResumenActivo(false);
});

const imagenCargada = ref(false);
const imagenUrl = ref("");

const cargarImagen = async (url:any) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("No se pudo cargar la imagen");

    const blob = await response.blob();
    imagenUrl.value = URL.createObjectURL(blob);
    imagenCargada.value = true;
  } catch (error) {
    console.error("Error cargando la imagen:", error);
  }
};

watch(() => preguntaActual?.value?.preguntas.textoImagen, (newUrl) => {
  if (newUrl) {
    imagenCargada.value = false;
    cargarImagen(newUrl);
  }
}, { immediate: true });

</script>

<template>
  <BaseLayout :rightAside="false" bgGray>
    <div v-if="examenStore.pending" class="text-xs text-black py-16">
			<BaseStatusLoading />
		</div>
    <div v-else-if="!competenciaStore.finalizoCompetencia" class="mb-[84px]">
      <BaseBreadcrumbs :items="breadcrumbsItem" />
      <div class="flex-col-reverse lg:flex-row gap-2 lg:gap-0 flex flex-wrap justify-between my-5">
        <div
          class="w-full text-center lg:text-start lg:w-auto text-xl font-bold pb-2 border border-gray_50 border-x-0 border-t-0 flex items-center"
        >
          <p>Evaluación de {{ preguntaActual?.preguntas.tipoEvaluacion }}</p>
        </div>

        <TiempoEvaluacion
          customClass="w-full flex justify-center lg:w-fit"
          :onExpired="EvaluacionExpirada"
          :stop="finishQuestion"
          :onfinish="(data) => timeData = data"
          :init="true"
        />
      </div>

      <div

        class="relative bg-white shadow-[0_4px_4px_#8c8c8c40] rounded-[6px] pt-[13px] pr-[29px] pb-[17px] pl-[19px]"
      >
        <div class="w-full flex flex-wrap lg:flex-nowrap gap-[25px]">
          <div class="w-full">
            <div
              class="w-full text-cyan_80 font-base font-semibold mb-5 font-grotesk"
            >
              {{ preguntaActual?.preguntas.textoTitulo }}
            </div>
            <div
              class="content-ev overflow-auto h-auto lg:h-[425px] lg:pr-[37px] font-sm font-light text-justify"
            >
              <div>{{preguntaActual?.preguntas.textoSuperior}}</div>
              
              <div v-if="preguntaActual?.preguntas.textoImagen" class="flex justify-center">
                <img
                  v-if="imagenCargada"
                  :src="imagenUrl"
                  alt="Imagen pregunta"
                  class="w-[60%] py-4"
                />
                <BaseStatusLoading v-else></BaseStatusLoading>
              </div>
              
              <div v-html="preguntaActual?.preguntas.textoInferior"></div>
            </div>
          </div>
          <Opciones
            :onResponse="onResponse"
            :checkedOption="getValueOption().response"
            :pregunta="preguntaActual?.preguntas"
            :numeroEnGrupo="numeroEnGrupo"
            :totalPreguntasGrupo="totalPreguntasGrupo"
          />
          <InterfazPreguntas />
        </div>
        <!-- <div class="w-full flex justify-end mt-[11px]">
          <BaseButton
            :color="BtnColor.blueLight"
            styles="!w-full max-w-[183px] text-white rounded-[6px]"
            :disabled="!savedAnswer"
            @click="guardarRespuesta"
          >
            Guardar respuesta
          </BaseButton>
        </div> -->
      </div>


      <ModalEstado
        :show="preguntaStore.resumenActivo"
        :resumen="summaryEvaluation"
        :success="finishQuestion"
        :was-not-saved="wasNotSaved"
        :next-not-save="OnNextNotSave"
        :on-close="
          () => {
            preguntaStore.setResumenActivo(false);
            finishQuestion = false;
          }
        "
        :finish="finalizarCompetencia"
      />

      <PreviewImage :show="showPreviewImage.status" :url="showPreviewImage.url" :on-close="() => showPreviewImage.status = false"/>
    </div>

    <div class="flex justify-center">
      <CompletedEvaluation v-if="competenciaStore.finalizoCompetencia" :time="timeData"/>
    </div>

    <Preguntas
        v-if="!competenciaStore.finalizoCompetencia"
        :cantidad="totalQuestions"
        :onBack="onBack"
        :onNext="onNext"
        :preguntaRespondida="preguntaRespondida"
        :finish="finishQuestion"
        :was-not-saved="wasNotSaved"
        :force-next="forceNext"
        :on-ask-next="onAskNext"
        :on-next-finish="onNextFinish"
        :on-last-question="ultimaPregunta"
        :on-select-page="onSelectPage"

      />
  </BaseLayout>
</template>
