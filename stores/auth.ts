import { defineStore } from 'pinia';
export const useUserStoreAuth = defineStore('userdata', {
	state: () => ({
		user: {} as any,
		codAlum: '',
		sessionExpired: false,
	}),
	actions: {
		setSessionExpired(expired: boolean) {
			this.sessionExpired = expired;
		},
		setUserCod(cod: string) {
			this.codAlum = cod;
		},
	},
});
