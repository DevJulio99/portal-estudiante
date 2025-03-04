import { defineStore } from "pinia";
import type { Competencia } from "~/types/competencia.types";

interface stateEstado {
    listaCompetencia: Competencia[];
    pending: boolean;
    competenciaSeleccionada: Competencia | null;
}

export const useResultadoCompetenciaStore = defineStore("resultadoCompetenciaStore", {
  state: (): stateEstado => ({
    listaCompetencia: [],
    pending: true,
    competenciaSeleccionada: null
  }),
  actions: {
    setLista(data: Competencia[]) {
      this.listaCompetencia = data;
      this.pending = false;
    },
    setCompetenciaSeleccionada(data: Competencia){
      console.log('seteando competencia', data);
      this.competenciaSeleccionada = data;
    },
    resetCompetencia() {
      this.listaCompetencia = [];
      this.pending = true;
      this.competenciaSeleccionada = null;
    },
    async getLista() {
      try {
        const storePostulante = usePostulanteStore();
    
        while (!storePostulante.data?.idPostulante || storePostulante.data.idPostulante === 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
    
        const listaCompetencias = await useNuxtApp().$api.competencias.listarCompetenciasFinalizadas(storePostulante.data.idPostulante);
    
        if (listaCompetencias.error.value) {
          const bodyError = listaCompetencias.error.value.data;
          throw new Error(bodyError ? "nodata" : "other");
        }
    
        if (listaCompetencias.data.value?.data.length) {
          this.setLista(listaCompetencias.data.value.data);
        }
    
      } catch (error: any) {
        console.error("Error al obtener competencias:", error.message);
      }
    }    
  }
});
