import { defineStore } from 'pinia';

export const usePagoStore = defineStore('PagoStore', {
	state: () => {
		return {
			idPago: 0,
		};
	},
	actions: {
		setPago(id: number) {
			this.idPago = id;
		},
        limpiarPago() {
            this.idPago = 0;
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
			
            this.limpiarPago();
			if(serviceImagenPago.data.value?.error) return	
            
            await $api.pagos.getPagosPendientes(parseInt(tokenStore.getDataToken.Id_Alumno), new Date().getFullYear(), {
                lazy: true,
            })
		}
	},
});
