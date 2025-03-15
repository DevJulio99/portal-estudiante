import { defineStore } from "pinia";
import type { BancoRespuesta, Examen, Respuesta } from "~/types/examen.types";

interface stateEstado {
    lista: Examen[];
    preguntaActual: Examen | null;
    respuestaSeleccionada: string | null;
    bancoRespuestas: BancoRespuesta[];
    error: "nodata"| "other"| null;
    guardadoPendiente: Boolean;
    pending: boolean;
}

export const useExamenStore = defineStore("examen", {
  state: (): stateEstado => ({
    lista: [],
    preguntaActual: null,
    respuestaSeleccionada: null,
    bancoRespuestas: [],
    error: null,
    guardadoPendiente: false,
    pending: true
  }),
  actions: {
    resetExamen() {
      this.lista = [];
      this.preguntaActual = null;
      this.respuestaSeleccionada = null;
      this.bancoRespuestas = [];
      this.error = null;
      this.guardadoPendiente = false;
      this.pending = true;
    },
    setError(err: any) {
      this.error = err;
    },
    setLista(lista: Examen[]) {
      this.lista = lista;
    },
    setpreguntaActual(pagina?: number){
      const pagina_ = pagina ?? 1;
      const pregunta = this.lista.find(x => x.preguntas.numeroPregunta == pagina_) ?? null;
      const preguntaGrupo = this.lista.find(x => x.preguntas.grupo === pregunta?.preguntas.grupo 
        && (x.preguntas.textoSuperior.trim().length || x.preguntas.textoInferior.trim().length));
     
      if(pregunta && pregunta?.preguntas.grupo === preguntaGrupo?.preguntas.grupo && preguntaGrupo){
        this.preguntaActual = {
          preguntas: {
            ...pregunta.preguntas,
            textoSuperior: preguntaGrupo.preguntas.textoSuperior,
            textoInferior: preguntaGrupo.preguntas.textoInferior
          },
          examenGenerado : { ...pregunta.examenGenerado },
          nombreCompetencia: pregunta.nombreCompetencia
        };
      }else {
        this.preguntaActual = pregunta;
      }
      
      //console.log('preguntaActual', this.preguntaActual)
      this.respuestaSeleccionada = null;
      if(this.bancoRespuestas.length){
         const respuesta = this.bancoRespuestas.findIndex(x => x.numeroPregunta === pregunta?.preguntas.numeroPregunta);
         if(respuesta >= 0){
          pregunta && this.setRespuestaRespondida(this.bancoRespuestas[respuesta].respuestaSeleccionada)
         } else {
          pregunta?.examenGenerado.respuestaSeleccionada && this.setRespuestaRespondida(pregunta.examenGenerado.respuestaSeleccionada)
         }
      } else {
        pregunta?.examenGenerado.respuestaSeleccionada && this.setRespuestaRespondida(pregunta.examenGenerado.respuestaSeleccionada)
      }
    },
    setRespuestaRespondida(opcion: string){
      this.respuestaSeleccionada = opcion;
    },
    async setBancoRespuesta(opcion: BancoRespuesta){
      const repeat = this.bancoRespuestas.findIndex(x => x.numeroPregunta == opcion.numeroPregunta);
      if(repeat >= 0){
        this.bancoRespuestas.splice(repeat, 1 , opcion);
      }
      if(repeat < 0){
        this.bancoRespuestas = this.bancoRespuestas.concat(opcion);
      }
      if(this.preguntaActual){
        this.guardadoPendiente = true;
        const request = {
          idPostulante: this.preguntaActual.examenGenerado.idPostulante,
          idPregunta: this.preguntaActual.examenGenerado.idPregunta,
          respuestSeleccionada: opcion.respuestaSeleccionada
        }
        await useNuxtApp().$api.examen.actualizarRespuesta(request);
        this.guardadoPendiente = false;
      }
    }
  },
  getters: {
    listaPreguntas: (state) => {
      const preguntaActual = state.preguntaActual;
      let preguntas: Respuesta[] = [];
      if(preguntaActual){
        const arregloPreguntas = Object.entries(preguntaActual.preguntas);
        for(const arreglo of arregloPreguntas){
          if(arreglo[0].startsWith('opcion')){
            const opcion = arreglo[0].replace(/opcion/g,'');
            preguntas.push({
              descripcion: arreglo[1] as string,
              opcion
            })
          }
        }
      }
      return preguntas
    },
    preguntasRespondidas: (state) => {
      const preguntas = state.lista.filter(x => x.examenGenerado.respuestaSeleccionada.trim().length && 
      (x.examenGenerado.respuestaSeleccionada.toLocaleLowerCase() === 'a' || 
      x.examenGenerado.respuestaSeleccionada.toLocaleLowerCase() === 'b' ||
      x.examenGenerado.respuestaSeleccionada.toLocaleLowerCase() === 'c' || 
      x.examenGenerado.respuestaSeleccionada.toLocaleLowerCase() === 'd'))

      return [...new Set(preguntas.map(x => x.preguntas.numeroPregunta).concat(state.bancoRespuestas.map(x => x.numeroPregunta)))]
    }
  }
});
