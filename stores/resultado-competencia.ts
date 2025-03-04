import { defineStore } from "pinia";
import type { Competencia, ResultadoEvaluacion } from "~/types/competencia.types";

interface stateEstado {
    listaCompetencia: Competencia[];
    pending: boolean;
    competenciaSeleccionada: Competencia | null;
    listaResultados: ResultadoEvaluacion[];
}

export const useResultadoCompetenciaStore = defineStore("resultadoCompetenciaStore", {
  state: (): stateEstado => ({
    listaCompetencia: [],
    pending: true,
    competenciaSeleccionada: null,
    listaResultados: []
  }),
  actions: {
    setLista(data: Competencia[]) {
      this.listaCompetencia = data;
      this.pending = false;
    },
    setResultados(data: ResultadoEvaluacion[]){
      this.listaResultados= data;
    },
    setCompetenciaSeleccionada(data: Competencia){
      console.log('seteando competencia', data);
      this.competenciaSeleccionada = data;
    },
    resetCompetencia() {
      this.listaCompetencia = [];
      this.pending = true;
      this.competenciaSeleccionada = null;
      this.listaResultados= [];
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
          if(listaCompetencias.error.value.statusCode = 404){
             this.pending = false;
          }
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
