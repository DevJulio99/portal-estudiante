
import { defineStore } from 'pinia';

interface ErrorPopUp {
	status: boolean;
	message: string;
}

interface ErrorPopUpStore {
	error: ErrorPopUp;
	tipoModal: 'success' | 'error';
}

export const useErrorPopUpStore = defineStore('PopUpErrorStore', {
	state: (): ErrorPopUpStore => ({
		error: {
            status: false,
            message: '',
        },
        tipoModal: 'success'
    }),
	actions: {
		setError(status: boolean, message: string){
            this.error = { status, message };
			if(status) this.tipoModal = 'error';
		},
	},
});
