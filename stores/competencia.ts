import { defineStore } from "pinia";
import type { Competencia } from "~/types/competencia.types";

interface stateEstado {
    listaCompetencia: Competencia[];
    competenciaActual: Competencia | null;
}

export const useCompetenciaStore = defineStore("competenciaStore", {
  state: (): stateEstado => ({
    listaCompetencia: [],
    competenciaActual: null
  }),
  actions: {
    setLista(data: Competencia[]) {
      this.listaCompetencia = data;
    },
    setCompetenciaActual(data: Competencia) {
        this.competenciaActual = data;
    },
    async getLista() {
      try {
        const listaCompetencias = await useNuxtApp().$api.competencias.listarCompetencias(); 

        if(listaCompetencias.error.value){
            //console.log('ee data', estado.error.)
            const bodyError = listaCompetencias.error.value.data;
            throw new Error(bodyError ? "nodata" : "other");
        }

        listaCompetencias.data.value?.data.length && (this.listaCompetencia = listaCompetencias.data.value.data);

      } catch (error : any) {
        //console.log('catch', error.message)
        
      }
    },
  },
});
