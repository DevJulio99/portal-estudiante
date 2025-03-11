import { defineStore } from 'pinia';
import type { Alumno } from '~/types/alumno.types';
import type { RegistrarAlumno, ActualizarAlumno } from '~/types/alumno.types';

interface errorAlumno {
	status: boolean;
	message: string;
}

interface alumnoStoreStatus {
    lista: Alumno[];
	pending: boolean;
	error: errorAlumno;
}
export const useAlumnoStore = defineStore('alumnoStore', {
	state: (): alumnoStoreStatus => ({
		lista: [],
		pending: true,
		error: {
			status: false,
			message: ''
		}
	}),
	actions: {
		setLista(data: Alumno[]){
           this.lista = data;
        },
		resetAlumnos() {
           this.lista = [];
		   this.pending = true;
		   this.error = {
			status: false,
			message: ''
		   }
		},
		async getAlumnos(){
			const tokenStore = useTokenStore();
			const { $api } = useNuxtApp();

            const listaAlumnos = await $api.alumno.getAlumnoPorSede(tokenStore.getDataToken.Codigo_Sede);

			if(!listaAlumnos.error.value && listaAlumnos.data.value?.data.length){
				this.setLista(listaAlumnos.data.value.data);
			}
			this.pending = false;
		},
		async RegistrarAlumno(request: RegistrarAlumno) {
			const { $api } = useNuxtApp();
			this.error = {
				status: false,
				message: ''
			};
			const registrarAlumnos = await $api.alumno.registrarAlumno(request);

			if(!registrarAlumnos.error.value){
				this.pending = true;
				this.lista = [];
				this.getAlumnos()
			}

			if(registrarAlumnos.error.value){
				this.error = {
					status: true,
					message: (registrarAlumnos.error.value.data as any).message
				};
			}
		},
		async ActualizarAlumno(request: ActualizarAlumno) {
			const { $api } = useNuxtApp();
			this.error = {
				status: false,
				message: ''
			};
			const actualizarAlumnos = await $api.alumno.actualizarAlumno(request);

			if(!actualizarAlumnos.error.value){
				this.pending = true;
				this.lista = [];
				this.getAlumnos()
			}

			if(actualizarAlumnos.error.value){
				this.error = {
					status: true,
					message: (actualizarAlumnos.error.value.data as any).message
				};
			}
		},
		async EliminarAlumno(numeroDocumento: string) {
			const { $api } = useNuxtApp();
			this.error = {
				status: false,
				message: ''
			};
			const eliminarAlumnos = await $api.alumno.eliminarAlumno(numeroDocumento);

			if(!eliminarAlumnos.error.value){
				this.pending = true;
				this.lista = [];
				this.getAlumnos()
			}

			if(eliminarAlumnos.error.value){
				this.error = {
					status: true,
					message: (eliminarAlumnos.error.value.data as any).message

				};
			}
		}	
	},
});
