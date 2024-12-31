import { defineStore } from 'pinia';
export const useTokenStore = defineStore('tokenStore', {
	state: () => ({
        logued: false,
		pending: false,
		accessToken: localStorage.getItem('access') ? JSON.parse(localStorage.getItem('access') as any).accessToken : '',
		refreshToken: localStorage.getItem('access') ? JSON.parse(localStorage.getItem('access') as any).refreshToken : ''
	}),
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
		}
	},
});
