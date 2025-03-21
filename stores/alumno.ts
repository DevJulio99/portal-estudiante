import { defineStore } from 'pinia';
import type { Alumno, Paginado } from '~/types/alumno.types';
import type { RegistrarAlumno, ActualizarAlumno, FiltroAlumno } from '~/types/alumno.types';

interface errorAlumno {
	status: boolean;
	message: string;
}

interface ErrorCampo {
	[key: string]: string
}

interface alumnoStoreStatus {
    lista: Alumno[];
	pending: boolean;
	pendingTable: boolean;
	error: errorAlumno;
	paginado: Paginado;
	total: number;
	activeList: boolean;
	activeFilter: boolean;
	errorForm: string[];
	tipoModal: 'success' | 'error';
	msgError: ErrorCampo | null;
}
export const useAlumnoStore = defineStore('alumnoStore', {
	state: (): alumnoStoreStatus => ({
		lista: [],
		pending: true,
		pendingTable: false,
		error: {
			status: false,
			message: ''
		},
		paginado: {
			pagina : 1,
			itemsPorPagina: 2
		},
		total: 0,
		activeList: true,
		activeFilter: false,
		errorForm: [],
		tipoModal: 'success',
		msgError: null
	}),
	actions: {
		setLista(data: Alumno[]){
           this.lista = data;
        },
		setErrorForm(data: string[]){
			this.errorForm = data;
			if(data.length) this.tipoModal = 'error';
		},
		setError(status: boolean, message: string){
            this.error = { status, message };
			if(status) this.tipoModal = 'error';
		},
		setPagina(pagina: number){
           this.paginado.pagina = pagina;
		},
		resetAlumnos() {
           this.lista = [];
		   this.pending = true;
		   this.error = {
			status: false,
			message: ''
		   }
		   this.errorForm = [];
		},
		async getAlumnos(){
			const tokenStore = useTokenStore();
			const { $api } = useNuxtApp();
			this.activeList = true;
            this.pendingTable = true;
			this.lista = [];
			const request = {
				codigoSede: tokenStore.getDataToken.Codigo_Sede,
				...this.paginado
			}

            const listaAlumnos = await $api.alumno.getAlumnoPorSede(request);

			if(!listaAlumnos.error.value && listaAlumnos.data.value?.data.length){
				this.pendingTable = false;
				this.setLista(listaAlumnos.data.value.data);
				if(this.activeFilter){
					this.total = listaAlumnos.data.value.data[0].total;
					this.activeFilter = false;
				}
				if(this.total == 0 && !this.activeFilter){
					this.total = listaAlumnos.data.value.data[0].total;
				}

				if(this.total > 0 && this.activeList){
					this.total = listaAlumnos.data.value.data[0].total;
				}
			}

			if(listaAlumnos.error.value){
				this.tipoModal = 'error';
				this.pendingTable = false;
				this.lista = [];
				if(listaAlumnos.error.value.statusCode !== 404){
					const errorPopupStore = useErrorPopUpStore();
					errorPopupStore.tipoModal = 'error';
					errorPopupStore.setError(true, (listaAlumnos.error.value.data as any).message)
					// this.error = {
					// 	status: true,
					// 	message: (listaAlumnos.error.value.data as any).message
					// };

				}
			}
			this.pending = false;
		},
		async RegistrarAlumno(request: RegistrarAlumno) {
			const { $api } = useNuxtApp();
			const errorPopupStore = useErrorPopUpStore();
			// this.error = {
			// 	status: false,
			// 	message: ''
			// };
			errorPopupStore.setError(false, '')
			this.paginado.pagina = 1;
			this.activeFilter = false;
			this.activeList = true;
			const registrarAlumnos = await $api.alumno.registrarAlumno(request);

			if(!registrarAlumnos.error.value){
				//this.tipoModal = 'success';
				errorPopupStore.tipoModal = 'success';
				// this.error = {
				// 	status: true,
				// 	message: 'Se registro Correctamente'
				// };
				errorPopupStore.setError(true, 'Se registro Correctamente')
				this.pending = true;
				this.lista = [];
				this.getAlumnos()
			}

			if(registrarAlumnos.error.value){
				// this.tipoModal = 'error';
				// this.error = {
				// 	status: true,
				// 	message: (registrarAlumnos.error.value.data as any).message
				// };
				errorPopupStore.tipoModal = 'error';
				errorPopupStore.setError(true, (registrarAlumnos.error.value.data as any).message)
			}
		},
		async ActualizarAlumno(request: ActualizarAlumno) {
			const { $api } = useNuxtApp();
			const errorPopupStore = useErrorPopUpStore();
			// this.error = {
			// 	status: false,
			// 	message: ''
			// };
			errorPopupStore.setError(false, '')
			this.paginado.pagina = 1;
			this.activeFilter = false;
			this.activeList = true;
			const actualizarAlumnos = await $api.alumno.actualizarAlumno(request);

			if(!actualizarAlumnos.error.value){
				// this.tipoModal = 'success';
				// this.error = {
				// 	status: true,
				// 	message: 'Se actualizo Correctamente'
				// };
				errorPopupStore.tipoModal = 'success';
				errorPopupStore.setError(true, 'Se actualizo Correctamente')
				this.pending = true;
				this.lista = [];
				this.getAlumnos()
			}

			if(actualizarAlumnos.error.value){
				// this.tipoModal = 'error';
				// this.error = {
				// 	status: true,
				// 	message: (actualizarAlumnos.error.value.data as any).message
				// };
				errorPopupStore.tipoModal = 'error';
				errorPopupStore.setError(true, (actualizarAlumnos.error.value.data as any).message)
			}
		},
		async EliminarAlumno(numeroDocumento: string) {
			const { $api } = useNuxtApp();
			const errorPopupStore = useErrorPopUpStore();
			// this.error = {
			// 	status: false,
			// 	message: ''
			// };
			errorPopupStore.setError(false, '')
			this.paginado.pagina = 1;
			this.activeFilter = false;
			this.activeList = true;
			const eliminarAlumnos = await $api.alumno.eliminarAlumno(numeroDocumento);

			if(!eliminarAlumnos.error.value){
				// this.tipoModal = 'success';
				// this.error = {
				// 	status: true,
				// 	message: 'Se elimino Correctamente'
				// };
				errorPopupStore.tipoModal = 'success';
				errorPopupStore.setError(true, 'Se elimino Correctamente')
				this.pending = true;
				this.lista = [];
				this.getAlumnos()
			}

			if(eliminarAlumnos.error.value){
				// this.tipoModal = 'error';
				// this.error = {
				// 	status: true,
				// 	message: (eliminarAlumnos.error.value.data as any).message
				// };
				errorPopupStore.tipoModal = 'error';
				errorPopupStore.setError(true, (eliminarAlumnos.error.value.data as any).message)
			}
		},
		async FiltrarAlumno(value: string) {
			const { $api } = useNuxtApp();
			const tokenStore = useTokenStore();
			const errorPopupStore = useErrorPopUpStore();
			this.pendingTable = true;
			this.lista = [];
			this.activeFilter = true;

			const request = {
				codigoSede: tokenStore.getDataToken.Codigo_Sede,
				filtro: value,
				pagina: this.paginado.pagina,
				itemsPorPagina: this.paginado.itemsPorPagina,
			}

			const filtroAlumnos = await $api.alumno.filtrarAlumno(request);

			if(!filtroAlumnos.error.value && filtroAlumnos.data.value?.data){
				this.pendingTable = false;
				this.lista = filtroAlumnos.data.value.data;
				if(this.activeList){
					this.total = filtroAlumnos.data.value.data[0].total;
					this.activeList = false;
				}
				if(this.total == 0 && !this.activeList){
					this.total = filtroAlumnos.data.value.data[0].total;
				}

				if(this.total >0 && this.activeFilter){
					this.total = filtroAlumnos.data.value.data[0].total;
				}
			}
			//console.log('filtroAlumnos',filtroAlumnos)
			if(filtroAlumnos.error.value){
				//this.tipoModal = 'error';
				this.pendingTable = false;
				this.lista = [];
				if(filtroAlumnos.error.value.statusCode !== 404){
					// this.error = {
					// 	status: true,
					// 	message: (filtroAlumnos.error.value.data as any).message
					// };
				    errorPopupStore.tipoModal = 'error';
				    errorPopupStore.setError(true, (filtroAlumnos.error.value.data as any).message)
				}
			}
		},	
	},
});
