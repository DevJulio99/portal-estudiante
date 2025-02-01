import { defineStore } from "pinia";
import type { EstadoCompencia } from "~/types/competencia.types";
import type { Postulante } from "~/types/postulante.types";
import type { DataResponse } from "~/types/services.types";

interface stateEstado {
    data: Postulante | null;
    error: "nodata"| "other"| null;
}

export const usePostulanteStore = defineStore("postulanteStore", {
  state: (): stateEstado => ({
    data: null,
    error: null,
  }),
  actions: {
    setPostulante(data: Postulante) {
      this.data = data;
    },
    setError(err: any) {
      this.error = err;
    },
    // async getEstado(idPostulante: number) {
    //   try {
    //     const estado = await useNuxtApp().$api.estado.getListarEstado(idPostulante); 

    //     if(estado.error.value){
    //         //console.log('ee data', estado.error.)
    //         const bodyError = estado.error.value.data;
    //         throw new Error(bodyError ? "nodata" : "other");
    //     }

    //     this.data = estado.data.value;
    //     this.error = null;

    //   } catch (error : any) {
    //     //console.log('catch', error.message)
    //     this.setError(error.message);
    //   }
    // },
  },
});
