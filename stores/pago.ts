import { defineStore } from 'pinia';
import type { Paginado } from '~/types/alumno.types';
import type { PagosPendientesData } from '~/types/pagos.types';
import { useMsgPopUpStore } from './msgPopup';

interface PagoStore {
	idPago: number;
	pending: boolean;
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
		   this.paginado = {
			pagina : 1,
			itemsPorPagina: 2
		   },
		   this.total = 0;
		},
		async listarPagos() {
			this.pending = true;
			const { $api } = useNuxtApp();
			const tokenStore = useTokenStore();
			const request = {
                codigoSede: tokenStore.getDataToken.Codigo_Sede,
                ...this.paginado
            }
			const servicePagos = await $api.pagos.getPagosPorSede(request);

			console.log('servicePagos', servicePagos)

			if(!servicePagos.error.value && servicePagos.data.value?.data.length){
				if(this.total <= 0) this.total = servicePagos.data.value.data[0].total;
				this.lista = servicePagos.data.value.data; 
			}

			if(servicePagos.error.value){
				this.lista = []
				const msgPopupStore = useMsgPopUpStore();
				console.log('servicePagos.error.value', servicePagos.error.value.data)
				msgPopupStore.setError(true, (servicePagos.error.value.data as any)?.message, 'error');
			}

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
