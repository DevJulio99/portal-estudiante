import { defineStore } from "pinia";
import type { Competencia } from "~/types/competencia.types";

interface stateEstado {
    listaCompetencia: Competencia[];
    tiempo: number;
}

export const useCompetenciaStore = defineStore("competenciaStore", {
  state: (): stateEstado => ({
    listaCompetencia: [],
    tiempo: 0
  }),
  actions: {
    setLista(data: Competencia[]) {
      this.listaCompetencia = data;
    },
    setTiempoCompetencia(data: Competencia) {
      if(data.tiempoLimite){
        const fechaActual = new Date();
        const [hora, minuto, segundos] = data.tiempoLimite.split(':');
        fechaActual.setHours(fechaActual.getHours() + parseInt(hora));
        fechaActual.setMinutes(fechaActual.getMinutes() + parseInt(minuto));
        fechaActual.setSeconds(fechaActual.getSeconds() + parseInt(segundos));

        this.tiempo = fechaActual.getTime();
      }
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
  getters: {
    competenciaActual(){
      const storeEstado = useEstadoCompetenciaStore();
      const actual = storeEstado.lista.find(x => x.estado.toLocaleLowerCase() == 'i');
      if(actual){
        const competencia = this.listaCompetencia.find(x => x.id_compentencia = actual.idCompetencia) as Competencia;
        return competencia;
      }
      return null
    }
  }
});
