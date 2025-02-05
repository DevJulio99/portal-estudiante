import type { GenerarExamen } from "~/types/examen.types";

export const listarExamen = async () => {
  const { $api } = useNuxtApp();
  const postulanteStore = usePostulanteStore();
  const competenciaStore = useCompetenciaStore();
  const examenStore = useExamenStore();

    const examenService = await $api.examen.listarExamen(
        postulanteStore.data?.idPostulante ?? 0,
        competenciaStore.competenciaActual?.id_compentencia ?? 0,
      { lazy: true }
    );
   
    if (examenService.error.value) {
      const bodyError = examenService.error.value.data;
      throw new Error(bodyError ? "nodata" : "other");
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
        idCompetencia: competenciaStore.competenciaActual?.id_compentencia,
        idPostulante: postulanteStore.data?.idPostulante,
        numeroPreguntas: 10
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
