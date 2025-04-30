import { defineStore } from 'pinia';
import type { Course, Paginado, RegistrarCurso, ActualizarCurso } from '~/types/gestionCursos.types';
import { useMsgPopUpStore } from './msgPopup';

interface ErrorCampo {
	[key: string]: string
}

interface cursoStoreStatus {
    lista: Course[];
	pending: boolean;
	pendingTable: boolean;
	paginado: Paginado;
	total: number;
	activeList: boolean;
	activeFilter: boolean;
	errorForm: string[];
	msgError: ErrorCampo | null;
}
export const useCursoStore = defineStore('cursoStore', {
	state: (): cursoStoreStatus => ({
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
		setLista(data: Course[]){
           this.lista = data;
        },
		setErrorForm(data: string[]){
			const msgPopupStore = useMsgPopUpStore();
			this.errorForm = data;
			if(data.length) msgPopupStore.tipoModal = 'error';
		},
		setPagina(pagina: number){
           this.paginado.pagina = pagina;
		},
		resetCursos() {
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
		async getCursos(){
			const tokenStore = useTokenStore();
			const { $api } = useNuxtApp();
			this.activeList = true;
            this.pendingTable = true;
			this.lista = [];
			const request = {
				codigoSede: tokenStore.getDataToken.Codigo_Sede,
				...this.paginado
			}

            const listaCursos = await $api.gestionCursos.obtenerCursosPorSede(request);

			if(!listaCursos.error.value && listaCursos.data.value?.data.length){
				this.pendingTable = false;
				this.setLista(listaCursos.data.value.data);
				if(this.activeFilter){
					this.total = listaCursos.data.value.data[0].total;
					this.activeFilter = false;
				}
				if(this.total == 0 && !this.activeFilter){
					this.total = listaCursos.data.value.data[0].total;
				}

				if(this.total > 0 && this.activeList){
					this.total = listaCursos.data.value.data[0].total;
				}
			}

			if(listaCursos.error.value){
				this.pendingTable = false;
				this.lista = [];
				if(listaCursos.error.value.statusCode !== 404){
					const msgPopupStore = useMsgPopUpStore();
					msgPopupStore.setError(true, (listaCursos.error.value.data as any).message, 'error')
				}
			}
			this.pending = false;
		},
		async RegistrarCurso(request: RegistrarCurso) {
			const { $api } = useNuxtApp();
			const msgPopupStore = useMsgPopUpStore();
			msgPopupStore.setError(false, '')
			this.paginado.pagina = 1;
			this.activeFilter = false;
			this.activeList = true;
			const registrarCursos = await $api.gestionCursos.registrarCurso(request);

			if(!registrarCursos.error.value){
				msgPopupStore.setError(true, 'Se registró correctamente')
				this.pending = true;
				this.lista = [];
				this.getCursos();
			}

			if(registrarCursos.error.value){
				msgPopupStore.setError(true, (registrarCursos.error.value.data as any).message, 'error')
			}
		},
		async ActualizarCurso(request: ActualizarCurso) {
			const { $api } = useNuxtApp();
			const msgPopupStore = useMsgPopUpStore();
			msgPopupStore.setError(false, '')
			this.paginado.pagina = 1;
			this.activeFilter = false;
			this.activeList = true;
			const actualizarCursos = await $api.gestionCursos.actualizarCurso(request);

			if(!actualizarCursos.error.value){
				msgPopupStore.setError(true, 'Se actualizó correctamente')
				this.pending = true;
				this.lista = [];
				this.getCursos();
			}

			if(actualizarCursos.error.value){
				msgPopupStore.setError(true, (actualizarCursos.error.value.data as any).message, 'error')
			}
		},
		async EliminarCurso(idCurso: number) {
			const { $api } = useNuxtApp();
			const msgPopupStore = useMsgPopUpStore();
			msgPopupStore.setError(false, '')
			this.paginado.pagina = 1;
			this.activeFilter = false;
			this.activeList = true;
			const eliminarCursos = await $api.gestionCursos.eliminarCurso(idCurso);

			if(!eliminarCursos.error.value){
				msgPopupStore.setError(true, 'Se eliminó correctamente')
				this.pending = true;
				this.lista = [];
				this.getCursos();
			}

			if(eliminarCursos.error.value){
				msgPopupStore.setError(true, (eliminarCursos.error.value.data as any).message, 'error')
			}
		},
		async FiltrarCurso(value: string) {
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

			const filtroCursos = await $api.gestionCursos.filtrarCursos(request);

			if(!filtroCursos.error.value && filtroCursos.data.value?.data){
				this.pendingTable = false;
				this.lista = filtroCursos.data.value.data;
				if(this.activeList){
					this.total = filtroCursos.data.value.data[0].total;
					this.activeList = false;
				}
				if(this.total == 0 && !this.activeList){
					this.total = filtroCursos.data.value.data[0].total;
				}

				if(this.total >0 && this.activeFilter){
					this.total = filtroCursos.data.value.data[0].total;
				}
			}

			if(filtroCursos.error.value){
				this.pendingTable = false;
				this.lista = [];
				if(filtroCursos.error.value.statusCode !== 404){
				    msgPopupStore.setError(true, (filtroCursos.error.value.data as any).message, 'error')
				}
			}
		},	
	},
});
