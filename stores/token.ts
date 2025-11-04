import { defineStore } from 'pinia';
import { decryptJWT } from '~/utils/functions';

export const useTokenStore = defineStore('tokenStore', {
	state: () => ({
        logued: false,
		pending: false,
		isLoggingOut: false, // Nuevo estado para controlar el cierre de sesión
		accessToken: typeof window !== 'undefined' && localStorage.getItem('access') ? JSON.parse(localStorage.getItem('access') as any).accessToken : '',
		refreshToken: typeof window !== 'undefined' && localStorage.getItem('access') ? JSON.parse(localStorage.getItem('access') as any).refreshToken : ''
	}),
	getters:{
        getDataToken: (state) => {
			const jtw = decryptJWT(state.accessToken)
			return jtw
		}
	},
	actions: {
		setToken(accessToken: string, refreshToken: string) {
			this.accessToken = accessToken;
            this.refreshToken = refreshToken;
            this.logued = true;
		},
        async clearTokens() {
			// 1. Mostramos la pantalla de "Cargando...".
			this.pending = true;

			// 2. Esperamos un breve momento para que la UI se actualice y muestre el loader.
			await new Promise(resolve => setTimeout(resolve, 100));

			// 3. Limpiamos el estado de la sesión.
			localStorage.removeItem('access');

			// 4. Forzamos una recarga completa a la página de login.
			//    Esto destruye el estado actual de la app y evita cualquier condición de carrera.
			window.location.href = '/login';
		},
		setPending(status: boolean) {
			this.pending = status;
		},
		setIsLoggingOut(status: boolean) {
			this.isLoggingOut = status;
		}
	},
});
