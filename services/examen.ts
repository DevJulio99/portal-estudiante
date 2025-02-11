import type { GenerarExamen } from "~/types/examen.types";
import { getEstados } from "./estadoCompetencia";

export const listarExamen = async () => {
  const { $api } = useNuxtApp();
  const postulanteStore = usePostulanteStore();
  const competenciaStore = useCompetenciaStore();
  const examenStore = useExamenStore();

    const examenService = await $api.examen.listarExamen(
        postulanteStore.data?.idPostulante ?? 0,
        competenciaStore.competenciaSeleccionada?.id_compentencia ?? 0,
      { lazy: true }
    );

    console.log('examenService', examenService)
   
    if (examenService.error.value) {
      console.log('error listar examen')
      // const bodyError = examenService.error.value.data;
      // throw new Error(bodyError ? "nodata" : "other");
    }

    examenService.data.value?.data.length && examenStore.setLista(examenService.data.value.data);
};

export const getExamenes = async () => {
  const { $api } = useNuxtApp();
  const postulanteStore = usePostulanteStore();
  const competenciaStore = useCompetenciaStore();

  try {
    await listarExamen();
  } catch (e: any) {
    if (e.message == "nodata") {
      const request = {
        idCompetencia: competenciaStore.competenciaSeleccionada?.id_compentencia,
        idPostulante: postulanteStore.data?.idPostulante,
        numeroPreguntas: 10,
        idGrado: postulanteStore.data?.idGrado,
        esGrupal: false
      } as GenerarExamen;

      const generarExamen = await $api.examen.generarExamen(
        request,
        { lazy: true }
      );

      if (!generarExamen.error.value) {
        listarExamen();
      }
    }
  }
};

export const generarExamen = async () => {
  const { $api } = useNuxtApp();
  const postulanteStore = usePostulanteStore();
  const competenciaStore = useCompetenciaStore();

  const request = {
    idCompetencia: competenciaStore.competenciaSeleccionada?.id_compentencia,
    idPostulante: postulanteStore.data?.idPostulante,
    numeroPreguntas: 10,
    idGrado: postulanteStore.data?.idGrado,
    esGrupal: false
  } as GenerarExamen;

  console.log('request generar', request)

  const generarExamen = await $api.examen.generarExamen(
    request,
    { lazy: true }
  );

  console.log('generarExamen', generarExamen.data.value)

  if(generarExamen.data.value){
    const idPostulante = postulanteStore.data?.idPostulante;
    const idCompetencia = competenciaStore.competenciaSeleccionada?.id_compentencia;

    (idPostulante && idCompetencia) && getEstados(idPostulante, idCompetencia);
  }

  if (!generarExamen.error.value) {
    listarExamen();
  }
}