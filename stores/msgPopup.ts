
import { defineStore } from 'pinia';

interface ErrorPopUp {
	status: boolean;
	message: string;
}

interface ErrorPopUpStore {
	error: ErrorPopUp;
	tipoModal: 'success' | 'error';
}

export const useMsgPopUpStore = defineStore('PopUpMsgStore', {
	state: (): ErrorPopUpStore => ({
		error: {
            status: false,
            message: '',
        },
        tipoModal: 'success'
    }),
	actions: {
		setError(status: boolean, message: string, tipoModal: 'success' | 'error' = 'success'){
            this.error = { status, message };
			this.tipoModal = tipoModal;
		},
	},
});
