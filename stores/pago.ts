import { defineStore } from 'pinia';
import type { Paginado } from '~/types/alumno.types';
import type { PagosPendientesData } from '~/types/pagos.types';
import type { ErrorResponse } from '~/types/services.types';
import { useMsgPopUpStore } from './msgPopup';

interface PagoStore {
	idPago: number;
	pending: boolean;
	error: any;
	servicesError: any;
	lista: PagosPendientesData[];
	paginado: Paginado;
	total: number;
	imagenRegistrada: boolean;
}

export const usePagoStore = defineStore('PagoStore', {
	state: ():PagoStore => {
		return {
			idPago: 0,
			lista: [],
			pending: true,
			error: null,
			servicesError: null,
			paginado: {
				pagina : 1,
				itemsPorPagina : 2
			},
			total: 0,
			imagenRegistrada: false
		};
	},
	actions: {
		setPago(id: number) {
			this.idPago = id;
		},
        limpiarPago() {
            this.idPago = 0;
        },
		resetPagos() {
           this.pending = true;
		   this.lista = [];
		   this.idPago = 0;
		   this.error = null;
		   this.servicesError = null;
		   this.paginado = {
			pagina : 1,
			itemsPorPagina: 2
		   },
		   this.total = 0;
		},
		async listarPagos() {
			this.pending = true;
			const { $api } = useNuxtApp();
			const request = {
                codigoSede: '', // El backend no usa este valor, lo obtiene del contexto del tenant
                ...this.paginado
            }
			const servicePagos = await $api.pagos.getPagosPorSede(request);

			if(!servicePagos.error.value && servicePagos.data.value?.data.length){
				if(this.total <= 0) this.total = servicePagos.data.value.data[0].total;
				this.lista = servicePagos.data.value.data; 
			}

			if(servicePagos.error.value){
				this.lista = []
				const msgPopupStore = useMsgPopUpStore();
				msgPopupStore.showError((servicePagos.error.value.data as any)?.message);
			}

			this.pending = false;
		},
		async listarPagosPendientes() {
			this.pending = true;
			const { $api } = useNuxtApp();
			const tokenStore = useTokenStore();
			const request = {
                codigoSede: tokenStore.getDataToken.Codigo_Sede,
                ...this.paginado
            }
			const { data, error, pending } = await $api.pagos.getPagosPendientes(parseInt(tokenStore.getDataToken.Id_Alumno), new Date().getFullYear());

			if (data.value?.data?.length) {
				this.lista = data.value.data;
				this.servicesError = null;
				this.error = null;
			} else if (data.value?.error) {
				this.servicesError = data.value.error;
				this.lista = [];
			}
			
			this.error = error.value;

			this.pending = false;
		},
		async registrarImagenPago(img: string) {
            const tokenStore = useTokenStore();
            const pagoValido = this.idPago > 0;
            const imgValido = img.trim().length > 0;

			if(!pagoValido || !imgValido) return
			const { $api } = useNuxtApp();
            const request = {
                idPago: this.idPago,
                imagen: img
            }
			const serviceImagenPago = await $api.imagenPago.registrarImagenPago(
				request
			  );
			this.imagenRegistrada = true;
			setTimeout(() => {
				this.imagenRegistrada = false;
			}, 0);
            this.limpiarPago();
			if(serviceImagenPago.data.value?.error) return	
            
            await $api.pagos.getPagosPendientes(parseInt(tokenStore.getDataToken.Id_Alumno), new Date().getFullYear(), {
                lazy: true,
            })
		}
	},
});
