import { defineStore } from "pinia";
import type { EstadoCompencia } from "~/types/competencia.types";
import type { DataResponse } from "~/types/services.types";

interface stateEstado {
    data: DataResponse<EstadoCompencia[]> | null;
    lista: EstadoCompencia[];
    error: "nodata"| "other"| null;
}

export const useEstadoCompetenciaStore = defineStore("estadoCompetencia", {
  state: (): stateEstado => ({
    data: null,
    lista: [],
    error: null,
  }),
  actions: {
    setData(data: DataResponse<EstadoCompencia[]>) {
      this.data = data;
    },
    setError(err: any) {
      this.error = err;
    },
    setLista(lista: EstadoCompencia[]) {
      this.lista = lista;
    },
    async getEstado(idPostulante: number) {
      try {
        const estado = await useNuxtApp().$api.estado.getListarEstado(idPostulante); 

        if(estado.error.value){
            //console.log('ee data', estado.error.)
            const bodyError = estado.error.value.data;
            throw new Error(bodyError ? "nodata" : "other");
        }

        this.data = estado.data.value;
        this.error = null;

      } catch (error : any) {
        //console.log('catch', error.message)
        this.setError(error.message);
      }
    },
  },
});
