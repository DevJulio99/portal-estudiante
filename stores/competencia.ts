import { defineStore } from "pinia";
import type { Competencia } from "~/types/competencia.types";

interface stateEstado {
    listaCompetencia: Competencia[];
    tiempo: number;
    pending: boolean;
    competenciaSeleccionada: Competencia | null;
    llegoAlFinal: boolean;
    finalizoCompetencia: boolean;
}

export const useCompetenciaStore = defineStore("competenciaStore", {
  state: (): stateEstado => ({
    listaCompetencia: [],
    tiempo: 0,
    pending: true,
    competenciaSeleccionada: null,
    llegoAlFinal: false,
    finalizoCompetencia: false
  }),
  actions: {
    setLista(data: Competencia[]) {
      this.listaCompetencia = data;
      this.pending = false;
    },
    setCompetenciaSeleccionada(data: Competencia){
      this.competenciaSeleccionada = data;
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
    resetCompetencia() {
      this.listaCompetencia = [];
      this.pending = true;
      this.tiempo = 0;
      this.competenciaSeleccionada = null;
    },
    async getLista() {
      try {
        const storePostulante = usePostulanteStore();
    
        while (!storePostulante.data?.idPostulante || storePostulante.data.idPostulante === 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
    
        const listaCompetencias = await useNuxtApp().$api.competencias.listarCompetencias(storePostulante.data.idPostulante);
    
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
  },
  getters: {
    competenciaActual: (state) => {
      const storeEstado = useEstadoCompetenciaStore();
      const actual = storeEstado.lista.find(x => x.estado.toLocaleLowerCase() == 'i');
      if(actual){
        const competencia = state.listaCompetencia.find(x => x.id_compentencia = actual.idCompetencia) as Competencia;
        return competencia;
      }
      return null
    }
  }
});
