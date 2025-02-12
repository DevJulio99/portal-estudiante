import { defineStore } from 'pinia';
import { decryptJWT } from '~/utils/functions';

export const useTokenStore = defineStore('tokenStore', {
	state: () => ({
        logued: false,
		pending: false,
		accessToken: localStorage.getItem('access') ? JSON.parse(localStorage.getItem('access') as any).accessToken : '',
		refreshToken: localStorage.getItem('access') ? JSON.parse(localStorage.getItem('access') as any).refreshToken : ''
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
			this.pending = true;
			setTimeout(() => {
				this.pending = false;
			}, 1000);
		},
        clearTokens() {
            localStorage.removeItem('access');
			this.accessToken = '';
            this.refreshToken = '';
            this.logued = false;
			this.pending = true;
			setTimeout(() => {
				this.pending = false;
			}, 1000);
		}
	},
});
