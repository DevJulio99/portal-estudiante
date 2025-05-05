import { defineStore } from 'pinia';
export const usePreguntaStore = defineStore('preguntaStore', {
	state: () => ({
        totalPreguntas: 0,
        respuestasPendientes : [] as number[],
		preguntaActual: 1,
        opcionSeleccionada: '',
		resumenActivo: false
	}),
	actions: {
        setTotalPreguntas(total: number) {
			this.totalPreguntas = total
		},
		setPregunta(pregunta: number) {
			this.preguntaActual = pregunta;
		},
        setRespuestasPendientes(pregunta: number) {
			if(!this.respuestasPendientes.includes(pregunta)) this.respuestasPendientes.push(pregunta);
		},
        setOpcionSeleccionada(opcion: string){
            this.opcionSeleccionada = opcion;
        },
		setResumenActivo(activo: boolean){
            this.resumenActivo = activo;
		}
	},
});
