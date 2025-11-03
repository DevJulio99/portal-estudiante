import { defineStore } from 'pinia';
import type { Alumno, Paginado } from '~/types/alumno.types';
import type { RegistrarAlumno, ActualizarAlumno } from '~/types/alumno.types';
import { useMsgPopUpStore } from './msgPopup';

interface ErrorCampo {
	[key: string]: string
}

interface alumnoStoreStatus {
    lista: Alumno[];
	pending: boolean;
	pendingTable: boolean;
	paginado: Paginado;
	total: number;
	activeList: boolean;
	activeFilter: boolean;
	errorForm: string[];
	msgError: ErrorCampo | null;
}
export const useAlumnoStore = defineStore('alumnoStore', {
	state: (): alumnoStoreStatus => ({
		lista: [],
		pending: true,
		pendingTable: false,
		paginado: {
			pagina : 1,
			itemsPorPagina: 2
		},
		total: 0,
		activeList: true,
		activeFilter: false,
		errorForm: [],
		msgError: null
	}),
	actions: {
		setLista(data: Alumno[]){
           this.lista = data;
        },
		setErrorForm(data: string[]){
			const msgPopupStore = useMsgPopUpStore();
			this.errorForm = data;
			if(data.length) msgPopupStore.showError('Formulario inválido');
		},
		setPagina(pagina: number){
           this.paginado.pagina = pagina;
		},
		resetAlumnos() {
           this.lista = [];
		   this.pending = true;
		   this.errorForm = [];
		   this.pendingTable = false;
		   this.activeList = true;
		   this.activeFilter = false;
		   this.total = 0;
		   this.errorForm = [];
		   this.msgError = null;
		   this.paginado = {
			pagina : 1,
			itemsPorPagina: 2
		   }
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
				this.pendingTable = false;
				this.lista = [];
				if(listaAlumnos.error.value.statusCode !== 404){
					const msgPopupStore = useMsgPopUpStore();
					msgPopupStore.showError((listaAlumnos.error.value.data as any).message)
				}
			}
			this.pending = false;
		},
		async RegistrarAlumno(request: RegistrarAlumno) {
			const { $api } = useNuxtApp();
			const msgPopupStore = useMsgPopUpStore();
			this.pending = true;
			this.paginado.pagina = 1;
			this.activeFilter = false;
			this.activeList = true;
			try {
				const registrarAlumnos = await $api.alumno.registrarAlumno(request);
	
				if(!registrarAlumnos.error.value){
					msgPopupStore.showSuccess('Se registro Correctamente')
					this.lista = [];
					await this.getAlumnos();
				} else {
					msgPopupStore.showError((registrarAlumnos.error.value.data as any).message);
				}
			} catch (error) {
				const err = error as any;
				msgPopupStore.showError(err.data?.message ?? 'No se pudo registrar el alumno');
			} finally {
				this.pending = false;
			}
		},
		async ActualizarAlumno(request: ActualizarAlumno) {
			const { $api } = useNuxtApp();
			const msgPopupStore = useMsgPopUpStore();
			this.pending = true;
			this.paginado.pagina = 1;
			this.activeFilter = false;
			this.activeList = true;
			try {
				const actualizarAlumnos = await $api.alumno.actualizarAlumno(request);
				if(!actualizarAlumnos.error.value){
					msgPopupStore.showSuccess('Se actualizo Correctamente')
					this.lista = [];
					await this.getAlumnos();
				} else {
					msgPopupStore.showError((actualizarAlumnos.error.value.data as any).message);
				}
			} catch (error) {
				const err = error as any;
				msgPopupStore.showError(err.data?.message ?? 'No se pudo actualizar el alumno');
			} finally {
				this.pending = false;
			}
		},
		async EliminarAlumno(numeroDocumento: string) {
			const { $api } = useNuxtApp();
			const msgPopupStore = useMsgPopUpStore();
			this.paginado.pagina = 1;
			this.activeFilter = false;
			this.activeList = true;
			const eliminarAlumnos = await $api.alumno.eliminarAlumno(numeroDocumento);

			if(!eliminarAlumnos.error.value){
				msgPopupStore.showSuccess('Se elimino Correctamente')
				this.pending = true;
				this.lista = [];
				this.getAlumnos()
			}

			if(eliminarAlumnos.error.value){
				msgPopupStore.showError((eliminarAlumnos.error.value.data as any).message)
			}
		},
		async FiltrarAlumno(value: string) {
			const { $api } = useNuxtApp();
			const tokenStore = useTokenStore();
			const msgPopupStore = useMsgPopUpStore();
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

			if(filtroAlumnos.error.value){
				this.pendingTable = false;
				this.lista = [];
				if(filtroAlumnos.error.value.statusCode !== 404){
				    msgPopupStore.showError((filtroAlumnos.error.value.data as any).message)
				}
			}
		},	
	},
});
